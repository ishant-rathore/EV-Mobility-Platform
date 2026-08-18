import { z } from "zod";

export const planJourneySchema = z.object({
  vehicleId: z.string().min(1),
  originLabel: z.string().min(1),
  destinationLabel: z.string().min(1),
  originLatitude: z.number().optional(),
  originLongitude: z.number().optional(),
  destinationLatitude: z.number().optional(),
  destinationLongitude: z.number().optional(),
});
