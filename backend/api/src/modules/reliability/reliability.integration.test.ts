import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { app } from "../../app.js";
import { resetReliabilityStore } from "./reliability.service.js";

const healthyAssessment = {
  chargerId: "charger-module-6",
  status: "AVAILABLE",
  uptimePercent: 98,
  successfulSessionsPercent: 96,
  heartbeatAgeSeconds: 15,
  faultRatePercent: 2,
  recentFaultCount: 0,
  temperatureCelsius: 34,
  telemetryCompletenessPercent: 100,
  sourceMode: "HARDWARE_DEMO",
};

describe("Module 6 reliability API", () => {
  beforeEach(() => resetReliabilityStore());

  it("creates and retrieves an explainable assessment", async () => {
    const created = await request(app).post("/api/v1/reliability/assess").send(healthyAssessment);

    expect(created.status).toBe(200);
    expect(created.body.chargerId).toBe("charger-module-6");
    expect(created.body.score).toBeGreaterThanOrEqual(85);
    expect(created.body.factors.currentState.weight).toBe(20);
    expect(created.body.availability.basis).toBe("PROTOTYPE_HEURISTIC");
    expect(created.body.warnings).toContain("HARDWARE_DEMO data must be presented as simulated/demo data.");

    const fetched = await request(app).get("/api/v1/reliability/charger-module-6");
    expect(fetched.status).toBe(200);
    expect(fetched.body.recommendation).toBe("PREFERRED");
  });

  it("updates reliability automatically when REST telemetry reports a fault", async () => {
    await request(app).post("/api/v1/reliability/assess").send(healthyAssessment).expect(200);
    const beforeFault = await request(app).get("/api/v1/reliability/charger-module-6");

    const telemetry = await request(app).post("/api/v1/telemetry").send({
      chargerId: "charger-module-6",
      status: "FAULT",
      powerKw: 0,
      temperatureCelsius: 68,
      recordedAt: new Date().toISOString(),
      sourceMode: "SIMULATOR",
      isSimulated: true,
    });
    expect(telemetry.status).toBe(202);

    const afterFault = await request(app).get("/api/v1/reliability/charger-module-6");
    expect(afterFault.status).toBe(200);
    expect(afterFault.body.score).toBeLessThan(beforeFault.body.score);
    expect(afterFault.body.score).toBe(15);
    expect(afterFault.body.isUsable).toBe(false);
    expect(afterFault.body.invalidatedBy).toContain("ACTIVE_FAULT");
    expect(afterFault.body.sourceMode).toBe("SIMULATOR");
  });

  it("rejects assessment requests without heartbeat evidence", async () => {
    const { heartbeatAgeSeconds: _omitted, ...withoutHeartbeat } = healthyAssessment;
    const response = await request(app).post("/api/v1/reliability/assess").send(withoutHeartbeat);

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns a clear 404 when no charger assessment exists", async () => {
    const response = await request(app).get("/api/v1/reliability/unknown-charger");

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("RELIABILITY_NOT_FOUND");
  });
});
