import { z } from "zod";

export const createVehicleSchema = z.object({
  name: z.string().min(1),
  vehicleClass: z.enum(["CAR", "BIKE", "TRUCK", "COMMERCIAL"]).default("CAR"),
  connectorTypes: z.array(z.enum(["CCS2", "CHADEMO", "TYPE2", "BHARAT_DC_001", "BHARAT_AC_001", "LEV_AC"])).min(1),
  batteryCapacityKwh: z.number().positive(),
  batteryHealthPercent: z.number().min(1).max(100).default(100),
  efficiencyWhPerKm: z.number().positive(),
  currentSocPercent: z.number().min(0).max(100),
  reserveSocPercent: z.number().min(0).max(100).default(10),
  isDefault: z.boolean().default(false),
});

export const updateVehicleSchema = createVehicleSchema.partial();
