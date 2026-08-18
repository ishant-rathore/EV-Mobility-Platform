import { z } from "zod";

export const stationQuerySchema = z.object({
  minimumPowerKw: z.coerce.number().positive().optional(),
  onlyAvailable: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
});
