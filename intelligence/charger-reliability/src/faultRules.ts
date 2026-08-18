import type { CanonicalChargerStatus, ChargerOperationalStatus } from "./types.js";

export interface InvalidationResult {
  isUsable: boolean;
  reasons: string[];
  maximumScore: number;
}

export function normalizeChargerStatus(status: ChargerOperationalStatus = "AVAILABLE"): CanonicalChargerStatus {
  if (status === "CONNECTED" || status === "OCCUPIED") return "CONNECTED_NOT_CHARGING";
  if (status === "FAULTED") return "FAULT";
  return status;
}

export function faultHealthPercent(faultRatePercent: number, recentFaultCount = 0): number {
  const recentFaultPenalty = Math.max(0, recentFaultCount) * 15;
  return Math.max(0, Math.min(100, 100 - faultRatePercent - recentFaultPenalty));
}

export function evaluateInvalidation(
  status: CanonicalChargerStatus,
  temperatureCelsius?: number,
): InvalidationResult {
  const reasons: string[] = [];
  let maximumScore = 100;

  if (status === "OFFLINE") {
    reasons.push("CHARGER_OFFLINE");
    maximumScore = 0;
  } else if (status === "FAULT") {
    reasons.push("ACTIVE_FAULT");
    maximumScore = 15;
  }

  if (temperatureCelsius !== undefined && (temperatureCelsius > 80 || temperatureCelsius < -30)) {
    reasons.push("ABNORMAL_TEMPERATURE_READING");
    maximumScore = Math.min(maximumScore, 20);
  }

  return { isUsable: reasons.length === 0, reasons, maximumScore };
}
