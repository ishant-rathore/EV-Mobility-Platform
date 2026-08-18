import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { env } from "../config/env.js";
import type { ServerToClientEvents } from "./websocket.types.js";

let io: Server<never, ServerToClientEvents> | null = null;

export function attachWebSocketServer(httpServer: HttpServer) {
  io = new Server<never, ServerToClientEvents>(httpServer, {
    cors: { origin: env.WEB_ORIGIN },
  });
  return io;
}

/** Null until `attachWebSocketServer` runs at boot (see server.ts); telemetry/reliability emit through this. */
export function getWebSocketServer(): Server<never, ServerToClientEvents> | null {
  return io;
}
