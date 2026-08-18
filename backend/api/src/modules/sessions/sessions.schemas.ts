import { z } from "zod";

export const startSessionSchema = z.object({
  chargerId: z.string().min(1),
});
