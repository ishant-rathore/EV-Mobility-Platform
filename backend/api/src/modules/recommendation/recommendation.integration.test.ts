import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { app } from "../../app.js";
import { resetReliabilityStore } from "../reliability/reliability.service.js";

const requestBody = {
  vehicleId: "vehicle-nexon-demo",
  currentSocPercent: 20,
  origin: { label: "Mumbai Central", latitude: 18.969, longitude: 72.8194 },
  destination: { label: "Pune", latitude: 18.5204, longitude: 73.8567 },
  auxiliaryLoadKwh: 0.4,
  provider: "DEMO",
  trafficHorizon: "PREDICTED",
  diversificationSimulationId: "module-eight-api",
};

describe("Module 08 recommendation API", () => {
  beforeEach(() => resetReliabilityStore());

  it("returns one explainable route, primary charger, and backup result", async () => {
    const response = await request(app).post("/api/v1/recommendations/evaluate").send(requestBody);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      recommendationId: expect.any(String),
      status: "READY",
      sourceMode: "DEMO",
      isSimulated: true,
      recommendedRouteId: expect.any(String),
      recommendedChargerId: expect.any(String),
      backupChargerId: expect.any(String),
      estimatedArrivalSocPercent: expect.any(Number),
      estimatedWaitMinutes: expect.any(Number),
      reliabilityScore: expect.any(Number),
      reasons: expect.any(Array),
      warnings: expect.any(Array),
    });
  });

  it("rejects client-only energy data on the authoritative endpoint", async () => {
    const response = await request(app).post("/api/v1/recommendations/evaluate").send({
      distanceKm: 200,
      batteryCapacityKwh: 80,
      currentSocPercent: 90,
    });

    expect(response.status).toBe(400);
  });
});
