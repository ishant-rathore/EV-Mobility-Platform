import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { app } from "../../app.js";
import { resetReliabilityStore } from "../reliability/reliability.service.js";

const journeyRequest = {
  vehicleId: "vehicle-nexon-demo",
  currentSocPercent: 20,
  origin: { label: "Mumbai Central", latitude: 18.969, longitude: 72.8194 },
  destination: { label: "Pune", latitude: 18.5204, longitude: 73.8567 },
  auxiliaryLoadKwh: 0.4,
  provider: "DEMO",
  trafficHorizon: "PREDICTED",
  diversificationSimulationId: "six-module-test",
};

describe("authoritative six-module journey path", () => {
  beforeEach(() => resetReliabilityStore());

  it("uses the stored EV connector and selected route to choose primary and backup chargers", async () => {
    const response = await request(app).post("/api/v1/journey-eval/evaluate").send(journeyRequest);

    expect(response.status).toBe(200);
    expect(response.body.integration.modules).toEqual([
      "EV_PROFILE",
      "ROUTING_ENERGY",
      "TRAFFIC_TWIN",
      "TRAFFIC_DIVERSIFICATION",
      "CHARGING_STATION_INTELLIGENCE",
      "CHARGER_RELIABILITY",
      "RECOMMENDATION_ORCHESTRATOR",
    ]);
    expect(response.body.chargingIntelligence).toMatchObject({
      required: true,
      isSimulated: true,
      primary: {
        connectorType: "CCS2",
        eligible: true,
        reliability: { isUsable: true, sourceMode: "DEMO" },
      },
      backup: {
        connectorType: "CCS2",
        eligible: true,
      },
    });
    expect(response.body.chargingIntelligence.primary.chargerId).not.toBe(
      response.body.chargingIntelligence.backup.chargerId,
    );
    expect(response.body.recommendation).toMatchObject({
      status: "READY",
      recommendedRouteId: response.body.diversification.recommendedRouteId,
      recommendedChargerId: response.body.chargingIntelligence.primary.chargerId,
      backupChargerId: response.body.chargingIntelligence.backup.chargerId,
      reliabilityScore: response.body.chargingIntelligence.primary.reliability.score,
    });
    expect(
      response.body.chargingIntelligence.excludedCandidates.every(
        (candidate: { connectorType: string }) => candidate.connectorType !== "CCS2",
      ),
    ).toBe(true);
  });

  it("routes simulator fault telemetry through Module 6 and promotes the backup", async () => {
    const initial = await request(app).post("/api/v1/journey-eval/evaluate").send(journeyRequest);
    const originalPrimaryId = initial.body.chargingIntelligence.primary.chargerId as string;
    const originalBackupId = initial.body.chargingIntelligence.backup.chargerId as string;

    const telemetry = await request(app).post("/api/v1/telemetry").send({
      chargerId: originalPrimaryId,
      status: "FAULT",
      powerKw: 0,
      temperatureCelsius: 76,
      recordedAt: new Date().toISOString(),
      sourceMode: "SIMULATOR",
      isSimulated: true,
    });
    const reevaluated = await request(app)
      .post("/api/v1/journey-eval/evaluate")
      .send({ ...journeyRequest, diversificationSimulationId: "six-module-fault" });

    expect(telemetry.status).toBe(202);
    expect(reevaluated.status).toBe(200);
    expect(reevaluated.body.chargingIntelligence.primary.chargerId).toBe(originalBackupId);
    expect(reevaluated.body.recommendation.recommendedChargerId).toBe(originalBackupId);
    expect(reevaluated.body.recommendation.reasons.join(" ")).toContain("eligible CCS2");
    expect(
      reevaluated.body.chargingIntelligence.excludedCandidates.find(
        (candidate: { chargerId: string }) => candidate.chargerId === originalPrimaryId,
      ),
    ).toMatchObject({
      eligible: false,
      status: "FAULT",
      reliability: { isUsable: false, sourceMode: "SIMULATOR" },
    });
  });
});
