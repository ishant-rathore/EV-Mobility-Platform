import { chargerTelemetrySchema } from "../../modules/telemetry/telemetry.schemas.js";
import { recordTelemetry } from "../../modules/telemetry/telemetry.service.js";

const TELEMETRY_TOPIC = /^volttwin\/chargers\/([^/]+)\/telemetry$/;

export function handleTelemetryMessage(topic: string, payload: Buffer) {
  const match = TELEMETRY_TOPIC.exec(topic);
  if (!match?.[1]) {
    throw new Error(`Unsupported MQTT telemetry topic: ${topic}`);
  }
  const telemetry = chargerTelemetrySchema.parse(JSON.parse(payload.toString("utf8")));
  if (telemetry.chargerId !== match[1]) {
    throw new Error("MQTT topic charger id does not match telemetry payload charger id");
  }
  return recordTelemetry(telemetry);
}
