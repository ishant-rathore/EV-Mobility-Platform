import { describe, expect, it } from "vitest";
import { AppError } from "../../shared/errors.js";
import {
  computeBatteryState,
  requiresChargingStop,
  summarizeEvProfile,
  toEnergyContext,
} from "./ev.service.js";
import type { EvProfile, EvProfileSummary } from "./ev.types.js";

const nexonProfile: EvProfile = {
  name: "Tata Nexon EV Max",
  vehicleClass: "CAR",
  connectorTypes: ["CCS2"],
  batteryCapacityKwh: 40.5,
  batteryHealthPercent: 100,
  efficiencyWhPerKm: 150,
  currentSocPercent: 38,
  reserveSocPercent: 10,
};

describe("computeBatteryState", () => {
  it("reproduces the documented worked example", () => {
    expect(computeBatteryState(nexonProfile)).toEqual({
      usableCapacityKwh: 40.5,
      availableEnergyKwh: 15.39,
      reserveEnergyKwh: 4.05,
      usableAboveReserveKwh: 11.34,
      estimatedRangeKm: 102,
      rangeToReserveKm: 75,
    });
  });

  it("accepts the SOC boundaries 0 and 100", () => {
    expect(() => computeBatteryState({ ...nexonProfile, currentSocPercent: 0 })).not.toThrow();
    expect(() => computeBatteryState({ ...nexonProfile, currentSocPercent: 100 })).not.toThrow();
  });

  it.each([-1, 101, Number.NaN])("rejects an out-of-range SOC of %s", (currentSocPercent) => {
    expect(() => computeBatteryState({ ...nexonProfile, currentSocPercent })).toThrow(AppError);
    try {
      computeBatteryState({ ...nexonProfile, currentSocPercent });
    } catch (error) {
      expect((error as AppError).code).toBe("EV_SOC_OUT_OF_RANGE");
    }
  });

  it("never goes negative when the reserve exceeds the current charge", () => {
    const state = computeBatteryState({ ...nexonProfile, currentSocPercent: 5, reserveSocPercent: 10 });
    expect(state.usableAboveReserveKwh).toBe(0);
    expect(state.rangeToReserveKm).toBe(0);
    expect(state.availableEnergyKwh).toBeGreaterThan(0);
  });

  it("shrinks both ranges when battery health degrades", () => {
    const healthy = computeBatteryState(nexonProfile);
    const degraded = computeBatteryState({ ...nexonProfile, batteryHealthPercent: 80 });

    expect(degraded.usableCapacityKwh).toBeCloseTo(32.4);
    expect(degraded.estimatedRangeKm).toBeLessThan(healthy.estimatedRangeKm);
    expect(degraded.rangeToReserveKm).toBeLessThan(healthy.rangeToReserveKm);
  });

  it("rejects non-positive efficiency instead of returning Infinity", () => {
    expect(() => computeBatteryState({ ...nexonProfile, efficiencyWhPerKm: 0 })).toThrow(AppError);
    expect(() => computeBatteryState({ ...nexonProfile, efficiencyWhPerKm: -5 })).toThrow(AppError);
  });

  it("produces a sane range for a low-capacity, low-efficiency bike profile", () => {
    const bike: EvProfile = {
      name: "Demo E-Bike",
      vehicleClass: "BIKE",
      connectorTypes: ["LEV_AC"],
      batteryCapacityKwh: 2.5,
      batteryHealthPercent: 100,
      efficiencyWhPerKm: 25,
      currentSocPercent: 80,
      reserveSocPercent: 10,
    };
    const state = computeBatteryState(bike);
    expect(state.estimatedRangeKm).toBe(80);
    expect(state.rangeToReserveKm).toBe(70);
  });
});

describe("summarizeEvProfile", () => {
  it("spreads the profile and the derived battery state together", () => {
    const summary = summarizeEvProfile(nexonProfile);
    expect(summary.name).toBe("Tata Nexon EV Max");
    expect(summary.rangeToReserveKm).toBe(75);
  });
});

describe("requiresChargingStop", () => {
  it("flags a distance beyond the reserve-adjusted range", () => {
    expect(requiresChargingStop(nexonProfile, 76)).toBe(true);
    expect(requiresChargingStop(nexonProfile, 75)).toBe(false);
  });
});

describe("toEnergyContext", () => {
  it("narrows a full summary to the Module 2 handoff fields only", () => {
    const summary: EvProfileSummary = {
      ...nexonProfile,
      ...computeBatteryState(nexonProfile),
      vehicleId: "EV_NEXON_DEMO",
      isDefault: true,
      sourceMode: "DEMO",
      updatedAt: new Date().toISOString(),
    };

    expect(toEnergyContext(summary)).toEqual({
      vehicleId: "EV_NEXON_DEMO",
      vehicleClass: "CAR",
      connectorTypes: ["CCS2"],
      batteryCapacityKwh: 40.5,
      usableCapacityKwh: 40.5,
      efficiencyWhPerKm: 150,
      currentSocPercent: 38,
      reserveSocPercent: 10,
      availableEnergyKwh: 15.39,
      reserveEnergyKwh: 4.05,
      usableAboveReserveKwh: 11.34,
      rangeToReserveKm: 75,
    });
  });
});
