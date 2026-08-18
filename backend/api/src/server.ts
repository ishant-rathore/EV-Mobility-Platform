import { createServer } from "node:http";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { attachWebSocketServer } from "./realtime/websocket.server.js";

const httpServer = createServer(app);
attachWebSocketServer(httpServer);

httpServer.listen(env.PORT, () => {
  console.log(`VoltTwin API listening on http://localhost:${env.PORT}`);
});
