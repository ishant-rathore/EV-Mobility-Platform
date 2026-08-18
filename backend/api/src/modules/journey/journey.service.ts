import { AppError } from "../../shared/errors.js";
import { toEnergyContext } from "../ev/ev.service.js";
import { evRepository, toEvProfileSummary } from "../ev/ev.store.js";
import { evaluateCandidateRoutes } from "../routing/routing.service.js";
import {
  trafficDiversificationEngine,
  type DiversificationRouteInput,
} from "../traffic/diversification.service.js";
import type { IntegratedJourneyEvaluationRequest } from "./journey.schemas.js";

export { buildRecommendation as planJourney } from "../recommendation/recommendation.service.js";

/**
 * Server-owned Module 1 → 2 → 3 → 4 orchestration. Only the vehicle id and
 * explicit planning overrides cross the HTTP boundary; battery health,
 * efficiency, connector and vehicle-class data come from Module 1.
 */
export async function evaluateIntegratedJourney(input: IntegratedJourneyEvaluationRequest) {
  const storedVehicle = await evRepository.findById(input.vehicleId);
  if (!storedVehicle) {
    throw new AppError(
      `No EV vehicle found with id "${input.vehicleId}".`,
      404,
      "EV_VEHICLE_NOT_FOUND",
    );
  }

  const vehicleSnapshot = toEvProfileSummary({
    ...storedVehicle,
    currentSocPercent: input.currentSocPercent ?? storedVehicle.currentSocPercent,
    reserveSocPercent: input.reserveSocPercent ?? storedVehicle.reserveSocPercent,
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

  const diversificationRoutes = routeEvaluation.routes.flatMap<DiversificationRouteInput>(
    (route) =>
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

  return {
    ...routeEvaluation,
    vehicleSnapshot,
    diversification,
    integration: {
      modules: [
        "EV_PROFILE",
        "ROUTING_ENERGY",
        "TRAFFIC_TWIN",
        "TRAFFIC_DIVERSIFICATION",
      ],
      trafficHorizon: input.trafficHorizon,
    },
  };
}
