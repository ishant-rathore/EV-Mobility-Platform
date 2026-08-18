import type { ChargerTelemetry } from "./telemetry.schemas.js";
import type { ReliabilityScore } from "../reliability/reliability.types.js";
import {
  getChargerReliability,
  ingestChargerTelemetry,
} from "../reliability/reliability.service.js";
import { isDemoDataFrozen } from "../admin/demo-runtime.store.js";

const latestByCharger = new Map<string, ChargerTelemetry>();
const receivedAtByCharger = new Map<string, string>();

export interface TelemetryIngestionResult {
  telemetry: ChargerTelemetry;
  reliability: ReliabilityScore;
  receivedAt: string;
}

type TelemetryListener = (result: TelemetryIngestionResult) => void;
const listeners = new Set<TelemetryListener>();

export function recordTelemetry(telemetry: ChargerTelemetry): ChargerTelemetry {
  if (isDemoDataFrozen()) return telemetry;
  latestByCharger.set(telemetry.chargerId, telemetry);
  const reliability = ingestChargerTelemetry(telemetry);
  const receivedAt = new Date().toISOString();
  receivedAtByCharger.set(telemetry.chargerId, receivedAt);
  const result = { telemetry, reliability, receivedAt };
  for (const listener of listeners) {
    try {
      listener(result);
    } catch {
      // A dashboard/WebSocket listener must never make validated ingestion fail.
    }
  }
  return telemetry;
}

export function getLatestTelemetry(chargerId: string): ChargerTelemetry | null {
  return latestByCharger.get(chargerId) ?? null;
}

export function listTelemetrySnapshots(now: Date = new Date()): TelemetryIngestionResult[] {
  return [...latestByCharger.entries()]
    .flatMap(([chargerId, telemetry]) => {
      const reliability = getChargerReliability(chargerId, now);
      return reliability
        ? [{
            telemetry,
            reliability,
            receivedAt: receivedAtByCharger.get(chargerId) ?? telemetry.recordedAt,
          }]
        : [];
    })
    .sort((left, right) => right.receivedAt.localeCompare(left.receivedAt));
}

export function subscribeToTelemetry(listener: TelemetryListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function resetTelemetryStore(): void {
  latestByCharger.clear();
  receivedAtByCharger.clear();
}
