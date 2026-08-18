import mqtt from "mqtt";
import { env } from "../../config/env.js";
import { handleTelemetryMessage } from "./mqtt.handlers.js";

export function connectMqtt() {
  const client = mqtt.connect(env.MQTT_URL);
  client.on("connect", () => client.subscribe("volttwin/chargers/+/telemetry"));
  client.on("message", (_topic, payload) => handleTelemetryMessage(payload));
  return client;
}
