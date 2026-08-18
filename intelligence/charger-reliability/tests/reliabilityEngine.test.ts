import { describe, expect, it } from "vitest";
import { calculateReliability } from "../src/reliabilityEngine.js";

const healthyInput = {
  chargerId: "charger-healthy",
  status: "AVAILABLE" as const,
  uptimePercent: 99,
  successfulSessionsPercent: 97,
  heartbeatAgeSeconds: 20,
  faultRatePercent: 1,
  recentFaultCount: 0,
  temperatureCelsius: 32,
  telemetryCompletenessPercent: 100,
  sourceMode: "LIVE_IOT" as const,
  calculatedAt: "2026-08-18T12:00:00.000Z",
};

describe("calculateReliability", () => {
  it("returns an explainable high-confidence score for a healthy charger", () => {
    const result = calculateReliability(healthyInput);

    expect(result.score).toBe(99);
    expect(result.grade).toBe("A");
    expect(result.isUsable).toBe(true);
    expect(result.recommendation).toBe("PREFERRED");
    expect(result.freshness).toBe("FRESH");
    expect(result.factors.sessionSuccess.weight).toBe(25);
    expect(result.reasons).toHaveLength(4);
  });

  it("invalidates an actively faulted charger despite healthy history", () => {
    const result = calculateReliability({ ...healthyInput, status: "FAULT" });

    expect(result.score).toBe(15);
    expect(result.isUsable).toBe(false);
    expect(result.recommendation).toBe("AVOID");
    expect(result.invalidatedBy).toContain("ACTIVE_FAULT");
  });

  it("makes an offline charger unavailable regardless of historical metrics", () => {
    const result = calculateReliability({ ...healthyInput, status: "OFFLINE" });

    expect(result.score).toBe(0);
    expect(result.grade).toBe("F");
    expect(result.recommendation).toBe("UNAVAILABLE");
    expect(result.availability.level).toBe("UNAVAILABLE");
  });

  it("reduces freshness and score as heartbeat data becomes stale", () => {
    const fresh = calculateReliability(healthyInput);
    const stale = calculateReliability({ ...healthyInput, heartbeatAgeSeconds: 1_000 });

    expect(stale.freshness).toBe("UNKNOWN");
    expect(stale.score).toBeLessThan(fresh.score);
    expect(stale.warnings).toContain("Heartbeat data is stale or unavailable.");
  });

  it("normalizes legacy FAULTED and OCCUPIED status names", () => {
    expect(calculateReliability({ ...healthyInput, status: "FAULTED" }).status).toBe("FAULT");
    expect(calculateReliability({ ...healthyInput, status: "OCCUPIED" }).status).toBe("CONNECTED_NOT_CHARGING");
  });

  it("marks simulated sources honestly", () => {
    const result = calculateReliability({ ...healthyInput, sourceMode: "SIMULATOR" });

    expect(result.confidencePercent).toBeLessThan(100);
    expect(result.warnings.some((warning) => warning.includes("SIMULATOR"))).toBe(true);
  });
});
