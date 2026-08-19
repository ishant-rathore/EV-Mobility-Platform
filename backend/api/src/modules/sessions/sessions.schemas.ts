import { z } from "zod";

export const startSessionSchema = z.object({
  chargerId: z.string().min(1),
});

export const stopSessionSchema = z.object({
  energyKwh: z.number().nonnegative().optional(),
  cost: z.number().nonnegative().optional(),
});
