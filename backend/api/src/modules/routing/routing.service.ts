import { DemoRoutingProvider } from "../../integrations/maps/demo-routing.provider.js";
import { OsrmRoutingProvider } from "../../integrations/maps/osrm.provider.js";
import type { RouteOption, RoutingProvider } from "../../integrations/maps/routing.provider.js";
import {
  DEMO_STATIONS,
  DemoStationProvider,
} from "../../integrations/charging-providers/demo-station.provider.js";
import {
  recommendChargingStop,
  selectChargingStopCandidates,
} from "./charging-stops.service.js";
import { estimateRouteEnergy } from "./energy.service.js";
import {
  calculateEnvironmentAdjustment,
  type EnvironmentAdjustment,
} from "./environment-factor.service.js";
import { estimateRouteSegments } from "./route-segments.service.js";
import type { EnergyEstimateInput, EvaluatedRoute, RouteEvaluationInput, RouteEvaluationResult } from "./routing.types.js";
import { getControlledRouteTrafficSnapshot } from "../traffic/demo-traffic.service.js";

const DEFAULT_EFFICIENCY_WH_PER_KM = 180;
const DEFAULT_ENVIRONMENT_FACTOR = 1.05;
const DEFAULT_AUXILIARY_LOAD_KWH = 0.5;
const stationProvider = new DemoStationProvider();

function environmentAdjustmentForRoute(
  input: RouteEvaluationInput,
  distanceKm: number,
): EnvironmentAdjustment {
  const calculated = calculateEnvironmentAdjustment({
    ...input.environment,
    distanceKm,
  });
  return input.environmentFactor === undefined
    ? calculated
    : { ...calculated, combinedFactor: input.environmentFactor, sourceMode: "MANUAL" };
}

const demoRouteTemplates: Array<{
  routeId: string;
  name: string;
  distanceKm: number;
  baseEtaMinutes: number;
  geometry: Array<{ latitude: number; longitude: number }>;
}> = [
  {
    routeId: "route-north",
    name: "Northern Corridor (NH-48)",
    distanceKm: 45.2,
    baseEtaMinutes: 45,
    geometry: [
      { latitude: 19.076, longitude: 72.8777 },
      { latitude: 19.15, longitude: 72.95 },
      { latitude: 19.25, longitude: 73.05 },
    ],
  },
  {
    routeId: "route-central",
    name: "Central Expressway",
    distanceKm: 32.8,
    baseEtaMinutes: 38,
    geometry: [
      { latitude: 19.076, longitude: 72.8777 },
      { latitude: 19.12, longitude: 72.92 },
      { latitude: 19.2, longitude: 73.0 },
    ],
  },
  {
    routeId: "route-south",
    name: "Southern Ring Road",
    distanceKm: 38.5,
    baseEtaMinutes: 42,
    geometry: [
      { latitude: 19.076, longitude: 72.8777 },
      { latitude: 19.02, longitude: 72.85 },
      { latitude: 18.95, longitude: 72.9 },
    ],
  },
  {
    routeId: "route-east",
    name: "Eastern Bypass",
    distanceKm: 28.3,
    baseEtaMinutes: 30,
    geometry: [
      { latitude: 19.076, longitude: 72.8777 },
      { latitude: 19.1, longitude: 72.93 },
      { latitude: 19.15, longitude: 72.98 },
    ],
  },
];

function buildEvaluatedRoute(
  template: (typeof demoRouteTemplates)[0],
  input: RouteEvaluationInput,
  usePredictedTraffic: boolean = false,
): EvaluatedRoute {
  const traffic = getControlledRouteTrafficSnapshot(
    template.routeId,
    usePredictedTraffic ? "PREDICTED" : "CURRENT",
    input.vehicle.vehicleClass,
  );
  const trafficFactor = traffic?.travelTimeMultiplier ?? 1;

  const environmentAdjustment = environmentAdjustmentForRoute(input, template.distanceKm);
  const energyInput: EnergyEstimateInput = {
    distanceKm: template.distanceKm,
    batteryCapacityKwh: input.vehicle.batteryCapacityKwh,
    usableBatteryCapacityKwh: input.vehicle.usableBatteryCapacityKwh,
    efficiencyWhPerKm: input.vehicle.efficiencyWhPerKm ?? DEFAULT_EFFICIENCY_WH_PER_KM,
    currentSocPercent: input.vehicle.currentSocPercent,
    reserveSocPercent: input.reserveSocPercent,
    availableEnergyKwh: input.vehicle.availableEnergyKwh,
    reserveEnergyKwh: input.vehicle.reserveEnergyKwh,
    usableEnergyKwh: input.vehicle.usableEnergyKwh,
    trafficFactor,
    environmentFactor: environmentAdjustment.combinedFactor,
    auxiliaryLoadKwh: input.auxiliaryLoadKwh,
  };

  const energy = estimateRouteEnergy(energyInput);
  const chargerCandidates = selectChargingStopCandidates(
    DEMO_STATIONS.map((station) => station.id),
    DEMO_STATIONS,
  );

  return {
    routeId: template.routeId,
    name: template.name,
    sourceMode: "DEMO",
    distanceKm: template.distanceKm,
    baseEtaMinutes: template.baseEtaMinutes,
    trafficFactor: Number(trafficFactor.toFixed(2)),
    ...(traffic ? { traffic } : {}),
    estimatedEtaMinutes: Math.round(template.baseEtaMinutes * trafficFactor),
    estimatedEnergyKwh: energy.requiredKwh,
    estimatedArrivalSocPercent: energy.projectedArrivalSocPercent,
    chargingRequired: energy.chargingRequired,
    energy,
    environmentAdjustment,
    chargerCandidates,
    recommendedChargingStop: recommendChargingStop(energy.chargingRequired, chargerCandidates),
    segments: estimateRouteSegments(template.geometry, template.distanceKm, energy.requiredKwh),
    geometry: template.geometry,
  };
}

function providerFor(mode: "DEMO" | "OSRM"): RoutingProvider {
  return mode === "OSRM" ? new OsrmRoutingProvider() : new DemoRoutingProvider();
}

async function loadRouteOptions(input: RouteEvaluationInput): Promise<{
  options: RouteOption[];
  sourceMode: "DEMO" | "OSRM";
  fallbackReason?: string;
}> {
  if (input.provider !== "AUTO") {
    return {
      options: await providerFor(input.provider).findRoutes(input.origin, input.destination),
      sourceMode: input.provider,
    };
  }

  try {
    const options = await providerFor("OSRM").findRoutes(input.origin, input.destination);
    if (options.length > 0) {
      return { options, sourceMode: "OSRM" };
    }
    throw new Error("OSRM returned no route alternatives");
  } catch (error) {
    return {
      options: await providerFor("DEMO").findRoutes(input.origin, input.destination),
      sourceMode: "DEMO",
      fallbackReason: error instanceof Error ? error.message : "OSRM routing failed",
    };
  }
}

export async function evaluateCandidateRoutes(
  input: RouteEvaluationInput,
): Promise<RouteEvaluationResult> {
  const [{ options, sourceMode, fallbackReason }, stations] = await Promise.all([
    loadRouteOptions(input),
    stationProvider.listStations(),
  ]);
  const routes: EvaluatedRoute[] = options.map((route, index) => {
    const traffic =
      sourceMode === "DEMO" && route.trafficRouteId
        ? getControlledRouteTrafficSnapshot(
            route.trafficRouteId,
            input.trafficHorizon ?? "CURRENT",
            input.vehicle.vehicleClass,
          )
        : undefined;
    const trafficFactor = traffic?.travelTimeMultiplier ?? route.trafficFactor ?? 1;
    const environmentAdjustment = environmentAdjustmentForRoute(input, route.distanceKm);
    const energy = estimateRouteEnergy({
      distanceKm: route.distanceKm,
      batteryCapacityKwh: input.vehicle.batteryCapacityKwh,
      usableBatteryCapacityKwh: input.vehicle.usableBatteryCapacityKwh,
      efficiencyWhPerKm: input.vehicle.efficiencyWhPerKm,
      currentSocPercent: input.vehicle.currentSocPercent,
      reserveSocPercent: input.reserveSocPercent,
      availableEnergyKwh: input.vehicle.availableEnergyKwh,
      reserveEnergyKwh: input.vehicle.reserveEnergyKwh,
      usableEnergyKwh: input.vehicle.usableEnergyKwh,
      trafficFactor,
      environmentFactor: environmentAdjustment.combinedFactor,
      auxiliaryLoadKwh: input.auxiliaryLoadKwh,
    });
    const candidateIds = route.chargerCandidateIds ?? stations.map((station) => station.id);
    const chargerCandidates = selectChargingStopCandidates(candidateIds, stations);

    return {
      routeId: route.id,
      name: route.name ?? `Route ${index + 1}`,
      sourceMode,
      distanceKm: route.distanceKm,
      baseEtaMinutes: route.durationMinutes,
      trafficFactor: energy.trafficFactor,
      ...(traffic ? { traffic } : {}),
      estimatedEtaMinutes: Math.ceil(route.durationMinutes * trafficFactor),
      estimatedEnergyKwh: energy.requiredKwh,
      estimatedArrivalSocPercent: energy.projectedArrivalSocPercent,
      chargingRequired: energy.chargingRequired,
      energy,
      environmentAdjustment,
      chargerCandidates,
      recommendedChargingStop: recommendChargingStop(energy.chargingRequired, chargerCandidates),
      segments: estimateRouteSegments(route.geometry, route.distanceKm, energy.requiredKwh),
      geometry: route.geometry,
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    requestedProvider: input.provider,
    sourceMode,
    ...(fallbackReason ? { fallbackReason } : {}),
    origin: input.origin,
    destination: input.destination,
    routes,
  };
}

export function evaluateRoutes(input: RouteEvaluationInput, usePredictedTraffic: boolean = false): RouteEvaluationResult {
  const routes = demoRouteTemplates.map((template) =>
    buildEvaluatedRoute(template, input, usePredictedTraffic),
  );

  return {
    generatedAt: new Date().toISOString(),
    requestedProvider: input.provider,
    sourceMode: "DEMO",
    origin: input.origin,
    destination: input.destination,
    routes,
  };
}

export function evaluateRoute(input: EnergyEstimateInput) {
  const trafficFactor = input.trafficFactor ?? 1.0;
  return {
    routeId: crypto.randomUUID(),
    energy: estimateRouteEnergy(input),
    trafficFactor,
  };
}
