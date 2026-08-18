import { z } from "zod";

export const chargerTelemetrySchema = z.object({
  chargerId: z.string().min(1),
  status: z.enum(["AVAILABLE", "OCCUPIED", "OFFLINE", "FAULTED"]),
  powerKw: z.number().nonnegative(),
  temperatureCelsius: z.number().min(-40).max(125),
  recordedAt: z.iso.datetime().default(() => new Date().toISOString()),
});

export type ChargerTelemetry = z.infer<typeof chargerTelemetrySchema>;
