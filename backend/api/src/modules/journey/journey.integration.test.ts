import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../app.js";

const journeyRequest = {
  vehicleId: "vehicle-nexon-demo",
  origin: { label: "Mumbai Central", latitude: 18.969, longitude: 72.8194 },
  destination: { label: "Pune", latitude: 18.5204, longitude: 73.8567 },
  environment: { weatherCondition: "CLEAR", elevationGainM: 0 },
  auxiliaryLoadKwh: 0.4,
  provider: "DEMO",
  trafficHorizon: "PREDICTED",
  diversificationSimulationId: "journey-integration-main",
};

describe("Module 1 → Module 2 → Module 3 → Module 4 → Module 5 → Module 6 journey integration", () => {
  it("uses the stored EV energy budget and predicted traffic for every candidate route", async () => {
    const vehicleResponse = await request(app).get("/api/v1/ev/vehicles/vehicle-nexon-demo");
    const journeyResponse = await request(app)
      .post("/api/v1/journey-eval/evaluate")
      .send(journeyRequest);

    expect(vehicleResponse.status).toBe(200);
    expect(journeyResponse.status).toBe(200);
    expect(journeyResponse.body.integration).toEqual({
      modules: [
        "EV_PROFILE",
        "ROUTING_ENERGY",
        "TRAFFIC_TWIN",
        "TRAFFIC_DIVERSIFICATION",
        "CHARGING_STATION_INTELLIGENCE",
        "CHARGER_RELIABILITY",
        "RECOMMENDATION_ORCHESTRATOR",
      ],
      trafficHorizon: "PREDICTED",
    });
    expect(journeyResponse.body.vehicleSnapshot).toMatchObject({
      vehicleId: vehicleResponse.body.vehicleId,
      vehicleClass: vehicleResponse.body.vehicleClass,
      connectorTypes: vehicleResponse.body.connectorTypes,
      usableCapacityKwh: vehicleResponse.body.usableCapacityKwh,
    });
    expect(journeyResponse.body.routes).toHaveLength(3);
    expect(journeyResponse.body.diversification).toMatchObject({
      advisory: true,
      sourceMode: "DEMO",
      recommendedRouteId: expect.any(String),
      capacityThresholdPercent: 85,
    });
    expect(journeyResponse.body.recommendation).toMatchObject({
      status: "READY",
      recommendedRouteId: journeyResponse.body.diversification.recommendedRouteId,
      recommendedChargerId: expect.any(String),
      backupChargerId: expect.any(String),
      reasons: expect.any(Array),
      sourceMode: "DEMO",
      isSimulated: true,
    });
    expect(journeyResponse.body.diversification.candidates[0].scoreBreakdown).toMatchObject({
      time: expect.any(Number),
      congestion: expect.any(Number),
      energy: expect.any(Number),
      capacityRisk: expect.any(Number),
    });

    for (const route of journeyResponse.body.routes) {
      expect(route.energy.effectiveBatteryCapacityKwh).toBe(
        vehicleResponse.body.usableCapacityKwh,
      );
      expect(route.energy.availableEnergyKwh).toBe(vehicleResponse.body.availableEnergyKwh);
      expect(route.traffic).toMatchObject({
        horizon: "PREDICTED",
        sourceMode: "DEMO",
        vehicleEligible: expect.any(Boolean),
      });
      expect(route.traffic.predictedLoad).not.toBe(route.traffic.currentLoad);
      expect(route.trafficFactor).toBe(route.traffic.travelTimeMultiplier);
    }
  });

  it("changes ETA and energy factors when the traffic horizon changes", async () => {
    const [currentResponse, predictedResponse] = await Promise.all([
      request(app)
        .post("/api/v1/journey-eval/evaluate")
        .send({
          ...journeyRequest,
          trafficHorizon: "CURRENT",
          diversificationSimulationId: "journey-current",
        }),
      request(app)
        .post("/api/v1/journey-eval/evaluate")
        .send({ ...journeyRequest, diversificationSimulationId: "journey-predicted" }),
    ]);

    expect(currentResponse.status).toBe(200);
    expect(predictedResponse.status).toBe(200);
    expect(predictedResponse.body.routes[0].trafficFactor).toBeGreaterThan(
      currentResponse.body.routes[0].trafficFactor,
    );
    expect(predictedResponse.body.routes[0].estimatedEnergyKwh).toBeGreaterThan(
      currentResponse.body.routes[0].estimatedEnergyKwh,
    );
  });

  it("uses the Module 1 vehicle class to exclude illegal Module 3 corridors", async () => {
    const response = await request(app)
      .post("/api/v1/journey-eval/evaluate")
      .send({
        ...journeyRequest,
        vehicleId: "vehicle-etruck-demo",
        diversificationSimulationId: "journey-truck",
      });

    expect(response.status).toBe(200);
    expect(response.body.diversification.vehicleClass).toBe("TRUCK");
    expect(
      response.body.diversification.candidates.some(
        (candidate: { eligible: boolean }) => !candidate.eligible,
      ),
    ).toBe(true);
    const selected = response.body.diversification.candidates.find(
      (candidate: { routeId: string }) =>
        candidate.routeId === response.body.diversification.recommendedRouteId,
    );
    expect(selected.eligible).toBe(true);
  });

  it("rejects a missing Module 1 vehicle instead of trusting client vehicle data", async () => {
    const response = await request(app)
      .post("/api/v1/journey-eval/evaluate")
      .send({ ...journeyRequest, vehicleId: "missing-vehicle" });

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("EV_VEHICLE_NOT_FOUND");
  });
});
