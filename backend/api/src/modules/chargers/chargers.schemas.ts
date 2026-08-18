import { z } from "zod";

export const createChargerSchema = z.object({
  stationId: z.string().min(1),
  connectorType: z.string().min(1),
  maximumPowerKw: z.number().positive(),
  status: z.enum(["AVAILABLE", "OCCUPIED", "OFFLINE", "FAULTED"]).default("AVAILABLE"),
});

export const updateChargerSchema = createChargerSchema.partial();
