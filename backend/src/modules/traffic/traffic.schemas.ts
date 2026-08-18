import { z } from "zod";

export const trafficPredictionSchema = z.object({
  segmentId: z.string().min(1),
  freeFlowSpeedKph: z.number().positive(),
  observedSpeedKph: z.number().nonnegative(),
  occupancyPercent: z.number().min(0).max(100).default(0),
});

export type TrafficPredictionInput = z.infer<typeof trafficPredictionSchema>;
