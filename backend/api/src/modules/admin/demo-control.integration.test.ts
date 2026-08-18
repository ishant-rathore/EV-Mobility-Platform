import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { app } from "../../app.js";
import { resetAllDemoState } from "./demo-control.service.js";

describe("Module 12 demo controls", () => {
  beforeEach(() => {
    resetAllDemoState();
  });

  it("switches requested source mode without falsely claiming live data", async () => {
    const response = await request(app)
      .post("/api/v1/admin/demo/mode")
      .send({ mode: "REAL" })
      .expect(200);

    expect(response.body.runtime.requestedMode).toBe("REAL");
    expect(response.body.runtime.effectiveMode).toBe("DEMO");
    expect(response.body.runtime.warnings[0]).toContain("no verified live provider");
  });

  it("applies Route A and Route B traffic scenarios to the shared traffic API", async () => {
    await request(app)
      .post("/api/v1/admin/demo/traffic")
      .send({ routeId: "route-north", level: "HIGH" })
      .expect(200);
    await request(app)
      .post("/api/v1/admin/demo/traffic")
      .send({ routeId: "route-central", level: "MEDIUM" })
      .expect(200);

    const routes = await request(app).get("/api/v1/traffic/routes").expect(200);
    const routeA = routes.body.find((route: { routeId: string }) => route.routeId === "route-north");
    const routeB = routes.body.find((route: { routeId: string }) => route.routeId === "route-central");
    expect(routeA.totalPredictedLoad / routeA.totalCapacity).toBe(0.85);
    expect(routeB.totalPredictedLoad / routeB.totalCapacity).toBe(0.6);
  });

  it("injects explicitly simulated charging, fault, and restore telemetry", async () => {
    for (const [action, status] of [
      ["CHARGING", "CHARGING"],
      ["FAULT", "FAULT"],
      ["RESTORE", "AVAILABLE"],
    ] as const) {
      const response = await request(app)
        .post("/api/v1/admin/demo/charger")
        .send({ action })
        .expect(200);
      expect(response.body.telemetry[0].telemetry.status).toBe(status);
      expect(response.body.telemetry[0].telemetry.sourceMode).toBe("SIMULATOR");
      expect(response.body.telemetry[0].telemetry.isSimulated).toBe(true);
    }
  });

  it("freezes scenario changes and resumes safely", async () => {
    await request(app)
      .post("/api/v1/admin/demo/freeze")
      .send({ frozen: true })
      .expect(200);

    const blocked = await request(app)
      .post("/api/v1/admin/demo/charger")
      .send({ action: "FAULT" })
      .expect(409);
    expect(blocked.body.error.code).toBe("DEMO_DATA_FROZEN");

    await request(app)
      .post("/api/v1/admin/demo/freeze")
      .send({ frozen: false })
      .expect(200);
    await request(app)
      .post("/api/v1/admin/demo/charger")
      .send({ action: "FAULT" })
      .expect(200);
  });

  it("runs a vehicle batch and requires explicit reset confirmation", async () => {
    const batch = await request(app)
      .post("/api/v1/admin/demo/vehicle-batch")
      .send({ requestCount: 20, demandUnitsPerRequest: 20 })
      .expect(200);
    expect(batch.body.lastBatch.requestCount).toBe(20);
    expect(batch.body.lastBatch.advisory).toBe(true);

    await request(app).post("/api/v1/admin/demo/reset").send({}).expect(400);
    const reset = await request(app)
      .post("/api/v1/admin/demo/reset")
      .send({ confirm: "RESET_DEMO" })
      .expect(200);
    expect(reset.body.lastBatch).toBeNull();
    expect(reset.body.runtime.trafficOverrides).toEqual({});
    expect(reset.body.resetScopes).toContain("payments");
  });
});
