import { describe, expect, it } from "vitest";
import {
  orchestrateRecommendation,
  type RecommendationChargerInput,
  type RecommendationOrchestratorInput,
} from "../src/index.js";

const primary: RecommendationChargerInput = {
  chargerId: "charger-a",
  stationId: "station-a",
  stationName: "Station A",
  connectorType: "CCS2",
  powerKw: 60,
  estimatedWaitMinutes: 8,
  detourKm: 2.5,
  pricePerKwh: 18,
  reliabilityScore: 94,
  reliabilityGrade: "A",
  reliabilityFreshness: "FRESH",
  reliabilitySourceMode: "SIMULATOR",
  reliabilityReasons: ["Fresh heartbeat."],
  reliabilityWarnings: [],
};

const base: RecommendationOrchestratorInput = {
  recommendationId: "rec-1",
  generatedAt: "2026-08-18T12:00:00.000Z",
  sourceMode: "DEMO",
  isSimulated: true,
  selectedRouteId: "route-b",
  routes: [
    {
      routeId: "route-b",
      name: "Route B",
      estimatedEtaMinutes: 80,
      estimatedArrivalSocPercent: 14.2,
      estimatedEnergyKwh: 22,
      chargingRequired: true,
      trafficHorizon: "PREDICTED",
      trafficLevel: "MEDIUM",
      projectedUtilizationPercent: 72,
    },
  ],
  chargingRequired: true,
  primaryCharger: primary,
  backupCharger: { ...primary, chargerId: "charger-c", stationId: "station-c", stationName: "Station C" },
};

describe("Module 08 recommendation orchestrator", () => {
  it("composes the selected route, primary, backup, estimates, and explanations", () => {
    const result = orchestrateRecommendation(base);

    expect(result).toMatchObject({
      status: "READY",
      recommendedRouteId: "route-b",
      recommendedChargerId: "charger-a",
      backupChargerId: "charger-c",
      estimatedArrivalSocPercent: 14.2,
      estimatedWaitMinutes: 8,
      reliabilityScore: 94,
      isSimulated: true,
    });
    expect(result.reasons.length).toBeGreaterThanOrEqual(5);
    expect(result.warnings).toContain(
      "Availability, wait, detour, cost, traffic, and range values are simulated or estimated.",
    );
  });

  it("reports an actionable state when charging is required but no charger is eligible", () => {
    const result = orchestrateRecommendation({
      ...base,
      primaryCharger: null,
      backupCharger: null,
    });

    expect(result.status).toBe("NO_FEASIBLE_CHARGER");
    expect(result.recommendedChargerId).toBeNull();
    expect(result.warnings[0]).toContain("no reachable compatible operational charger");
  });

  it("does not recommend a charger when Module 2 says charging is unnecessary", () => {
    const result = orchestrateRecommendation({
      ...base,
      chargingRequired: false,
      primaryCharger: null,
      backupCharger: null,
    });

    expect(result.status).toBe("NO_CHARGING_REQUIRED");
    expect(result.recommendedChargerId).toBeNull();
  });
});
