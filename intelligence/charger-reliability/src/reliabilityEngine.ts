export interface ReliabilityInput {
  uptimePercent: number;
  successfulSessionsPercent: number;
  heartbeatFreshnessPercent: number;
  faultRatePercent: number;
}

export interface ReliabilityScore {
  score: number;
  grade: "A" | "B" | "C" | "D";
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function calculateReliability(input: ReliabilityInput): ReliabilityScore {
  const score = Math.round(clampScore(
    input.uptimePercent * 0.35 +
      input.successfulSessionsPercent * 0.35 +
      input.heartbeatFreshnessPercent * 0.2 +
      (100 - input.faultRatePercent) * 0.1,
  ));

  return { score, grade: score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : "D" };
}
