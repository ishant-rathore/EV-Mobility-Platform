import { describe, expect, it } from "vitest";
import { predictTraffic } from "./traffic-prediction.service.js";

describe("predictTraffic", () => {
  it("marks a slow, occupied segment as congested", () => {
    const result = predictTraffic({
      segmentId: "segment-1",
      freeFlowSpeedKph: 60,
      observedSpeedKph: 15,
      occupancyPercent: 80,
    });

    expect(result.congestionScore).toBeGreaterThanOrEqual(70);
    expect(result.level).toBe("SEVERE");
  });
});
