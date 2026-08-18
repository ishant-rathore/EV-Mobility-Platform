import { describe, expect, it } from "vitest";
import { calculateReliability } from "./reliability.service.js";

describe("calculateReliability", () => {
  it("gives healthy chargers an A grade", () => {
    expect(
      calculateReliability({
        uptimePercent: 99,
        successfulSessionsPercent: 97,
        heartbeatFreshnessPercent: 100,
        faultRatePercent: 1,
      }).grade,
    ).toBe("A");
  });
});
