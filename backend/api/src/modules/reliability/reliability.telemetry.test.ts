import { beforeEach, describe, expect, it } from "vitest";
import {
  assessChargerReliability,
  getChargerReliability,
  ingestChargerTelemetry,
  listChargerReliability,
  resetReliabilityStore,
} from "./reliability.service.js";

describe("Module 6 telemetry handoff", () => {
  beforeEach(() => resetReliabilityStore());

  it("derives OFFLINE after the telemetry heartbeat exceeds 15 minutes", () => {
    ingestChargerTelemetry(
      {
        chargerId: "charger-stale",
        status: "AVAILABLE",
        temperatureCelsius: 30,
        recordedAt: "2026-08-18T10:00:00.000Z",
        sourceMode: "LIVE_IOT",
      },
      new Date("2026-08-18T10:00:00.000Z"),
    );

    const result = getChargerReliability(
      "charger-stale",
      new Date("2026-08-18T10:16:00.000Z"),
    );

    expect(result?.status).toBe("OFFLINE");
    expect(result?.score).toBe(0);
    expect(result?.invalidatedBy).toContain("CHARGER_OFFLINE");
  });

  it("combines operational history with the latest telemetry state", () => {
    assessChargerReliability({
      chargerId: "charger-combined",
      status: "AVAILABLE",
      uptimePercent: 97,
      successfulSessionsPercent: 95,
      heartbeatFreshnessPercent: 100,
      faultRatePercent: 3,
      sourceMode: "OCPP",
    }, new Date("2026-08-18T11:00:00.000Z"));

    const result = ingestChargerTelemetry({
      chargerId: "charger-combined",
      status: "CHARGING",
      temperatureCelsius: 42,
      recordedAt: "2026-08-18T11:01:00.000Z",
      sourceMode: "LIVE_IOT",
    }, new Date("2026-08-18T11:01:10.000Z"));

    expect(result.status).toBe("CHARGING");
    expect(result.freshness).toBe("FRESH");
    expect(result.factors.sessionSuccess.value).toBe(95);
    expect(result.sourceMode).toBe("LIVE_IOT");
  });

  it("lists assessments in descending reliability order", () => {
    assessChargerReliability({
      chargerId: "charger-low",
      status: "AVAILABLE",
      uptimePercent: 55,
      successfulSessionsPercent: 50,
      heartbeatFreshnessPercent: 60,
      faultRatePercent: 25,
    });
    assessChargerReliability({
      chargerId: "charger-high",
      status: "AVAILABLE",
      uptimePercent: 99,
      successfulSessionsPercent: 98,
      heartbeatFreshnessPercent: 100,
      faultRatePercent: 1,
    });

    expect(listChargerReliability().map((item) => item.chargerId)).toEqual([
      "charger-high",
      "charger-low",
    ]);
  });
});
