import { describe, expect, it } from "vitest";
import {
  evaluateAndRankChargingCandidates,
  type ChargingCandidateInput,
} from "../src/index.js";

const base: ChargingCandidateInput = {
  stationId: "station-a",
  stationName: "Station A",
  chargerId: "charger-a",
  connectorType: "CCS2",
  status: "AVAILABLE",
  availablePorts: 1,
  powerKw: 60,
  pricePerKwh: 18,
  detourKm: 2,
  estimatedWaitMinutes: 4,
  reachable: true,
  reliabilityScore: 90,
  reliabilityUsable: true,
};

describe("Module 05 candidate ranking", () => {
  it("applies compatibility and operational hard filters before scoring", () => {
    const results = evaluateAndRankChargingCandidates(
      [base, { ...base, chargerId: "faulted", status: "FAULT", reliabilityUsable: false }],
      { connectorTypes: ["CCS2"] },
    );

    expect(results[0]).toMatchObject({ chargerId: "charger-a", eligible: true, rank: 1 });
    expect(results[1]).toMatchObject({
      chargerId: "faulted",
      eligible: false,
      exclusionReasons: ["FAULT_OR_OFFLINE", "RELIABILITY_UNUSABLE"],
    });
  });

  it("ranks eligible chargers using an explainable score breakdown", () => {
    const results = evaluateAndRankChargingCandidates(
      [base, { ...base, chargerId: "charger-b", reliabilityScore: 70, detourKm: 8 }],
      { connectorTypes: ["CCS2"] },
    );

    expect(results.map((candidate) => candidate.chargerId)).toEqual(["charger-a", "charger-b"]);
    expect(results[0]?.scoreBreakdown).toMatchObject({
      reliability: expect.any(Number),
      detour: expect.any(Number),
      total: expect.any(Number),
    });
  });
});
