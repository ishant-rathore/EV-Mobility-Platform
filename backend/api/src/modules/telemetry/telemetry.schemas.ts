import { z } from "zod";
import {
  CHARGER_OPERATIONAL_STATUSES,
  RELIABILITY_SOURCE_MODES,
} from "@ev-mobility/charger-reliability";

export const chargerTelemetrySchema = z.object({
  chargerId: z.string().min(1),
  status: z.enum(CHARGER_OPERATIONAL_STATUSES),
  powerKw: z.number().nonnegative(),
  temperatureCelsius: z.number().min(-40).max(125),
  recordedAt: z.iso.datetime().default(() => new Date().toISOString()),
  sourceMode: z.enum(RELIABILITY_SOURCE_MODES).optional(),
  isSimulated: z.boolean().optional(),
});

export type ChargerTelemetry = z.infer<typeof chargerTelemetrySchema>;
