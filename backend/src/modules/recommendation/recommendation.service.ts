import { findChargingStations } from "../charging/charging.service.js";
import { estimateRouteEnergy } from "../routing/energy.service.js";
import type { RecommendationRequest } from "./recommendation.schemas.js";

export async function buildRecommendation(input: RecommendationRequest) {
  const energy = estimateRouteEnergy(input);
  const stations = energy.chargingRequired
    ? await findChargingStations({
        minimumPowerKw: input.minimumPowerKw,
        onlyAvailable: true,
      })
    : [];

  return {
    recommendationId: crypto.randomUUID(),
    energy,
    recommendedStation: stations[0] ?? null,
    alternatives: stations.slice(1, 3),
    explanation: energy.chargingRequired
      ? "A charging stop is recommended to preserve the requested reserve."
      : "The journey is within the vehicle's estimated usable range.",
  };
}
