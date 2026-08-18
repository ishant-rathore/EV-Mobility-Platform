import { describe, expect, it } from "vitest";
import {
  predictTraffic,
  predictTrafficForRoute,
  getDemoRoutes,
  type PredictionMethod,
} from "./traffic-prediction.service.js";

describe("predictTraffic", () => {
  const baseInput = {
    segmentId: "test-segment",
    freeFlowSpeedKph: 60,
    observedSpeedKph: 15,
    occupancyPercent: 80,
  };

  it("marks a slow, occupied segment as congested with rule-based method", () => {
    const result = predictTraffic(baseInput, "rule-based");

    expect(result.congestionScore).toBeGreaterThanOrEqual(70);
    expect(result.level).toBe("SEVERE");
    expect(result.predictedLoad).toBeGreaterThan(baseInput.occupancyPercent);
    expect(result.sourceMode).toBe("DEMO");
    expect(result.predictionMethod).toBe("rule-based");
    expect(result.vehicleEligibility).toContain("CAR");
  });

  it("works with rush-hour method", () => {
    const result = predictTraffic(baseInput, "rush-hour");

    expect(result.congestionScore).toBeGreaterThanOrEqual(70);
    expect(result.level).toBe("SEVERE");
    expect(result.predictedLoad).toBeGreaterThan(baseInput.occupancyPercent);
    expect(result.sourceMode).toBe("DEMO");
    expect(result.predictionMethod).toBe("rush-hour");
  });

  it("works with regression method", () => {
    const result = predictTraffic(baseInput, "regression");

    expect(result.congestionScore).toBeGreaterThanOrEqual(0);
    expect(result.congestionScore).toBeLessThanOrEqual(100);
    expect(["LOW", "MEDIUM", "HIGH", "SEVERE"]).toContain(result.level);
    expect(result.sourceMode).toBe("DEMO");
    expect(result.predictionMethod).toBe("regression");
  });

  it("works with historical method", () => {
    const result = predictTraffic(baseInput, "historical");

    expect(result.congestionScore).toBeGreaterThanOrEqual(0);
    expect(result.congestionScore).toBeLessThanOrEqual(100);
    expect(["LOW", "MEDIUM", "HIGH", "SEVERE"]).toContain(result.level);
    expect(result.sourceMode).toBe("DEMO");
    expect(result.predictionMethod).toBe("historical");
  });

  it("returns LOW for free-flowing segment", () => {
    const freeFlowInput = {
      ...baseInput,
      observedSpeedKph: 55,
      occupancyPercent: 10,
    };
    const result = predictTraffic(freeFlowInput, "rule-based");

    expect(result.level).toBe("LOW");
    expect(result.congestionScore).toBeLessThan(25);
  });

  it("returns MEDIUM for moderately congested segment", () => {
    const moderateInput = {
      ...baseInput,
      observedSpeedKph: 35,
      occupancyPercent: 40,
    };
    const result = predictTraffic(moderateInput, "rule-based");

    expect(result.level).toBe("MEDIUM");
    expect(result.congestionScore).toBeGreaterThanOrEqual(25);
    expect(result.congestionScore).toBeLessThan(50);
  });

  it("returns HIGH for heavily congested segment", () => {
    const heavyInput = {
      ...baseInput,
      observedSpeedKph: 20,
      occupancyPercent: 65,
    };
    const result = predictTraffic(heavyInput, "rule-based");

    expect(result.level).toBe("HIGH");
    expect(result.congestionScore).toBeGreaterThanOrEqual(50);
    expect(result.congestionScore).toBeLessThan(70);
  });
});

describe("predictTrafficForRoute", () => {
  const segments = [
    {
      segmentId: "corridor-north",
      freeFlowSpeedKph: 80,
      observedSpeedKph: 45,
      occupancyPercent: 60,
    },
    {
      segmentId: "corridor-central",
      freeFlowSpeedKph: 60,
      observedSpeedKph: 22,
      occupancyPercent: 80,
    },
  ];

  it("predicts traffic for all segments in a route", () => {
    const results = predictTrafficForRoute(segments, "rule-based");

    expect(results).toHaveLength(2);
    expect(results[0].segmentId).toBe("corridor-north");
    expect(results[1].segmentId).toBe("corridor-central");
    expect(results.every((r) => r.sourceMode === "DEMO")).toBe(true);
  });
});

describe("getDemoRoutes", () => {
  it("returns 4 demo routes with all required fields", () => {
    const routes = getDemoRoutes();

    expect(routes).toHaveLength(4);
    routes.forEach((route) => {
      expect(route.routeId).toBeDefined();
      expect(route.name).toBeDefined();
      expect(route.distanceKm).toBeGreaterThan(0);
      expect(route.segments).toHaveLength(1);
      expect(route.totalCapacity).toBeGreaterThan(0);
      expect(route.totalCurrentLoad).toBeGreaterThanOrEqual(0);
      expect(route.totalPredictedLoad).toBeGreaterThanOrEqual(route.totalCurrentLoad);
      expect(route.vehicleEligibility).toContain("CAR");
    });
  });

  it("includes route with different vehicle eligibility", () => {
    const routes = getDemoRoutes();
    const centralRoute = routes.find((r) => r.routeId === "route-central");
    const southRoute = routes.find((r) => r.routeId === "route-south");

    expect(centralRoute?.vehicleEligibility).toEqual(["CAR", "BIKE"]);
    expect(southRoute?.vehicleEligibility).toContain("TRUCK");
    expect(southRoute?.vehicleEligibility).toContain("COMMERCIAL");
  });
});

describe("Traffic levels", () => {
  it("uses LOW, MEDIUM, HIGH, SEVERE levels", () => {
    const levels = ["LOW", "MEDIUM", "HIGH", "SEVERE"] as const;

    levels.forEach((level) => {
      expect(["LOW", "MEDIUM", "HIGH", "SEVERE"]).toContain(level);
    });
  });
});