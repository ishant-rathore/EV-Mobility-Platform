import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../shared/errors.js";

export class StationService {
  static async list(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [total, stations] = await Promise.all([
      prisma.chargingStation.count(),
      prisma.chargingStation.findMany({
        skip,
        take: limit,
        include: { chargers: true, operator: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      }),
    ]);
    return { stations, meta: { page, limit, total } };
  }

  static async getById(id: string) {
    const station = await prisma.chargingStation.findUnique({
      where: { id },
      include: { chargers: true, operator: { select: { id: true, name: true, email: true } }, reviews: true },
    });
    if (!station) {
      throw new AppError("Charging station not found.", 404, "STATION_NOT_FOUND");
    }
    return station;
  }

  static async create(operatorId: string, data: any) {
    return prisma.chargingStation.create({
      data: {
        ...data,
        operatorId,
      },
      include: { chargers: true },
    });
  }

  static async update(id: string, data: any) {
    return prisma.chargingStation.update({
      where: { id },
      data,
      include: { chargers: true },
    });
  }

  static async delete(id: string) {
    await prisma.chargingStation.delete({ where: { id } });
    return { message: "Station deleted successfully." };
  }
}
