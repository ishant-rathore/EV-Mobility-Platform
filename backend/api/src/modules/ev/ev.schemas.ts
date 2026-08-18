import { z } from "zod";
import { CONNECTOR_TYPES, VEHICLE_CLASSES } from "../../shared/enums.js";
import {
  DEFAULT_BATTERY_HEALTH_PERCENT,
  DEFAULT_RESERVE_SOC_PERCENT,
  MAX_BATTERY_CAPACITY_KWH,
  MAX_BATTERY_HEALTH_PERCENT,
  MAX_EFFICIENCY_WH_PER_KM,
  MAX_RESERVE_SOC_PERCENT,
  MAX_SOC_PERCENT,
  MIN_BATTERY_HEALTH_PERCENT,
  MIN_RESERVE_SOC_PERCENT,
  MIN_SOC_PERCENT,
} from "./ev.constants.js";

const socPercent = z
  .number()
  .min(MIN_SOC_PERCENT, `State of charge cannot be below ${MIN_SOC_PERCENT}%.`)
  .max(MAX_SOC_PERCENT, `State of charge cannot be above ${MAX_SOC_PERCENT}%.`);

const reserveSocPercent = z
  .number()
  .min(MIN_RESERVE_SOC_PERCENT, "Safety reserve cannot be negative.")
  .max(MAX_RESERVE_SOC_PERCENT, `Safety reserve cannot exceed ${MAX_RESERVE_SOC_PERCENT}%.`);

const batteryCapacityKwh = z
  .number()
  .positive("Battery capacity must be greater than zero.")
  .max(MAX_BATTERY_CAPACITY_KWH, "Battery capacity looks implausible — check the unit.");

const efficiencyWhPerKm = z
  .number()
  .positive("Efficiency must be greater than zero.")
  .max(MAX_EFFICIENCY_WH_PER_KM, "Efficiency looks implausible — check the unit.");

const batteryHealthPercent = z
  .number()
  .min(MIN_BATTERY_HEALTH_PERCENT, `Battery health below ${MIN_BATTERY_HEALTH_PERCENT}% is not supported.`)
  .max(MAX_BATTERY_HEALTH_PERCENT, "Battery health cannot exceed nominal capacity.");

const connectorTypes = z
  .array(z.enum(CONNECTOR_TYPES))
  .min(1, "At least one connector type is required.");

/** The full profile the battery engine operates on. */
export const evProfileSchema = z.object({
  name: z.string().min(1, "Vehicle name is required."),
  vehicleClass: z.enum(VEHICLE_CLASSES),
  connectorTypes,
  batteryCapacityKwh,
  batteryHealthPercent: batteryHealthPercent.default(DEFAULT_BATTERY_HEALTH_PERCENT),
  efficiencyWhPerKm,
  currentSocPercent: socPercent,
  reserveSocPercent: reserveSocPercent.default(DEFAULT_RESERVE_SOC_PERCENT),
});

export const createVehicleSchema = evProfileSchema.extend({
  isDefault: z.boolean().default(false),
});

export const updateSocSchema = z.object({
  currentSocPercent: socPercent,
});

/** Stateless preview: same maths, nothing persisted. */
export const evProfilePreviewSchema = evProfileSchema;

export type EvProfileInput = z.infer<typeof evProfileSchema>;
export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateSocInput = z.infer<typeof updateSocSchema>;
