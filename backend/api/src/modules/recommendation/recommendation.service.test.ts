import { describe, expect, it } from "vitest";
import { buildRecommendation } from "./recommendation.service.js";

describe("buildRecommendation", () => {
  it("selects a station when charging is required", async () => {
    const result = await buildRecommendation({
      distanceKm: 250,
      batteryCapacityKwh: 45,
      efficiencyWhPerKm: 180,
      currentSocPercent: 50,
      reserveSocPercent: 15,
    });

    expect(result.energy.chargingRequired).toBe(true);
    expect(result.recommendedStation).not.toBeNull();
  });
});
