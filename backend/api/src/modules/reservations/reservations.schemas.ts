import { z } from "zod";

export const createReservationSchema = z.object({
  parkingSlotId: z.string().min(1),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
});
