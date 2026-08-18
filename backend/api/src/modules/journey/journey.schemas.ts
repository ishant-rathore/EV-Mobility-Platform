import { z } from "zod";
import { WEATHER_CONDITIONS } from "../routing/environment-factor.service.js";
import { routeLocationSchema } from "../routing/routing.schemas.js";

export { recommendationRequestSchema as journeyPlanSchema } from "../recommendation/recommendation.schemas.js";

export const integratedJourneyEvaluationSchema = z
  .object({
    vehicleId: z.string().trim().min(1).max(100),
    currentSocPercent: z.number().min(0).max(100).optional(),
    reserveSocPercent: z.number().min(0).max(100).optional(),
    origin: routeLocationSchema,
    destination: routeLocationSchema,
    environmentFactor: z.number().min(0.5).max(2).optional(),
    environment: z
      .object({
        weatherCondition: z.enum(WEATHER_CONDITIONS).default("CLEAR"),
        ambientTemperatureC: z.number().min(-40).max(60).optional(),
        elevationGainM: z.number().min(0).max(10_000).default(0),
      })
      .optional(),
    auxiliaryLoadKwh: z.number().min(0).max(100).default(0),
    provider: z.enum(["DEMO", "OSRM", "AUTO"]).default("DEMO"),
    trafficHorizon: z.enum(["CURRENT", "PREDICTED"]).default("PREDICTED"),
    diversificationSimulationId: z.string().trim().min(1).max(100).default("driver-demo"),
    projectedDemandUnits: z.number().positive().max(1_000).default(1),
  })
  .refine(
    ({ origin, destination }) =>
      origin.latitude !== destination.latitude || origin.longitude !== destination.longitude,
    { message: "Origin and destination must be different", path: ["destination"] },
  );

export type IntegratedJourneyEvaluationRequest = z.infer<
  typeof integratedJourneyEvaluationSchema
>;
