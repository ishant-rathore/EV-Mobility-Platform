import type { TrafficRoute } from "./traffic.schemas.js";

export interface RouteCandidate {
  routeId: string;
  name: string;
  distanceKm: number;
  durationMinutes: number;
  congestionScore: number;
  currentLoad: number;
  predictedLoad: number;
  capacity: number;
  vehicleEligibility: string[];
  travelTimeMultiplier: number;
  projectedLoad: number;
}

function toCandidate(route: TrafficRoute): RouteCandidate {
  const avgCongestionScore = route.segments.reduce((sum, s) => {
    const speedRatio = Math.min(1, s.observedSpeedKph / s.freeFlowSpeedKph);
    const occupancyPenalty = s.occupancyPercent / 200;
    return sum + Math.max(0, Math.min(100, (1 - speedRatio + occupancyPenalty) * 100));
  }, 0) / route.segments.length;

  const avgTravelTimeMultiplier = route.segments.reduce(
    (sum, s) => sum + (1 + avgCongestionScore / 100),
    0,
  ) / route.segments.length;

  return {
    routeId: route.routeId,
    name: route.name,
    distanceKm: route.distanceKm,
    durationMinutes: route.distanceKm * avgTravelTimeMultiplier * 1.2,
    congestionScore: avgCongestionScore,
    currentLoad: route.totalCurrentLoad,
    predictedLoad: route.totalPredictedLoad,
    capacity: route.totalCapacity,
    vehicleEligibility: route.vehicleEligibility,
    travelTimeMultiplier: avgTravelTimeMultiplier,
    projectedLoad: route.totalPredictedLoad,
  };
}

export function diversifyRoutes(
  routes: TrafficRoute[],
  vehicleClass: string,
  projectedRequests: number = 0,
): RouteCandidate[] {
  const eligibleRoutes = routes
    .filter((r) => r.vehicleEligibility.includes(vehicleClass.toUpperCase()))
    .map(toCandidate);

  if (eligibleRoutes.length === 0) {
    return [];
  }

  const routesWithProjectedLoad = eligibleRoutes.map((route) => {
    const loadPerRequest = route.capacity * 0.05;
    const projectedLoad = Math.min(
      route.capacity,
      route.predictedLoad + projectedRequests * loadPerRequest,
    );
    return { ...route, projectedLoad };
  });

  return routesWithProjectedLoad.sort((a, b) => {
    const scoreA =
      a.durationMinutes *
      (1 + a.congestionScore / 100) *
      (1 + a.projectedLoad / a.capacity);
    const scoreB =
      b.durationMinutes *
      (1 + b.congestionScore / 100) *
      (1 + b.projectedLoad / b.capacity);
    return scoreA - scoreB;
  });
}

export function getDiversificationExplanation(
  originalRoutes: RouteCandidate[],
  diversifiedRoutes: RouteCandidate[],
  vehicleClass: string,
): string {
  if (originalRoutes.length === 0) {
    return `No eligible routes for vehicle class ${vehicleClass}`;
  }

  const originalTop = originalRoutes[0];
  const newTop = diversifiedRoutes[0];

  if (!originalTop || !newTop) {
    return `Unable to diversify routes for ${vehicleClass}`;
  }

  if (originalTop.routeId === newTop.routeId) {
    return `Route ${originalTop.name} remains optimal for ${vehicleClass}`;
  }

  return `Diversified: ${vehicleClass} shifted from ${originalTop.name} (predicted load ${originalTop.predictedLoad.toFixed(
    0,
  )}/${originalTop.capacity}) to ${newTop.name} (predicted load ${newTop.predictedLoad.toFixed(0)}/${newTop.capacity})`;
}