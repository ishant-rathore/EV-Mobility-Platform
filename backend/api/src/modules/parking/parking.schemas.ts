import { z } from "zod";

export const createLocationSchema = z.object({
  name: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
});

export const updateLocationSchema = createLocationSchema.partial();

export const createBaySchema = z.object({
  locationId: z.string().min(1),
  label: z.string().min(1),
  isEvEnabled: z.boolean().default(false),
});

export const updateBaySchema = createBaySchema.partial();
