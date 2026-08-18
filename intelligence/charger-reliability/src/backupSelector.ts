import type { BackupChargerCandidate } from "./types.js";

export function selectBackupCharger(
  candidates: readonly BackupChargerCandidate[],
  primaryChargerId?: string,
): BackupChargerCandidate | null {
  return (
    candidates
      .filter(
        (candidate) =>
          candidate.chargerId !== primaryChargerId &&
          candidate.connectorCompatible &&
          candidate.reachable &&
          candidate.reliability.isUsable,
      )
      .sort(
        (left, right) =>
          right.reliability.score - left.reliability.score ||
          (left.detourKm ?? Number.POSITIVE_INFINITY) - (right.detourKm ?? Number.POSITIVE_INFINITY) ||
          left.chargerId.localeCompare(right.chargerId),
      )[0] ?? null
  );
}
