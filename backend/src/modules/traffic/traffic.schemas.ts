import { z } from "zod";

export const trafficPredictionSchema = z.object({
  segmentId: z.string().min(1),
  freeFlowSpeedKph: z.number().positive(),
  observedSpeedKph: z.number().nonnegative(),
  occupancyPercent: z.number().min(0).max(100).default(0),
});

export type TrafficPredictionInput = z.infer<typeof trafficPredictionSchema>;

export const predictionMethodSchema = z.enum([
  "rush-hour",
  "rule-based",
  "regression",
  "historical",
]);

export const trafficSegmentSchema = z.object({
  segmentId: z.string().min(1),
  name: z.string().min(1),
  capacity: z.number().positive(),
  currentLoad: z.number().nonnegative(),
  predictedLoad: z.number().nonnegative(),
  vehicleEligibility: z.array(z.string()).min(1),
  freeFlowSpeedKph: z.number().positive(),
  observedSpeedKph: z.number().nonnegative(),
  occupancyPercent: z.number().min(0).max(100),
  distanceKm: z.number().positive(),
});

export type TrafficSegment = z.infer<typeof trafficSegmentSchema>;

export const trafficRouteSchema = z.object({
  routeId: z.string().min(1),
  name: z.string().min(1),
  distanceKm: z.number().positive(),
  segments: z.array(trafficSegmentSchema).min(1),
  totalCapacity: z.number().positive(),
  totalCurrentLoad: z.number().nonnegative(),
  totalPredictedLoad: z.number().nonnegative(),
  vehicleEligibility: z.array(z.string()).min(1),
});

export type TrafficRoute = z.infer<typeof trafficRouteSchema>;

export const trafficPredictionResultSchema = z.object({
  segmentId: z.string(),
  congestionScore: z.number().min(0).max(100),
  travelTimeMultiplier: z.number().positive(),
  level: z.enum(["LOW", "MEDIUM", "HIGH", "SEVERE"]),
  predictedLoad: z.number(),
  currentLoad: z.number(),
  capacity: z.number(),
  vehicleEligibility: z.array(z.string()),
  sourceMode: z.enum(["DEMO", "REAL"]),
  predictionMethod: z.enum(["rush-hour", "rule-based", "regression", "historical"]),
});

export type TrafficPredictionResult = z.infer<typeof trafficPredictionResultSchema>;

export const diversifyRoutesSchema = z.object({
  routes: z.array(trafficRouteSchema).min(1),
  vehicleClass: z.string().min(1),
  projectedRequests: z.number().int().nonnegative().default(0),
});

export type DiversifyRoutesInput = z.infer<typeof diversifyRoutesSchema>;

export const resetDemoSchema = z.object({
  routes: z.array(z.string()).optional(),
});

export type ResetDemoInput = z.infer<typeof resetDemoSchema>;
