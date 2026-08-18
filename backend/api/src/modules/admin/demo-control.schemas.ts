import { z } from "zod";
import { DEMO_SOURCE_MODES, DEMO_TRAFFIC_LEVELS } from "./demo-runtime.store.js";

export const demoModeSchema = z.object({
  mode: z.enum(DEMO_SOURCE_MODES),
}).strict();

export const demoFreezeSchema = z.object({
  frozen: z.boolean(),
}).strict();

export const demoTrafficSchema = z.object({
  routeId: z.string().trim().min(1).max(100),
  level: z.enum(DEMO_TRAFFIC_LEVELS),
}).strict();

export const demoChargerActionSchema = z.object({
  chargerId: z.string().trim().min(1).max(120).default("charger-demo-1-ccs2"),
  action: z.enum(["CHARGING", "FAULT", "RESTORE"]),
}).strict();

export const demoBatchSchema = z.object({
  requestCount: z.number().int().min(1).max(500).default(20),
  demandUnitsPerRequest: z.number().positive().max(1_000).default(20),
  vehicleClasses: z
    .array(z.enum(["CAR", "BIKE", "TRUCK", "COMMERCIAL"]))
    .min(1)
    .default(["CAR", "BIKE", "TRUCK", "COMMERCIAL"]),
}).strict();

export const demoResetSchema = z.object({
  confirm: z.literal("RESET_DEMO"),
}).strict();
