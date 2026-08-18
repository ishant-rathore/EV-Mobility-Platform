import { io, type Socket } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";
const WS_URL = import.meta.env.VITE_WS_URL ?? API_URL.replace(/\/api\/v1\/?$/, "");

let socket: Socket | null = null;

/** Lazily connects a single shared Socket.IO client to the same host that runs the API. */
export function getSocket(): Socket {
  socket ??= io(WS_URL, { transports: ["websocket"] });
  return socket;
}
