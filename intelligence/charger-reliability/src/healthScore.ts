import type { CanonicalChargerStatus, ReliabilityGrade } from "./types.js";

export const RELIABILITY_WEIGHTS = {
  currentState: 0.2,
  uptime: 0.2,
  sessionSuccess: 0.25,
  heartbeatFreshness: 0.15,
  recentFaults: 0.1,
  temperatureStability: 0.05,
  dataConfidence: 0.05,
} as const;

export function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

export function gradeForScore(score: number): ReliabilityGrade {
  return score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : score >= 40 ? "D" : "F";
}

export function stateHealthPercent(status: CanonicalChargerStatus): number {
  switch (status) {
    case "AVAILABLE":
      return 100;
    case "CONNECTED_NOT_CHARGING":
      return 88;
    case "CHARGING":
      return 92;
    case "FAULT":
      return 10;
    case "OFFLINE":
      return 0;
  }
}

export function temperatureStabilityPercent(temperatureCelsius?: number): number {
  if (temperatureCelsius === undefined) return 70;
  if (temperatureCelsius >= -20 && temperatureCelsius <= 50) return 100;
  if (temperatureCelsius > 50 && temperatureCelsius <= 60) return 75;
  if (temperatureCelsius > 60 && temperatureCelsius <= 75) return 35;
  return 10;
}
