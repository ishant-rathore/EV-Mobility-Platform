import type { ChargerTelemetry } from "./telemetry.schemas.js";
import { ingestChargerTelemetry } from "../reliability/reliability.service.js";

const latestByCharger = new Map<string, ChargerTelemetry>();

export function recordTelemetry(telemetry: ChargerTelemetry): ChargerTelemetry {
  latestByCharger.set(telemetry.chargerId, telemetry);
  ingestChargerTelemetry(telemetry);
  return telemetry;
}

export function getLatestTelemetry(chargerId: string): ChargerTelemetry | null {
  return latestByCharger.get(chargerId) ?? null;
}
