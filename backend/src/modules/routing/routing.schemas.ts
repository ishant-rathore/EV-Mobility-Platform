import { z } from "zod";
import { WEATHER_CONDITIONS } from "./environment-factor.service.js";

export const energyEstimateSchema = z
  .object({
    distanceKm: z.number().positive().max(5_000),
    batteryCapacityKwh: z.number().positive().max(500),
    usableBatteryCapacityKwh: z.number().positive().max(500).optional(),
    efficiencyWhPerKm: z.number().positive().max(2_000),
    currentSocPercent: z.number().min(0).max(100),
    vehicleClass: z.enum(["CAR", "BIKE", "TRUCK", "COMMERCIAL"]).optional(),
    connectorTypes: z
      .array(z.enum(["CCS2", "CHADEMO", "TYPE2", "BHARAT_DC_001", "BHARAT_AC_001", "LEV_AC"]))
      .optional(),
    availableEnergyKwh: z.number().nonnegative().max(500).optional(),
    reserveEnergyKwh: z.number().nonnegative().max(500).optional(),
    usableEnergyKwh: z.number().nonnegative().max(500).optional(),
    reserveSocPercent: z.number().min(0).max(100).default(15),
    trafficFactor: z.number().min(0.5).max(3).default(1),
    environmentFactor: z.number().min(0.5).max(2).default(1),
    auxiliaryLoadKwh: z.number().min(0).max(100).default(0),
  })
  .refine(
    ({ batteryCapacityKwh, usableBatteryCapacityKwh }) =>
      usableBatteryCapacityKwh === undefined || usableBatteryCapacityKwh <= batteryCapacityKwh,
    {
      message: "Usable battery capacity cannot exceed nominal battery capacity",
      path: ["usableBatteryCapacityKwh"],
    },
  );

export const routeLocationSchema = z.object({
  label: z.string().trim().min(1).max(120).optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

const vehicleEnergySchema = z
  .object({
    id: z.string().trim().min(1).max(100).optional(),
    batteryCapacityKwh: z.number().positive().max(500),
    usableBatteryCapacityKwh: z.number().positive().max(500).optional(),
    efficiencyWhPerKm: z.number().positive().max(2_000),
    currentSocPercent: z.number().min(0).max(100),
  })
  .refine(
    ({ batteryCapacityKwh, usableBatteryCapacityKwh }) =>
      usableBatteryCapacityKwh === undefined || usableBatteryCapacityKwh <= batteryCapacityKwh,
    {
      message: "Usable battery capacity cannot exceed nominal battery capacity",
      path: ["usableBatteryCapacityKwh"],
    },
  );

export const routeEvaluationSchema = z
  .object({
    origin: routeLocationSchema,
    destination: routeLocationSchema,
    vehicle: vehicleEnergySchema,
    reserveSocPercent: z.number().min(0).max(100).default(15),
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
    trafficHorizon: z.enum(["CURRENT", "PREDICTED"]).default("CURRENT"),
  })
  .refine(
    ({ origin, destination }) =>
      origin.latitude !== destination.latitude || origin.longitude !== destination.longitude,
    { message: "Origin and destination must be different", path: ["destination"] },
  );

export type RouteEvaluationRequest = z.infer<typeof routeEvaluationSchema>;
