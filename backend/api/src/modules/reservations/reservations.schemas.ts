import { z } from "zod";

export const createReservationSchema = z.object({
  parkingSlotId: z.string().min(1),
  chargerId: z.string().min(1).optional(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
});
