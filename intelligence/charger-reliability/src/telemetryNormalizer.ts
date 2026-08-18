import { clampPercent } from "./healthScore.js";
import type { DataFreshness, ReliabilitySourceMode } from "./types.js";

const SOURCE_CONFIDENCE: Record<ReliabilitySourceMode, number> = {
  LIVE_IOT: 100,
  OCPP: 90,
  HARDWARE_DEMO: 80,
  LIMITED_IOT: 75,
  SIMULATOR: 60,
  DEMO: 55,
};

export function heartbeatFreshnessPercent(input: {
  heartbeatFreshnessPercent?: number;
  heartbeatAgeSeconds?: number;
}): number {
  if (input.heartbeatAgeSeconds !== undefined) {
    const age = Math.max(0, input.heartbeatAgeSeconds);
    if (age <= 60) return 100;
    if (age <= 120) return 85;
    if (age <= 300) return 60;
    if (age <= 900) return 25;
    return 0;
  }
  return clampPercent(input.heartbeatFreshnessPercent ?? 0);
}

export function freshnessLabel(freshnessPercent: number): DataFreshness {
  if (freshnessPercent >= 80) return "FRESH";
  if (freshnessPercent >= 50) return "AGING";
  if (freshnessPercent > 0) return "STALE";
  return "UNKNOWN";
}

export function dataConfidencePercent(
  sourceMode: ReliabilitySourceMode,
  telemetryCompletenessPercent = 100,
): number {
  return Math.round(
    SOURCE_CONFIDENCE[sourceMode] * 0.7 + clampPercent(telemetryCompletenessPercent) * 0.3,
  );
}
