import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { env } from "../config/env.js";
import { subscribeToTelemetry } from "../modules/telemetry/telemetry.service.js";
import { WebSocketEvent } from "./websocket.events.js";
import type { ServerToClientEvents } from "./websocket.types.js";

let io: Server<never, ServerToClientEvents> | null = null;
let unsubscribeTelemetry: (() => void) | null = null;

export function attachWebSocketServer(httpServer: HttpServer) {
  io = new Server<never, ServerToClientEvents>(httpServer, {
    cors: { origin: env.WEB_ORIGIN },
  });
  unsubscribeTelemetry?.();
  unsubscribeTelemetry = subscribeToTelemetry(({ telemetry, reliability }) => {
    io?.emit(WebSocketEvent.TELEMETRY_UPDATED, telemetry);
    if (reliability.status === "FAULT" || reliability.status === "OFFLINE") {
      io?.emit(WebSocketEvent.CHARGER_FAULTED, { chargerId: telemetry.chargerId });
      io?.emit(WebSocketEvent.RECOMMENDATION_UPDATED, {
        trigger: reliability.status === "FAULT" ? "CHARGER_FAULT" : "CHARGER_OFFLINE",
        chargerId: telemetry.chargerId,
        recomputeRequired: true,
      });
    }
  });
  return io;
}

/** Null until `attachWebSocketServer` runs at boot (see server.ts); telemetry/reliability emit through this. */
export function getWebSocketServer(): Server<never, ServerToClientEvents> | null {
  return io;
}
