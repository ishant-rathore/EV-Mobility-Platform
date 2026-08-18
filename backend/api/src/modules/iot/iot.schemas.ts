import { z } from "zod";

export const deviceCommandSchema = z.object({
  reservationId: z.string().optional(),
});
