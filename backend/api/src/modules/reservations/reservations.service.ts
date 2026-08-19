import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../shared/errors.js";
import { isInfrastructureOperatorRole } from "../../shared/roles.js";

export class ReservationService {
  static async list(userId: string, roleName: string, page = 1, limit = 20) {
    let where: any = {};
    if (roleName === "DRIVER") {
      where = { userId };
    } else if (isInfrastructureOperatorRole(roleName)) {
      where = { parkingSlot: { location: { operatorId: userId } } };
    }
    // ADMIN sees all

    const skip = (page - 1) * limit;
    const [total, reservations] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        include: {
          parkingSlot: { include: { location: true, device: true } },
          charger: { include: { station: true } },
          payment: true,
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { startsAt: "desc" },
      }),
    ]);

    return { reservations, meta: { page, limit, total } };
  }

  static async getById(id: string) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        parkingSlot: { include: { location: true, device: true } },
        charger: { include: { station: true } },
        payment: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });
    if (!booking) {
      throw new AppError("Reservation not found.", 404, "RESERVATION_NOT_FOUND");
    }
    return booking;
  }

  static async create(userId: string, data: { parkingSlotId: string; chargerId?: string; startsAt: string; endsAt: string }) {
    const slot = await prisma.parkingSlot.findUnique({
      where: { id: data.parkingSlotId },
    });
    if (!slot) {
      throw new AppError("Parking slot not found.", 404, "SLOT_NOT_FOUND");
    }

    if (data.chargerId) {
      const charger = await prisma.charger.findUnique({ where: { id: data.chargerId } });
      if (!charger) {
        throw new AppError("Charger not found.", 404, "CHARGER_NOT_FOUND");
      }
    }

    const start = new Date(data.startsAt);
    const end = new Date(data.endsAt);
    if (end <= start) {
      throw new AppError("End time must be after start time.", 400, "INVALID_TIME_RANGE");
    }

    // Check conflict
    const conflict = await prisma.booking.findFirst({
      where: {
        parkingSlotId: data.parkingSlotId,
        status: { in: ["CONFIRMED", "ACTIVE", "PENDING"] },
        OR: [
          { startsAt: { lte: end }, endsAt: { gte: start } },
        ],
      },
    });

    if (conflict) {
      throw new AppError("Slot is already reserved for that time range.", 409, "RESERVATION_CONFLICT");
    }

    return prisma.booking.create({
      data: {
        userId,
        parkingSlotId: data.parkingSlotId,
        chargerId: data.chargerId,
        startsAt: start,
        endsAt: end,
        status: "CONFIRMED",
      },
      include: { parkingSlot: { include: { location: true } }, charger: { include: { station: true } } },
    });
  }

  static async cancel(id: string) {
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new AppError("Reservation not found.", 404, "RESERVATION_NOT_FOUND");
    }
    if (booking.status === "COMPLETED" || booking.status === "CANCELLED") {
      throw new AppError("Cannot cancel completed or already cancelled reservation.", 400, "INVALID_STATE");
    }

    return prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED" },
    });
  }
}
