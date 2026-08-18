import { clampScore } from "../../shared/scoring.js";
import type { ReliabilityInput, ReliabilityScore } from "./reliability.types.js";

export function calculateReliability(input: ReliabilityInput): ReliabilityScore {
  const score = Math.round(
    clampScore(
      input.uptimePercent * 0.35 +
        input.successfulSessionsPercent * 0.35 +
        input.heartbeatFreshnessPercent * 0.2 +
        (100 - input.faultRatePercent) * 0.1,
    ),
  );

  return {
    score,
    grade: score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : "D",
  };
}
