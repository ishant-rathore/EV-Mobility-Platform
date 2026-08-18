import { beforeEach, describe, expect, it } from "vitest";
import { resetReliabilityStore } from "../reliability/reliability.service.js";
import { findChargingStations, recommendChargingCandidates } from "./charging.service.js";

describe("findChargingStations", () => {
  beforeEach(() => resetReliabilityStore());

  it("filters stations by charging power", async () => {
    const stations = await findChargingStations({ minimumPowerKw: 50 });
    expect(stations.every((station) => station.powerKw >= 50)).toBe(true);
  });

  it("uses Module 1 connector compatibility before ranking Module 5 candidates", async () => {
    const result = await recommendChargingCandidates({ connectorTypes: ["LEV_AC"] });

    expect(result.primary).toMatchObject({ connectorType: "LEV_AC", eligible: true });
    expect(result.backup).toMatchObject({ connectorType: "LEV_AC", eligible: true });
    expect(result.candidates.every((candidate) => candidate.connectorType === "LEV_AC")).toBe(true);
    expect(result.excludedCandidates.some((candidate) => candidate.connectorType === "CCS2")).toBe(
      true,
    );
  });
});
