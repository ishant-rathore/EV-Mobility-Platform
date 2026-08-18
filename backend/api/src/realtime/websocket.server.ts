import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { env } from "../config/env.js";
import type { ServerToClientEvents } from "./websocket.types.js";

export function attachWebSocketServer(httpServer: HttpServer) {
  return new Server<never, ServerToClientEvents>(httpServer, {
    cors: { origin: env.WEB_ORIGIN },
  });
}
