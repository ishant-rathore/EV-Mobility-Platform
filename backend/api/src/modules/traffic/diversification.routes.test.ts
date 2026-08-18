import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../app.js";
import { getDemoRoutes } from "./traffic-prediction.service.js";

describe("traffic diversification API", () => {
  it("runs the required twenty-request before/after simulation", async () => {
    const response = await request(app).post("/api/v1/traffic/diversify/simulate").send({});

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      advisory: true,
      sourceMode: "DEMO",
      requestCount: 20,
      capacityThresholdPercent: 85,
    });
    expect(response.body.assignments).toHaveLength(20);
    expect(response.body.baseline.routes).toHaveLength(4);
    expect(response.body.diversified.routes).toHaveLength(4);
  });

  it("returns an explainable ranked decision", async () => {
    const response = await request(app).post("/api/v1/traffic/diversify").send({
      routes: getDemoRoutes(),
      vehicleClass: "TRUCK",
      projectedRequests: 10,
    });

    expect(response.status).toBe(200);
    expect(response.body.decision.recommendedRouteId).toBeTruthy();
    expect(response.body.decision.advisory).toBe(true);
    expect(response.body.routes.some((route: { eligible: boolean }) => !route.eligible)).toBe(true);
    expect(response.body.routes[0].scoreBreakdown).toMatchObject({
      time: expect.any(Number),
      congestion: expect.any(Number),
      energy: expect.any(Number),
      capacityRisk: expect.any(Number),
    });
  });

  it("rejects unknown vehicle classes", async () => {
    const response = await request(app).post("/api/v1/traffic/diversify").send({
      routes: getDemoRoutes(),
      vehicleClass: "HELICOPTER",
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });
});
