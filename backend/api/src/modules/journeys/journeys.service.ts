import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../shared/errors.js";
import { toRecord } from "../ev/ev.repository.js";
import { toEvProfileSummary } from "../ev/ev.store.js";
import { toEnergyContext } from "../ev/ev.service.js";
import { evaluateCandidateRoutes } from "../routing/routing.service.js";
import { recommendChargingCandidates } from "../charging/charging.service.js";
import { composeJourneyRecommendation } from "../recommendation/recommendation-orchestrator.service.js";
import { trafficDiversificationEngine, type DiversificationRouteInput } from "../traffic/diversification.service.js";
import type { IntegratedJourneyEvaluationRequest } from "../journey/journey.schemas.js";

export class JourneysService {
  static async list(userId: string, isAdmin: boolean, page = 1, limit = 20) {
    const where = isAdmin ? {} : { userId };
    const skip = (page - 1) * limit;
    const [total, journeys] = await Promise.all([
      prisma.journey.count({ where }),
      prisma.journey.findMany({
        where,
        skip,
        take: limit,
        include: { vehicle: true, routes: true, recommendations: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);
    return { journeys, meta: { page, limit, total } };
  }

  static async getById(id: string) {
    const journey = await prisma.journey.findUnique({
      where: { id },
      include: { vehicle: true, routes: { include: { segments: true } }, recommendations: true },
    });
    if (!journey) {
      throw new AppError("Journey not found.", 404, "JOURNEY_NOT_FOUND");
    }
    return journey;
  }

  static async plan(userId: string, input: any) {
    const vehicle = await prisma.eVVehicle.findUnique({ where: { id: input.vehicleId } });
    if (!vehicle) {
      throw new AppError("Specified vehicle not found.", 404, "VEHICLE_NOT_FOUND");
    }

    const journey = await prisma.journey.create({
      data: {
        userId,
        vehicleId: input.vehicleId,
        originLabel: input.originLabel,
        destinationLabel: input.destinationLabel,
        status: "PLANNED",
      },
      include: { vehicle: true },
    });

    return journey;
  }

  static async cancel(id: string) {
    const journey = await prisma.journey.update({
      where: { id },
      data: { status: "CANCELLED" },
    });
    return journey;
  }

  /**
   * Runs the real routing/energy/charging-recommendation engine
   * (journey/routing/charging/recommendation modules) for the caller's own
   * vehicle, then persists Journey + Route (+ Recommendation, when the engine
   * names a station) so the result is auditable and re-fetchable by id.
   *
   * Mirrors journey/journey.service.ts's evaluateIntegratedJourney exactly,
   * except the vehicle is resolved via an ownership-checked EVVehicle lookup
   * instead of the unauthenticated demo evRepository.
   */
  static async evaluate(userId: string, input: IntegratedJourneyEvaluationRequest) {
    const vehicleRow = await prisma.eVVehicle.findUnique({ where: { id: input.vehicleId } });
    if (!vehicleRow) {
      throw new AppError(`No EV vehicle found with id "${input.vehicleId}".`, 404, "VEHICLE_NOT_FOUND");
    }
    if (vehicleRow.userId !== userId) {
      throw new AppError("You do not own this vehicle.", 403, "FORBIDDEN");
    }

    const vehicleSnapshot = toEvProfileSummary({
      ...toRecord(vehicleRow),
      currentSocPercent: input.currentSocPercent ?? vehicleRow.currentSocPercent,
      reserveSocPercent: input.reserveSocPercent ?? vehicleRow.reserveSocPercent,
    });
    const energyContext = toEnergyContext(vehicleSnapshot);

    const routeEvaluation = await evaluateCandidateRoutes({
      origin: input.origin,
      destination: input.destination,
      vehicle: {
        id: energyContext.vehicleId,
        vehicleClass: energyContext.vehicleClass,
        connectorTypes: energyContext.connectorTypes,
        batteryCapacityKwh: energyContext.batteryCapacityKwh,
        usableBatteryCapacityKwh: energyContext.usableCapacityKwh,
        efficiencyWhPerKm: energyContext.efficiencyWhPerKm,
        currentSocPercent: energyContext.currentSocPercent,
        availableEnergyKwh: energyContext.availableEnergyKwh,
        reserveEnergyKwh: energyContext.reserveEnergyKwh,
        usableEnergyKwh: energyContext.usableAboveReserveKwh,
      },
      reserveSocPercent: energyContext.reserveSocPercent,
      environmentFactor: input.environmentFactor,
      environment: input.environment,
      auxiliaryLoadKwh: input.auxiliaryLoadKwh,
      provider: input.provider,
      trafficHorizon: input.trafficHorizon,
    });

    const diversificationRoutes = routeEvaluation.routes.flatMap<DiversificationRouteInput>((route) =>
      route.traffic
        ? [
            {
              routeId: route.routeId,
              trafficRouteId: route.traffic.routeId,
              name: route.name,
              durationMinutes: route.estimatedEtaMinutes,
              energyKwh: route.estimatedEnergyKwh,
              currentLoad: route.traffic.currentLoad,
              predictedLoad: route.traffic.predictedLoad,
              capacity: route.traffic.capacity,
              vehicleEligibility: route.traffic.vehicleEligibility,
              sourceMode: route.traffic.sourceMode,
            },
          ]
        : [],
    );
    const diversification = trafficDiversificationEngine.assign({
      routes: diversificationRoutes,
      vehicleClass: energyContext.vehicleClass,
      simulationId: input.diversificationSimulationId,
      demandUnits: input.projectedDemandUnits,
    });

    const selectedRoute =
      routeEvaluation.routes.find((route) => route.routeId === diversification.recommendedRouteId) ??
      routeEvaluation.routes[0];
    const chargingRecommendation = selectedRoute?.chargingRequired
      ? await recommendChargingCandidates({
          stationIds: selectedRoute.chargerCandidates.map((candidate) => candidate.id),
          connectorTypes: energyContext.connectorTypes,
          routeGeometry: selectedRoute.geometry,
          origin: input.origin,
          maximumReachKm: (energyContext.usableAboveReserveKwh * 1_000) / energyContext.efficiencyWhPerKm,
        })
      : null;
    const routes = routeEvaluation.routes.map((route) =>
      route.routeId === selectedRoute?.routeId
        ? {
            ...route,
            recommendedChargingStop: chargingRecommendation?.primary
              ? {
                  id: chargingRecommendation.primary.stationId,
                  name: chargingRecommendation.primary.stationName,
                  availableChargers: chargingRecommendation.primary.availablePorts,
                  powerKw: chargingRecommendation.primary.powerKw,
                  reliabilityScore: chargingRecommendation.primary.reliability.score,
                }
              : null,
          }
        : route,
    );

    const chargingIntelligence = {
      required: selectedRoute?.chargingRequired ?? false,
      routeId: selectedRoute?.routeId ?? null,
      energyDeficitKwh: selectedRoute?.energy.energyDeficitKwh ?? 0,
      sourceMode: chargingRecommendation?.sourceMode ?? ("DEMO" as const),
      isSimulated: chargingRecommendation?.isSimulated ?? (true as const),
      generatedAt: chargingRecommendation?.generatedAt ?? new Date().toISOString(),
      primary: chargingRecommendation?.primary ?? null,
      backup: chargingRecommendation?.backup ?? null,
      candidates: chargingRecommendation?.candidates ?? [],
      excludedCandidates: chargingRecommendation?.excludedCandidates ?? [],
      disclaimer:
        chargingRecommendation?.disclaimer ??
        "No charging stop is required for the selected route under the current estimate.",
    };
    const recommendation = composeJourneyRecommendation({
      generatedAt: routeEvaluation.generatedAt,
      routeSourceMode: routeEvaluation.sourceMode,
      routes,
      diversification,
      charging: chargingIntelligence,
    });

    const journey = await prisma.journey.create({
      data: {
        userId,
        vehicleId: input.vehicleId,
        originLabel: input.origin.label || "Origin",
        destinationLabel: input.destination.label || "Destination",
        status: "PLANNED",
      },
    });

    let persistedRouteId: string | null = null;
    if (selectedRoute) {
      const routeRow = await prisma.route.create({
        data: {
          journeyId: journey.id,
          distanceKm: selectedRoute.distanceKm,
          durationMinutes: selectedRoute.estimatedEtaMinutes,
          energyRequiredKwh: selectedRoute.energy.requiredKwh,
          congestionScore: selectedRoute.traffic?.currentLoadPercent ?? 0,
          geometryJson: selectedRoute.geometry as unknown as Prisma.InputJsonValue,
        },
      });
      persistedRouteId = routeRow.id;
    }

    if (recommendation.recommendedStationId) {
      const stationExists = await prisma.chargingStation.findUnique({
        where: { id: recommendation.recommendedStationId },
        select: { id: true },
      });
      if (stationExists) {
        await prisma.recommendation.create({
          data: {
            journeyId: journey.id,
            routeId: persistedRouteId,
            stationId: recommendation.recommendedStationId,
            score: recommendation.reliabilityScore ?? 0,
            explanation: recommendation.reasons.join(" ") || "Recommended based on route energy needs.",
          },
        });
      }
    }

    return {
      ...routeEvaluation,
      routes,
      vehicleSnapshot,
      diversification,
      chargingIntelligence,
      recommendation,
      integration: {
        modules: [
          "EV_PROFILE",
          "ROUTING_ENERGY",
          "TRAFFIC_TWIN",
          "TRAFFIC_DIVERSIFICATION",
          "CHARGING_STATION_INTELLIGENCE",
          "CHARGER_RELIABILITY",
          "RECOMMENDATION_ORCHESTRATOR",
        ],
        trafficHorizon: input.trafficHorizon,
      },
      journeyId: journey.id,
      routeId: persistedRouteId,
    };
  }
}
