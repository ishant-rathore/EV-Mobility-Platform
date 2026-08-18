import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../app.js";

const validRequest = {
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
};

describe("routing API", () => {
  it("evaluates three route alternatives", async () => {
    const response = await request(app).post("/api/v1/routes/evaluate").send(validRequest);

    expect(response.status).toBe(200);
    expect(response.body.routes).toHaveLength(3);
    expect(response.body.routes[0]).toMatchObject({
      sourceMode: "DEMO",
      chargingRequired: expect.any(Boolean),
      estimatedEnergyKwh: expect.any(Number),
      estimatedArrivalSocPercent: expect.any(Number),
      chargerCandidates: expect.any(Array),
      segments: expect.any(Array),
      environmentAdjustment: expect.objectContaining({
        combinedFactor: expect.any(Number),
      }),
    });
    expect(response.body.routes[0].segments.length).toBeGreaterThan(0);
  });

  it("rejects an SOC above 100 percent", async () => {
    const response = await request(app)
      .post("/api/v1/routes/evaluate")
      .send({
        ...validRequest,
        vehicle: { ...validRequest.vehicle, currentSocPercent: 101 },
      });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("rejects identical origin and destination coordinates", async () => {
    const response = await request(app)
      .post("/api/v1/routes/evaluate")
      .send({ ...validRequest, destination: validRequest.origin });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("keeps the single-route energy endpoint backward compatible", async () => {
    const response = await request(app).post("/api/v1/routes/energy-estimate").send({
      distanceKm: 100,
      batteryCapacityKwh: 50,
      efficiencyWhPerKm: 160,
      currentSocPercent: 70,
      reserveSocPercent: 15,
      trafficFactor: 1.25,
    });

    expect(response.status).toBe(200);
    expect(response.body.energy).toMatchObject({
      baseEnergyKwh: 16,
      requiredKwh: 20,
      trafficFactor: 1.25,
    });
  });
});
