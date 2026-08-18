import type { ChargerTelemetry } from "../modules/telemetry/telemetry.schemas.js";

export interface ServerToClientEvents {
  "telemetry.updated": (payload: ChargerTelemetry) => void;
  "recommendation.updated": (payload: unknown) => void;
  "charger.faulted": (payload: { chargerId: string }) => void;
}
