import { describe, expect, it } from "vitest";
import type { RecommendationDecision } from "@ev-mobility/shared-types";
import {
  estimateChargingCost,
  isReservableRecommendation,
  toLocalDateTimeInput,
} from "./booking";

function recommendation(status: RecommendationDecision["status"]): RecommendationDecision {
  return {
    recommendationId: "c5e164af-7db8-4696-aaf8-57958d48dc9d",
    generatedAt: "2026-08-18T12:00:00.000Z",
    status,
    sourceMode: "DEMO",
    isSimulated: true,
    recommendedRouteId: status === "READY" ? "route-a" : null,
    recommendedRouteName: status === "READY" ? "Route A" : null,
    recommendedChargerId: status === "READY" ? "charger-a" : null,
    recommendedStationId: status === "READY" ? "station-a" : null,
    backupChargerId: "charger-b",
    backupStationId: "station-b",
    estimatedArrivalSocPercent: 18,
    estimatedEtaMinutes: 90,
    estimatedWaitMinutes: 8,
    estimatedDetourKm: 2,
    estimatedPricePerKwh: 18,
    reliabilityScore: 92,
    reasons: [],
    warnings: [],
  };
}

describe("Module 10 booking presentation helpers", () => {
  it("calculates and rounds an explicitly estimated charging cost", () => {
    expect(estimateChargingCost(12.345, 18)).toBe(222.21);
    expect(estimateChargingCost(-5, 18)).toBe(0);
    expect(estimateChargingCost(10, null)).toBeNull();
  });

  it("only allows a complete READY recommendation to be reserved", () => {
    expect(isReservableRecommendation(recommendation("READY"))).toBe(true);
    expect(isReservableRecommendation(recommendation("NO_FEASIBLE_CHARGER"))).toBe(false);
    expect(isReservableRecommendation(undefined)).toBe(false);
  });

  it("formats a date for a datetime-local field", () => {
    expect(toLocalDateTimeInput(new Date(2026, 7, 18, 12, 30))).toMatch(/^2026-08-18T12:30$/);
  });
});
