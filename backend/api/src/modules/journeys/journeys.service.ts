import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../shared/errors.js";

export class JourneysService {
  static async list(userId: string, isAdmin: boolean, page = 1, limit = 20) {
    const where = isAdmin ? {} : { userId };
    const skip = (page - 1) * limit;
    const [total, journeys] = await Promise.all([
      prisma.journey.count({ where }),
      prisma.journey.findMany({
        where,
        skip,
        take: limit,
        include: { vehicle: true, routes: true, recommendations: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);
    return { journeys, meta: { page, limit, total } };
  }

  static async getById(id: string) {
    const journey = await prisma.journey.findUnique({
      where: { id },
      include: { vehicle: true, routes: { include: { segments: true } }, recommendations: true },
    });
    if (!journey) {
      throw new AppError("Journey not found.", 404, "JOURNEY_NOT_FOUND");
    }
    return journey;
  }

  static async plan(userId: string, input: any) {
    const vehicle = await prisma.eVVehicle.findUnique({ where: { id: input.vehicleId } });
    if (!vehicle) {
      throw new AppError("Specified vehicle not found.", 404, "VEHICLE_NOT_FOUND");
    }

    const journey = await prisma.journey.create({
      data: {
        userId,
        vehicleId: input.vehicleId,
        originLabel: input.originLabel,
        destinationLabel: input.destinationLabel,
        status: "PLANNED",
      },
      include: { vehicle: true },
    });

    return journey;
  }

  static async cancel(id: string) {
    const journey = await prisma.journey.update({
      where: { id },
      data: { status: "CANCELLED" },
    });
    return journey;
  }
}
