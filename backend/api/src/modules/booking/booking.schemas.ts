import { z } from "zod";

export const createReservationSchema = z
  .object({
    recommendationId: z.string().uuid(),
    driverId: z.string().trim().min(1).max(120),
    vehicleId: z.string().trim().min(1).max(120),
    startsAt: z.iso.datetime(),
    endsAt: z.iso.datetime(),
    assignParkingBay: z.boolean().default(true),
    paymentRequired: z.boolean().default(false),
  })
  .strict()
  .superRefine((input, context) => {
    const startsAt = new Date(input.startsAt).getTime();
    const endsAt = new Date(input.endsAt).getTime();
    if (endsAt <= startsAt) {
      context.addIssue({
        code: "custom",
        message: "endsAt must be later than startsAt",
        path: ["endsAt"],
      });
    }
    if (endsAt - startsAt > 24 * 60 * 60 * 1_000) {
      context.addIssue({
        code: "custom",
        message: "A demo reservation cannot exceed 24 hours",
        path: ["endsAt"],
      });
    }
  });

export const reservationQuerySchema = z.object({
  driverId: z.string().trim().min(1).max(120).optional(),
});

export const simulatedPaymentSchema = z
  .object({
    idempotencyKey: z.string().trim().min(8).max(120),
    amount: z.number().positive().max(1_000_000),
    currency: z.literal("INR").default("INR"),
    outcome: z.enum(["APPROVED", "DECLINED"]),
  })
  .strict();

export const occupancyEventSchema = z
  .object({
    occupied: z.boolean(),
  })
  .strict();

export type CreateReservationRequest = z.infer<typeof createReservationSchema>;
