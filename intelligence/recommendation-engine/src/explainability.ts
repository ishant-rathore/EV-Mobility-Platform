import type {
  RecommendationChargerInput,
  RecommendationRouteInput,
} from "./types.js";

export function explainRoute(route: RecommendationRouteInput): string[] {
  const reasons = [
    `${route.name} was selected by the traffic-aware route diversification decision.`,
  ];
  if (route.trafficHorizon && route.trafficLevel) {
    reasons.push(
      `${route.trafficHorizon.toLowerCase()} traffic is ${route.trafficLevel.toLowerCase()}; the ETA and energy estimate include that traffic factor.`,
    );
  }
  if (route.projectedUtilizationPercent !== undefined) {
    reasons.push(
      `Projected corridor utilization after assignment is ${route.projectedUtilizationPercent}%.`,
    );
  }
  return reasons;
}

export function explainPrimaryCharger(charger: RecommendationChargerInput): string[] {
  return [
    `${charger.stationName} has an eligible ${charger.connectorType} charger rated at ${charger.powerKw} kW.`,
    `Reliability is ${charger.reliabilityScore}/100 (grade ${charger.reliabilityGrade}, ${charger.reliabilityFreshness.toLowerCase()} data, source ${charger.reliabilitySourceMode}).`,
    `Estimated wait ${charger.estimatedWaitMinutes} min and detour ${charger.detourKm} km were included in ranking.`,
    ...charger.reliabilityReasons.slice(0, 2),
  ];
}
