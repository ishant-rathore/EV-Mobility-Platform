import { createServer } from "node:http";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { featureFlags } from "./config/feature-flags.js";
import { connectMqtt } from "./integrations/mqtt/mqtt.client.js";
import { attachWebSocketServer } from "./realtime/websocket.server.js";

const httpServer = createServer(app);
attachWebSocketServer(httpServer);
if (featureFlags.mqttIngestion) connectMqtt();

httpServer.listen(env.PORT, () => {
  console.log(`VoltTwin API listening on http://localhost:${env.PORT}`);
});
