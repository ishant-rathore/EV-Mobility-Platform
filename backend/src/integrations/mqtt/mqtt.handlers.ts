import { chargerTelemetrySchema } from "../../modules/telemetry/telemetry.schemas.js";
import { recordTelemetry } from "../../modules/telemetry/telemetry.service.js";

export function handleTelemetryMessage(payload: Buffer) {
  const telemetry = chargerTelemetrySchema.parse(JSON.parse(payload.toString("utf8")));
  return recordTelemetry(telemetry);
}
