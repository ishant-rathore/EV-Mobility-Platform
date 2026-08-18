import { z } from "zod";

export const recommendationRequestSchema = z.object({
  distanceKm: z.number().positive(),
  batteryCapacityKwh: z.number().positive(),
  efficiencyWhPerKm: z.number().positive(),
  currentSocPercent: z.number().min(0).max(100),
  reserveSocPercent: z.number().min(0).max(100).default(15),
  minimumPowerKw: z.number().positive().optional(),
});

export type RecommendationRequest = z.infer<typeof recommendationRequestSchema>;
