import { z } from "zod";
import { CONNECTOR_TYPES } from "../../shared/enums.js";
import { routeLocationSchema } from "../routing/routing.schemas.js";

export const stationQuerySchema = z.object({
  minimumPowerKw: z.coerce.number().positive().optional(),
  onlyAvailable: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
});

export const chargingRecommendationSchema = z.object({
  stationIds: z.array(z.string().trim().min(1)).optional(),
  connectorTypes: z.array(z.enum(CONNECTOR_TYPES)).min(1),
  minimumPowerKw: z.number().positive().optional(),
  routeGeometry: z.array(routeLocationSchema).min(2).optional(),
  origin: routeLocationSchema.optional(),
  maximumReachKm: z.number().nonnegative().optional(),
});
