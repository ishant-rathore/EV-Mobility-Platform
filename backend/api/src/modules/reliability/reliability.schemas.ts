import {
  CHARGER_OPERATIONAL_STATUSES,
  RELIABILITY_SOURCE_MODES,
} from "@ev-mobility/charger-reliability";
import { z } from "zod";

export const chargerOperationalStatusSchema = z.enum(CHARGER_OPERATIONAL_STATUSES);
export const reliabilitySourceModeSchema = z.enum(RELIABILITY_SOURCE_MODES);

export const reliabilityAssessmentRequestSchema = z
  .object({
    chargerId: z.string().trim().min(1).max(120),
    status: chargerOperationalStatusSchema.default("AVAILABLE"),
    uptimePercent: z.number().min(0).max(100),
    successfulSessionsPercent: z.number().min(0).max(100),
    heartbeatFreshnessPercent: z.number().min(0).max(100).optional(),
    heartbeatAgeSeconds: z.number().nonnegative().optional(),
    faultRatePercent: z.number().min(0).max(100),
    recentFaultCount: z.number().int().nonnegative().default(0),
    temperatureCelsius: z.number().min(-40).max(125).optional(),
    telemetryCompletenessPercent: z.number().min(0).max(100).default(100),
    sourceMode: reliabilitySourceModeSchema.default("DEMO"),
  })
  .refine(
    (input) => input.heartbeatAgeSeconds !== undefined || input.heartbeatFreshnessPercent !== undefined,
    { message: "Provide heartbeatAgeSeconds or heartbeatFreshnessPercent.", path: ["heartbeatAgeSeconds"] },
  );

export type ReliabilityAssessmentRequest = z.infer<typeof reliabilityAssessmentRequestSchema>;
