import { AppError } from "../../shared/errors.js";
import { reservationRepository } from "../booking/booking.repository.js";
import type { DemoPaymentRecord } from "./payment.types.js";

const paymentsByIdempotencyKey = new Map<string, DemoPaymentRecord>();

export interface SimulatePaymentInput {
  idempotencyKey: string;
  amount: number;
  currency: "INR";
  outcome: "APPROVED" | "DECLINED";
}

export function simulateReservationPayment(
  reservationId: string,
  input: SimulatePaymentInput,
): DemoPaymentRecord {
  const existing = paymentsByIdempotencyKey.get(input.idempotencyKey);
  if (existing) {
    if (existing.reservationId !== reservationId) {
      throw new AppError(
        "That idempotency key is already attached to another reservation.",
        409,
        "PAYMENT_IDEMPOTENCY_CONFLICT",
      );
    }
    return { ...existing };
  }

  const reservation = reservationRepository.findById(reservationId);
  if (!reservation) {
    throw new AppError("Reservation not found.", 404, "RESERVATION_NOT_FOUND");
  }
  if (!reservation.paymentRequired) {
    throw new AppError(
      "This demo reservation does not require payment.",
      409,
      "PAYMENT_NOT_REQUIRED",
    );
  }
  if (reservation.paymentStatus === "APPROVED") {
    throw new AppError("Payment is already approved.", 409, "PAYMENT_ALREADY_APPROVED");
  }

  const payment: DemoPaymentRecord = {
    id: crypto.randomUUID(),
    reservationId,
    idempotencyKey: input.idempotencyKey,
    amount: input.amount,
    currency: input.currency,
    status: input.outcome,
    provider: "DEMO_PAYMENT",
    providerReference: `demo_${crypto.randomUUID()}`,
    sourceMode: "DEMO",
    isSimulated: true,
    createdAt: new Date().toISOString(),
    disclaimer: "Simulated payment only; no money moved and no card data was collected.",
  };
  paymentsByIdempotencyKey.set(input.idempotencyKey, payment);
  reservationRepository.update(reservationId, {
    paymentStatus: input.outcome,
    ...(input.outcome === "APPROVED" ? { status: "CONFIRMED" } : {}),
  });
  return { ...payment };
}

export function resetPaymentStore(): void {
  paymentsByIdempotencyKey.clear();
}
