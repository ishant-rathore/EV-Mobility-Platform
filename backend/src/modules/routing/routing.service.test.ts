import { describe, expect, it } from "vitest";
import { estimateRouteEnergy } from "./energy.service.js";
import { evaluateCandidateRoutes } from "./routing.service.js";

describe("estimateRouteEnergy", () => {
  it("applies traffic, environment, and auxiliary-load factors", () => {
    const result = estimateRouteEnergy({
      distanceKm: 100,
      batteryCapacityKwh: 60,
      efficiencyWhPerKm: 180,
      currentSocPercent: 80,
      reserveSocPercent: 15,
      trafficFactor: 1.2,
      environmentFactor: 1.1,
      auxiliaryLoadKwh: 0.5,
    });

    expect(result.baseEnergyKwh).toBe(18);
    expect(result.requiredKwh).toBe(24.26);
    expect(result.projectedArrivalSocPercent).toBe(39.6);
    expect(result.chargingRequired).toBe(false);
  });

  it("requires charging when the trip would use the safety reserve", () => {
    const result = estimateRouteEnergy({
      distanceKm: 200,
      batteryCapacityKwh: 40,
      efficiencyWhPerKm: 180,
      currentSocPercent: 50,
      reserveSocPercent: 15,
    });

    expect(result.chargingRequired).toBe(true);
    expect(result.canReachDestinationWithoutCharging).toBe(false);
    expect(result.requiredKwh).toBe(36);
    expect(result.energyDeficitKwh).toBe(16);
  });

  it("does not require charging when arrival SOC exactly matches the reserve", () => {
    const result = estimateRouteEnergy({
      distanceKm: 100,
      batteryCapacityKwh: 40,
      efficiencyWhPerKm: 140,
      currentSocPercent: 50,
      reserveSocPercent: 15,
    });

    expect(result.projectedArrivalSocPercent).toBe(15);
    expect(result.chargingRequired).toBe(false);
  });

  it("uses Module 01 usable battery capacity when battery health is reduced", () => {
    const result = estimateRouteEnergy({
      distanceKm: 100,
      batteryCapacityKwh: 50,
      usableBatteryCapacityKwh: 40,
      efficiencyWhPerKm: 160,
      currentSocPercent: 50,
      reserveSocPercent: 10,
    });

    expect(result.effectiveBatteryCapacityKwh).toBe(40);
    expect(result.availableEnergyKwh).toBe(20);
    expect(result.projectedArrivalSocPercent).toBe(10);
    expect(result.chargingRequired).toBe(false);
  });
});

describe("evaluateCandidateRoutes", () => {
  it("returns three fully evaluated offline route alternatives", async () => {
    const result = await evaluateCandidateRoutes({
      origin: { label: "Mumbai", latitude: 18.969, longitude: 72.8194 },
      destination: { label: "Pune", latitude: 18.5204, longitude: 73.8567 },
      vehicle: {
        id: "EV_NEXON_DEMO",
        batteryCapacityKwh: 40.5,
        efficiencyWhPerKm: 150,
        currentSocPercent: 55,
      },
      reserveSocPercent: 15,
      environmentFactor: 1,
      auxiliaryLoadKwh: 0.4,
      provider: "DEMO",
    });

    expect(result.sourceMode).toBe("DEMO");
    expect(result.routes).toHaveLength(3);
    expect(result.routes.every((route) => route.estimatedEnergyKwh > 0)).toBe(true);
    expect(result.routes.every((route) => route.estimatedArrivalSocPercent >= 0)).toBe(true);
    expect(result.routes.every((route) => route.chargerCandidates.length > 0)).toBe(true);
    expect(new Set(result.routes.map((route) => route.routeId)).size).toBe(3);
  });
});
