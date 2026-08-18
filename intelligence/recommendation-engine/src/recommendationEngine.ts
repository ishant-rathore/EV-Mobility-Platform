import { explainPrimaryCharger, explainRoute } from "./explainability.js";
import type {
  RecommendationDecision,
  RecommendationOrchestratorInput,
} from "./types.js";

export function orchestrateRecommendation(
  input: RecommendationOrchestratorInput,
): RecommendationDecision {
  const selectedRoute =
    input.routes.find((route) => route.routeId === input.selectedRouteId) ?? null;
  const base = {
    recommendationId: input.recommendationId,
    generatedAt: input.generatedAt,
    sourceMode: input.sourceMode,
    isSimulated: input.isSimulated,
    recommendedRouteId: selectedRoute?.routeId ?? null,
    recommendedRouteName: selectedRoute?.name ?? null,
    recommendedChargerId: input.primaryCharger?.chargerId ?? null,
    recommendedStationId: input.primaryCharger?.stationId ?? null,
    backupChargerId: input.backupCharger?.chargerId ?? null,
    backupStationId: input.backupCharger?.stationId ?? null,
    estimatedArrivalSocPercent: selectedRoute?.estimatedArrivalSocPercent ?? null,
    estimatedEtaMinutes: selectedRoute?.estimatedEtaMinutes ?? null,
    estimatedWaitMinutes: input.primaryCharger?.estimatedWaitMinutes ?? null,
    estimatedDetourKm: input.primaryCharger?.detourKm ?? null,
    estimatedPricePerKwh: input.primaryCharger?.pricePerKwh ?? null,
    reliabilityScore: input.primaryCharger?.reliabilityScore ?? null,
  };

  if (!selectedRoute) {
    return {
      ...base,
      status: "NO_ELIGIBLE_ROUTE",
      reasons: [],
      warnings: ["No eligible route was available for recommendation composition."],
    };
  }

  const routeReasons = explainRoute(selectedRoute);
  if (!input.chargingRequired) {
    return {
      ...base,
      status: "NO_CHARGING_REQUIRED",
      reasons: [
        ...routeReasons,
        `Module 2 estimates no charging stop is required; estimated arrival SOC is ${selectedRoute.estimatedArrivalSocPercent}%.`,
      ],
      warnings: input.isSimulated
        ? ["Route, traffic, and arrival SOC values include simulated or estimated inputs."]
        : [],
    };
  }

  if (!input.primaryCharger) {
    return {
      ...base,
      status: "NO_FEASIBLE_CHARGER",
      reasons: routeReasons,
      warnings: [
        "Charging is estimated to be required, but no reachable compatible operational charger is eligible.",
        ...(input.isSimulated ? ["The current result includes simulated or estimated inputs."] : []),
      ],
    };
  }

  return {
    ...base,
    status: "READY",
    reasons: [
      ...routeReasons,
      ...explainPrimaryCharger(input.primaryCharger),
      ...(input.backupCharger
        ? [
            `${input.backupCharger.stationName} (${input.backupCharger.chargerId}) remains the eligible backup.`,
          ]
        : []),
    ],
    warnings: [
      ...input.primaryCharger.reliabilityWarnings,
      ...(input.backupCharger ? [] : ["No eligible backup charger is currently available."]),
      ...(input.isSimulated
        ? ["Availability, wait, detour, cost, traffic, and range values are simulated or estimated."]
        : []),
    ],
  };
}
