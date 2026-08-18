import { z } from "zod";

export const createStationSchema = z.object({
  name: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().optional(),
});

export const updateStationSchema = createStationSchema.partial();
