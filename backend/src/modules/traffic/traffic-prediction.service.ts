import type { TrafficPredictionInput } from "./traffic.schemas.js";

export function predictTraffic(input: TrafficPredictionInput) {
  const speedRatio = Math.min(1, input.observedSpeedKph / input.freeFlowSpeedKph);
  const occupancyPenalty = input.occupancyPercent / 200;
  const congestionScore = Math.round(
    Math.max(0, Math.min(100, (1 - speedRatio + occupancyPenalty) * 100)),
  );

  return {
    segmentId: input.segmentId,
    congestionScore,
    travelTimeMultiplier: Number((1 + congestionScore / 100).toFixed(2)),
    level: congestionScore >= 70 ? "SEVERE" : congestionScore >= 40 ? "MODERATE" : "LIGHT",
  };
}
