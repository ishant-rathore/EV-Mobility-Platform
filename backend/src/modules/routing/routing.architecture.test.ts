import { describe, expect, it } from "vitest";
import type { StationRecord } from "../../integrations/charging-providers/station.provider.js";
import {
  recommendChargingStop,
  selectChargingStopCandidates,
} from "./charging-stops.service.js";
import { calculateEnvironmentAdjustment } from "./environment-factor.service.js";
import { estimateRouteSegments } from "./route-segments.service.js";

describe("Module 02 architecture services", () => {
  it("derives a transparent weather, temperature, and elevation factor", () => {
    const adjustment = calculateEnvironmentAdjustment({
      weatherCondition: "RAIN",
      ambientTemperatureC: 8,
      elevationGainM: 300,
      distanceKm: 100,
    });

    expect(adjustment.weatherFactor).toBe(1.08);
    expect(adjustment.temperatureFactor).toBeGreaterThan(1);
    expect(adjustment.elevationFactor).toBeGreaterThan(1);
    expect(adjustment.combinedFactor).toBeGreaterThan(1.08);
  });

  it("allocates route distance and energy across geometry segments", () => {
    const segments = estimateRouteSegments(
      [
        { latitude: 18.969, longitude: 72.8194 },
        { latitude: 18.8, longitude: 73.2 },
        { latitude: 18.5204, longitude: 73.8567 },
      ],
      150,
      30,
    );

    expect(segments).toHaveLength(2);
    expect(segments.reduce((total, segment) => total + segment.distanceKm, 0)).toBeCloseTo(150, 1);
    expect(segments.reduce((total, segment) => total + segment.estimatedEnergyKwh, 0)).toBeCloseTo(
      30,
      1,
    );
  });

  it("selects only route-linked stations and recommends one when charging is required", () => {
    const stations: StationRecord[] = [
      {
        id: "station-a",
        name: "Station A",
        latitude: 0,
        longitude: 0,
        availableChargers: 2,
        powerKw: 60,
        reliabilityScore: 95,
        pricePerKwh: 18,
      },
      {
        id: "station-b",
        name: "Station B",
        latitude: 0,
        longitude: 0,
        availableChargers: 1,
        powerKw: 30,
        reliabilityScore: 85,
        pricePerKwh: 15,
      },
    ];

    const candidates = selectChargingStopCandidates(["station-b"], stations);
    expect(candidates.map((candidate) => candidate.id)).toEqual(["station-b"]);
    expect(recommendChargingStop(true, candidates)?.id).toBe("station-b");
    expect(recommendChargingStop(false, candidates)).toBeNull();
  });
});
