import type { AvailabilityAssessment, ReliabilityRecommendation } from "./types.js";

export function assessAvailability(input: {
  score: number;
  isUsable: boolean;
  recommendation: ReliabilityRecommendation;
}): AvailabilityAssessment {
  if (!input.isUsable) {
    return {
      level: "UNAVAILABLE",
      basis: "PROTOTYPE_HEURISTIC",
      explanation: "The current state invalidates this charger regardless of its historical score.",
    };
  }

  const level = input.score >= 80 ? "HIGH" : input.score >= 60 ? "MODERATE" : "LOW";
  return {
    level,
    basis: "PROTOTYPE_HEURISTIC",
    explanation: `${input.recommendation} is derived from transparent operational factors, not a guaranteed availability prediction.`,
  };
}
