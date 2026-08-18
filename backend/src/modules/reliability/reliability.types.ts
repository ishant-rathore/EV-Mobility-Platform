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
