import { describe, expect, it } from "vitest";
import { selectBackupCharger } from "../src/backupSelector.js";
import { calculateReliability } from "../src/reliabilityEngine.js";

function reliability(chargerId: string, scoreInput: { status?: "AVAILABLE" | "FAULT"; uptime: number }) {
  return calculateReliability({
    chargerId,
    status: scoreInput.status ?? "AVAILABLE",
    uptimePercent: scoreInput.uptime,
    successfulSessionsPercent: scoreInput.uptime,
    heartbeatFreshnessPercent: 100,
    faultRatePercent: 100 - scoreInput.uptime,
    sourceMode: "DEMO",
    calculatedAt: "2026-08-18T12:00:00.000Z",
  });
}

describe("selectBackupCharger", () => {
  it("excludes the primary, incompatible, unreachable, and faulted chargers", () => {
    const result = selectBackupCharger(
      [
        { chargerId: "primary", reliability: reliability("primary", { uptime: 99 }), connectorCompatible: true, reachable: true },
        { chargerId: "faulted", reliability: reliability("faulted", { status: "FAULT", uptime: 99 }), connectorCompatible: true, reachable: true },
        { chargerId: "incompatible", reliability: reliability("incompatible", { uptime: 99 }), connectorCompatible: false, reachable: true },
        { chargerId: "backup", reliability: reliability("backup", { uptime: 92 }), connectorCompatible: true, reachable: true, detourKm: 2 },
      ],
      "primary",
    );

    expect(result?.chargerId).toBe("backup");
  });

  it("returns null when no usable backup exists", () => {
    expect(
      selectBackupCharger([
        { chargerId: "faulted", reliability: reliability("faulted", { status: "FAULT", uptime: 99 }), connectorCompatible: true, reachable: true },
      ]),
    ).toBeNull();
  });
});
