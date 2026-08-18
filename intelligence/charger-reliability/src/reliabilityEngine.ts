import { assessAvailability } from "./availabilityPredictor.js";
import { evaluateInvalidation, faultHealthPercent, normalizeChargerStatus } from "./faultRules.js";
import {
  RELIABILITY_WEIGHTS,
  clampPercent,
  gradeForScore,
  stateHealthPercent,
  temperatureStabilityPercent,
} from "./healthScore.js";
import {
  dataConfidencePercent,
  freshnessLabel,
  heartbeatFreshnessPercent,
} from "./telemetryNormalizer.js";
import type {
  ReliabilityFactorKey,
  ReliabilityFactorScore,
  ReliabilityInput,
  ReliabilityRecommendation,
  ReliabilityScore,
} from "./types.js";

function factor(
  value: number,
  weight: number,
  explanation: string,
): ReliabilityFactorScore {
  const normalizedValue = clampPercent(value);
  return {
    value: Math.round(normalizedValue),
    weight: Math.round(weight * 100),
    contribution: Number((normalizedValue * weight).toFixed(2)),
    explanation,
  };
}

function recommendationFor(score: number, isUsable: boolean): ReliabilityRecommendation {
  if (!isUsable) return score === 0 ? "UNAVAILABLE" : "AVOID";
  return score >= 85 ? "PREFERRED" : score >= 70 ? "ACCEPTABLE" : score >= 50 ? "CAUTION" : "AVOID";
}

export function calculateReliability(input: ReliabilityInput): ReliabilityScore {
  const status = normalizeChargerStatus(input.status);
  const sourceMode = input.sourceMode ?? "DEMO";
  const heartbeat = heartbeatFreshnessPercent(input);
  const confidence = dataConfidencePercent(sourceMode, input.telemetryCompletenessPercent);
  const recentFaults = input.recentFaultCount ?? 0;

  const factors: Record<ReliabilityFactorKey, ReliabilityFactorScore> = {
    currentState: factor(
      stateHealthPercent(status),
      RELIABILITY_WEIGHTS.currentState,
      `Current normalized charger state is ${status}.`,
    ),
    uptime: factor(
      input.uptimePercent,
      RELIABILITY_WEIGHTS.uptime,
      `Observed uptime is ${Math.round(clampPercent(input.uptimePercent))}%.`,
    ),
    sessionSuccess: factor(
      input.successfulSessionsPercent,
      RELIABILITY_WEIGHTS.sessionSuccess,
      `Successful-session rate is ${Math.round(clampPercent(input.successfulSessionsPercent))}%.`,
    ),
    heartbeatFreshness: factor(
      heartbeat,
      RELIABILITY_WEIGHTS.heartbeatFreshness,
      input.heartbeatAgeSeconds === undefined
        ? `Heartbeat freshness input is ${Math.round(heartbeat)}%.`
        : `Latest heartbeat is ${Math.round(Math.max(0, input.heartbeatAgeSeconds))} seconds old.`,
    ),
    recentFaults: factor(
      faultHealthPercent(input.faultRatePercent, recentFaults),
      RELIABILITY_WEIGHTS.recentFaults,
      `${recentFaults} recent fault(s); fault rate is ${Math.round(clampPercent(input.faultRatePercent))}%.`,
    ),
    temperatureStability: factor(
      temperatureStabilityPercent(input.temperatureCelsius),
      RELIABILITY_WEIGHTS.temperatureStability,
      input.temperatureCelsius === undefined
        ? "No temperature measurement was supplied; a neutral prototype value is used."
        : `Latest measured temperature is ${input.temperatureCelsius}°C.`,
    ),
    dataConfidence: factor(
      confidence,
      RELIABILITY_WEIGHTS.dataConfidence,
      `Source is ${sourceMode}; telemetry completeness is ${Math.round(clampPercent(input.telemetryCompletenessPercent ?? 100))}%.`,
    ),
  };

  const rawScore = Object.values(factors).reduce((total, item) => total + item.contribution, 0);
  const invalidation = evaluateInvalidation(status, input.temperatureCelsius);
  const score = Math.round(Math.min(rawScore, invalidation.maximumScore));
  const recommendation = recommendationFor(score, invalidation.isUsable);
  const freshness = freshnessLabel(heartbeat);
  const warnings: string[] = [
    "Prototype operational reliability heuristic; not a certified electrical-safety score or availability guarantee.",
  ];

  if (sourceMode === "DEMO" || sourceMode === "SIMULATOR" || sourceMode === "HARDWARE_DEMO") {
    warnings.push(`${sourceMode} data must be presented as simulated/demo data.`);
  }
  if (freshness === "STALE" || freshness === "UNKNOWN") {
    warnings.push("Heartbeat data is stale or unavailable.");
  }
  if (input.temperatureCelsius === undefined) {
    warnings.push("Temperature stability has reduced confidence because no reading was supplied.");
  }
  if (invalidation.reasons.length > 0) {
    warnings.push(`Charger invalidated by: ${invalidation.reasons.join(", ")}.`);
  }

  const reasons = [
    factors.currentState.explanation,
    factors.sessionSuccess.explanation,
    factors.heartbeatFreshness.explanation,
    factors.recentFaults.explanation,
  ];
  const availability = assessAvailability({ score, isUsable: invalidation.isUsable, recommendation });

  return {
    chargerId: input.chargerId ?? null,
    score,
    grade: gradeForScore(score),
    status,
    isUsable: invalidation.isUsable,
    recommendation,
    freshness,
    confidencePercent: confidence,
    sourceMode,
    availability,
    factors,
    reasons,
    warnings,
    invalidatedBy: invalidation.reasons,
    calculatedAt: input.calculatedAt ?? new Date().toISOString(),
  };
}
