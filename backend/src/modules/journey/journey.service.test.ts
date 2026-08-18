import { describe, expect, it } from "vitest";
import { planJourney } from "./journey.service.js";

describe("planJourney", () => {
  it("returns a recommendation identifier", async () => {
    const result = await planJourney({
      distanceKm: 20,
      batteryCapacityKwh: 50,
      efficiencyWhPerKm: 160,
      currentSocPercent: 80,
      reserveSocPercent: 15,
    });
    expect(result.recommendationId).toBeTruthy();
  });
});
