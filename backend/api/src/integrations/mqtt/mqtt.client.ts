import { env } from "../../config/env.js";
import { handleTelemetryMessage } from "./mqtt.handlers.js";

export async function connectMqtt() {
  try {
    const mqtt = await import("mqtt");
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
  } catch (error) {
    console.warn("MQTT client unavailable:", error instanceof Error ? error.message : "import failed");
    return null;
  }
}

