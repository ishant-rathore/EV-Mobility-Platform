import { describe, expect, it } from "vitest";
import {
  TrafficDiversificationEngine,
  rankDiversificationRoutes,
  simulateDiversification,
  toDiversificationRouteInputs,
  type DiversificationRouteInput,
} from "../src/routeDiversifier.js";
import { getDemoRoutes } from "../src/trafficPredictor.js";

const candidates: DiversificationRouteInput[] = [
  {
    routeId: "fast-overloaded",
    trafficRouteId: "corridor-fast",
    name: "Fast but overloaded",
    durationMinutes: 20,
    energyKwh: 5,
    currentLoad: 80,
    predictedLoad: 88,
    capacity: 100,
    vehicleEligibility: ["CAR"],
    sourceMode: "DEMO",
  },
  {
    routeId: "balanced",
    trafficRouteId: "corridor-balanced",
    name: "Balanced route",
    durationMinutes: 25,
    energyKwh: 6,
    currentLoad: 45,
    predictedLoad: 50,
    capacity: 100,
    vehicleEligibility: ["CAR", "TRUCK"],
    sourceMode: "DEMO",
  },
  {
    routeId: "slow-empty",
    trafficRouteId: "corridor-slow",
    name: "Slow empty route",
    durationMinutes: 80,
    energyKwh: 20,
    currentLoad: 5,
    predictedLoad: 10,
    capacity: 100,
    vehicleEligibility: ["CAR"],
    sourceMode: "DEMO",
  },
];

describe("rankDiversificationRoutes", () => {
  it("penalizes a route over the capacity threshold without choosing only by load", () => {
    const decision = rankDiversificationRoutes({
      routes: candidates,
      vehicleClass: "CAR",
      demandUnits: 1,
    });

    expect(decision.recommendedRouteId).toBe("balanced");
    expect(decision.candidates.find((route) => route.routeId === "fast-overloaded")).toMatchObject({
      capacityThresholdExceeded: true,
      scoreBreakdown: expect.objectContaining({ overloadPenalty: expect.any(Number) }),
    });
    expect(decision.recommendedRouteId).not.toBe("slow-empty");
    expect(decision.advisory).toBe(true);
  });

  it("filters roads that are not legal for the selected vehicle class", () => {
    const decision = rankDiversificationRoutes({ routes: candidates, vehicleClass: "TRUCK" });

    expect(decision.recommendedRouteId).toBe("balanced");
    expect(decision.candidates.filter((route) => route.eligible)).toHaveLength(1);
    expect(decision.candidates.find((route) => route.routeId === "fast-overloaded")).toMatchObject({
      eligible: false,
      rank: null,
      score: null,
    });
  });
});

describe("TrafficDiversificationEngine", () => {
  it("updates projected demand before scoring the next simulated request", () => {
    const engine = new TrafficDiversificationEngine();
    const balancedRoutes: DiversificationRouteInput[] = [
      { ...candidates[1]!, routeId: "route-a", trafficRouteId: "route-a", durationMinutes: 20 },
      { ...candidates[1]!, routeId: "route-b", trafficRouteId: "route-b", durationMinutes: 21 },
    ];

    const first = engine.assign({
      routes: balancedRoutes,
      vehicleClass: "CAR",
      simulationId: "state-test",
      demandUnits: 30,
    });
    const second = engine.assign({
      routes: balancedRoutes,
      vehicleClass: "CAR",
      simulationId: "state-test",
      demandUnits: 30,
    });

    expect(first.recommendedRouteId).toBe("route-a");
    expect(second.recommendedRouteId).toBe("route-b");
    expect(Object.fromEntries(engine.getProjectedDemand("state-test"))).toEqual({
      "route-a": 30,
      "route-b": 30,
    });
  });
});

describe("simulateDiversification", () => {
  it("shows baseline versus diversified loads across twenty requests", () => {
    const result = simulateDiversification({
      routes: toDiversificationRouteInputs(getDemoRoutes()),
      vehicleClasses: ["CAR", "BIKE", "TRUCK", "COMMERCIAL"],
      requestCount: 20,
      demandUnitsPerRequest: 20,
    });

    expect(result.assignments).toHaveLength(20);
    expect(result.baseline.routes.reduce((sum, route) => sum + route.assignments, 0)).toBe(20);
    expect(result.diversified.routes.reduce((sum, route) => sum + route.assignments, 0)).toBe(20);
    expect(result.diversified.routes.filter((route) => route.assignments > 0).length).toBeGreaterThan(1);
    expect(result.diversified.overloadedRoutes).toBeLessThan(result.baseline.overloadedRoutes);
    expect(result.explanation).toContain("advisory assignment");
  });
});
