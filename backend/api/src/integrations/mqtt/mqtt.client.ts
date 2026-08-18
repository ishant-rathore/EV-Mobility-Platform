import mqtt from "mqtt";
import { env } from "../../config/env.js";
import { handleTelemetryMessage } from "./mqtt.handlers.js";

export function connectMqtt() {
  const client = mqtt.connect(env.MQTT_URL);
  client.on("connect", () => {
    client.subscribe("volttwin/chargers/+/telemetry", { qos: 1 }, (error) => {
      if (error) console.error("MQTT telemetry subscription failed", error.message);
    });
  });
  client.on("message", (topic, payload) => {
    try {
      handleTelemetryMessage(topic, payload);
    } catch (error) {
      console.warn(
        "Rejected MQTT telemetry",
        error instanceof Error ? error.message : "unknown validation error",
      );
    }
  });
  client.on("error", (error) => console.warn("MQTT connection error", error.message));
  return client;
}
