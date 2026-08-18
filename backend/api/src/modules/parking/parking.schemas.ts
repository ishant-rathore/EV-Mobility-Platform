import { z } from "zod";

export const parkingQuerySchema = z.object({
  stationId: z.string().trim().min(1).max(120).optional(),
});
