import { z } from "zod";
import {
  CHARGER_OPERATIONAL_STATUSES,
  RELIABILITY_SOURCE_MODES,
} from "@ev-mobility/charger-reliability";

export const chargerTelemetrySchema = z.object({
  chargerId: z.string().trim().min(1).max(120),
  status: z.enum(CHARGER_OPERATIONAL_STATUSES),
  powerKw: z.number().nonnegative().optional(),
  voltageV: z.number().nonnegative().max(1_000).optional(),
  currentA: z.number().nonnegative().max(1_000).optional(),
  energyKwh: z.number().nonnegative().optional(),
  temperatureCelsius: z.number().min(-40).max(125).optional(),
  deviceUptimeSeconds: z.number().int().nonnegative().optional(),
  sequenceNumber: z.number().int().nonnegative().optional(),
  recordedAt: z.iso.datetime().default(() => new Date().toISOString()),
  sourceMode: z.enum(RELIABILITY_SOURCE_MODES).default("HARDWARE_DEMO"),
  isSimulated: z.boolean().optional(),
})
  .strict()
  .transform((input) => {
    const status =
      input.status === "CONNECTED" || input.status === "OCCUPIED"
        ? "CONNECTED_NOT_CHARGING"
        : input.status === "FAULTED"
          ? "FAULT"
          : input.status;
    const sourceMode = input.sourceMode === "DEMO" ? "HARDWARE_DEMO" : input.sourceMode;
    const sourceIsSimulated = sourceMode === "HARDWARE_DEMO" || sourceMode === "SIMULATOR";
    return {
      ...input,
      status,
      sourceMode,
      isSimulated: sourceIsSimulated || input.isSimulated === true,
    };
  });

export type ChargerTelemetry = z.infer<typeof chargerTelemetrySchema>;
