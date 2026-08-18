import { describe, expect, it } from "vitest";
import { estimateRouteEnergy } from "./energy.service.js";

describe("estimateRouteEnergy", () => {
  it("flags a route that would fall below the reserve SOC", () => {
    const result = estimateRouteEnergy({
      distanceKm: 200,
      batteryCapacityKwh: 40,
      efficiencyWhPerKm: 180,
      currentSocPercent: 50,
      reserveSocPercent: 15,
    });

    expect(result.chargingRequired).toBe(true);
    expect(result.requiredKwh).toBe(36);
  });
});
