import { findChargingStations } from "../charging/charging.service.js";
import { estimateRouteEnergy } from "../routing/energy.service.js";
import { evaluateRoutes } from "../routing/routing.service.js";
import type { RecommendationRequest } from "./recommendation.schemas.js";

export async function buildRecommendation(input: RecommendationRequest, usePredictedTraffic: boolean = true) {
  const energy = estimateRouteEnergy(input);
  const routesResult = evaluateRoutes({
    origin: { latitude: 0, longitude: 0 },
    destination: { latitude: 0, longitude: 0 },
    vehicle: {
      batteryCapacityKwh: input.batteryCapacityKwh,
      efficiencyWhPerKm: input.efficiencyWhPerKm,
      currentSocPercent: input.currentSocPercent,
    },
    reserveSocPercent: input.reserveSocPercent,
    environmentFactor: 1.05,
    auxiliaryLoadKwh: 0.5,
    provider: "DEMO",
  }, usePredictedTraffic);

  const bestRoute = routesResult.routes[0];
  const stations = energy.chargingRequired
    ? await findChargingStations({
        minimumPowerKw: input.minimumPowerKw,
        onlyAvailable: true,
      })
    : [];

  return {
    recommendationId: crypto.randomUUID(),
    energy,
    route: bestRoute
      ? {
          routeId: bestRoute.routeId,
          name: bestRoute.name,
          distanceKm: bestRoute.distanceKm,
          etaMinutes: bestRoute.estimatedEtaMinutes,
          trafficFactor: bestRoute.trafficFactor,
          energyKwh: bestRoute.estimatedEnergyKwh,
          arrivalSocPercent: bestRoute.estimatedArrivalSocPercent,
          chargingRequired: bestRoute.chargingRequired,
        }
      : null,
    recommendedStation: stations[0] ?? null,
    alternatives: stations.slice(1, 3),
    explanation: bestRoute?.chargingRequired
      ? "A charging stop is recommended to preserve the requested reserve."
      : "The journey is within the vehicle's estimated usable range.",
    trafficAware: usePredictedTraffic,
  };
}
