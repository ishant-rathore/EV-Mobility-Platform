import type { ChargerTelemetry } from "./telemetry.schemas.js";
import { ingestChargerTelemetry } from "../reliability/reliability.service.js";
import { WebSocketEvent } from "../../realtime/websocket.events.js";
import { getWebSocketServer } from "../../realtime/websocket.server.js";

const latestByCharger = new Map<string, ChargerTelemetry>();

export function recordTelemetry(telemetry: ChargerTelemetry): ChargerTelemetry {
  latestByCharger.set(telemetry.chargerId, telemetry);
  const reliability = ingestChargerTelemetry(telemetry);

  const io = getWebSocketServer();
  io?.emit(WebSocketEvent.TELEMETRY_UPDATED, telemetry);
  if (reliability.status === "FAULT" || reliability.status === "OFFLINE") {
    io?.emit(WebSocketEvent.CHARGER_FAULTED, { chargerId: telemetry.chargerId });
  }

  return telemetry;
}

export function getLatestTelemetry(chargerId: string): ChargerTelemetry | null {
  return latestByCharger.get(chargerId) ?? null;
}
