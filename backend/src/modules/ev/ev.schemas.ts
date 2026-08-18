import { z } from "zod";

export const evProfileSchema = z.object({
  name: z.string().min(1),
  batteryCapacityKwh: z.number().positive(),
  efficiencyWhPerKm: z.number().positive(),
  currentSocPercent: z.number().min(0).max(100),
});
