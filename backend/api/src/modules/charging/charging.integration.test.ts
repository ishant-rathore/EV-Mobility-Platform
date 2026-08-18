import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { app } from "../../app.js";
import { resetReliabilityStore } from "../reliability/reliability.service.js";

describe("Module 05 charging recommendation API", () => {
  beforeEach(() => resetReliabilityStore());

  it("returns visibly simulated, reliability-enriched primary and backup choices", async () => {
    const response = await request(app).post("/api/v1/chargers/recommendations").send({
      connectorTypes: ["CCS2"],
      stationIds: ["station-demo-1", "station-demo-2"],
      minimumPowerKw: 20,
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      sourceMode: "DEMO",
      isSimulated: true,
      primary: {
        connectorCompatible: true,
        reliability: { isUsable: true },
      },
      backup: {
        connectorCompatible: true,
        reliability: { isUsable: true },
      },
    });
  });
});
