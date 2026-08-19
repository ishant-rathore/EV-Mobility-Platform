import type { RecommendationDecision } from "@ev-mobility/shared-types";

export function estimateChargingCost(
  energyDeficitKwh: number,
  estimatedPricePerKwh: number | null,
): number | null {
  if (estimatedPricePerKwh === null) return null;
  return Number((Math.max(0, energyDeficitKwh) * estimatedPricePerKwh).toFixed(2));
}

export function isReservableRecommendation(
  recommendation: RecommendationDecision | undefined,
): boolean {
  return Boolean(
    recommendation?.status === "READY"
    && recommendation.recommendedRouteId
    && recommendation.recommendedStationId
    && recommendation.recommendedChargerId,
  );
}

export function toLocalDateTimeInput(date: Date): string {
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}
