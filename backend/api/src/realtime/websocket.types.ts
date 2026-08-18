import type { ChargerTelemetry } from "../modules/telemetry/telemetry.schemas.js";

export interface ServerToClientEvents {
  "telemetry.updated": (payload: ChargerTelemetry) => void;
  "recommendation.updated": (payload: {
    trigger: "CHARGER_FAULT" | "CHARGER_OFFLINE";
    chargerId: string;
    recomputeRequired: true;
  }) => void;
  "charger.faulted": (payload: { chargerId: string }) => void;
}
