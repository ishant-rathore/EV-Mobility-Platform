import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../shared/errors.js";

export class PaymentService {
  static async list(userId: string, isAdmin: boolean, page = 1, limit = 20) {
    const where = isAdmin ? {} : { userId };
    const skip = (page - 1) * limit;
    const [total, payments] = await Promise.all([
      prisma.payment.count({ where }),
      prisma.payment.findMany({
        where,
        skip,
        take: limit,
        include: { booking: { include: { parkingSlot: true } } },
        orderBy: { createdAt: "desc" },
      }),
    ]);
    return { payments, meta: { page, limit, total } };
  }

  static async getById(id: string, userId: string, isAdmin: boolean) {
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { booking: true },
    });
    if (!payment) {
      throw new AppError("Payment record not found.", 404, "PAYMENT_NOT_FOUND");
    }
    if (!isAdmin && payment.userId !== userId) {
      throw new AppError("You do not own this payment record.", 403, "FORBIDDEN");
    }
    return payment;
  }

  static async create(userId: string, data: { bookingId: string; amount: number; currency?: string }) {
    const booking = await prisma.booking.findUnique({ where: { id: data.bookingId } });
    if (!booking) {
      throw new AppError("Booking not found.", 404, "BOOKING_NOT_FOUND");
    }
    if (booking.userId !== userId) {
      throw new AppError("You can only pay for your own booking.", 403, "FORBIDDEN");
    }

    const existingPayment = await prisma.payment.findUnique({ where: { bookingId: data.bookingId } });
    if (existingPayment && existingPayment.status === "COMPLETED") {
      throw new AppError("Booking has already been paid.", 409, "PAYMENT_ALREADY_COMPLETED");
    }

    return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          bookingId: data.bookingId,
          userId,
          amount: data.amount,
          currency: data.currency || "INR",
          status: "COMPLETED",
          providerRef: `tx_${crypto.randomUUID()}`,
        },
      });

      await tx.booking.update({
        where: { id: data.bookingId },
        data: { status: "CONFIRMED" },
      });

      return payment;
    });
  }
}
