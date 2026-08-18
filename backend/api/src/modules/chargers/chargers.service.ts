import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../shared/errors.js";

export class ChargerService {
  static async list(stationId?: string, page = 1, limit = 20) {
    const where = stationId ? { stationId } : {};
    const skip = (page - 1) * limit;
    const [total, chargers] = await Promise.all([
      prisma.charger.count({ where }),
      prisma.charger.findMany({
        where,
        skip,
        take: limit,
        include: { station: true },
        orderBy: { id: "asc" },
      }),
    ]);
    return { chargers, meta: { page, limit, total } };
  }

  static async getById(id: string) {
    const charger = await prisma.charger.findUnique({
      where: { id },
      include: { station: true, telemetry: { take: 5, orderBy: { recordedAt: "desc" } } },
    });
    if (!charger) {
      throw new AppError("Charger not found.", 404, "CHARGER_NOT_FOUND");
    }
    return charger;
  }

  static async create(operatorId: string, isAdmin: boolean, data: any) {
    const station = await prisma.chargingStation.findUnique({ where: { id: data.stationId } });
    if (!station) {
      throw new AppError("Charging station not found.", 404, "STATION_NOT_FOUND");
    }
    if (!isAdmin && station.operatorId !== operatorId) {
      throw new AppError("You do not manage this station.", 403, "FORBIDDEN");
    }

    return prisma.charger.create({ data });
  }

  static async update(id: string, operatorId: string, isAdmin: boolean, data: any) {
    const charger = await prisma.charger.findUnique({
      where: { id },
      include: { station: true },
    });
    if (!charger) {
      throw new AppError("Charger not found.", 404, "CHARGER_NOT_FOUND");
    }
    if (!isAdmin && charger.station.operatorId !== operatorId) {
      throw new AppError("You do not manage this charger.", 403, "FORBIDDEN");
    }

    return prisma.charger.update({ where: { id }, data });
  }

  static async delete(id: string, operatorId: string, isAdmin: boolean) {
    const charger = await prisma.charger.findUnique({
      where: { id },
      include: { station: true },
    });
    if (!charger) {
      throw new AppError("Charger not found.", 404, "CHARGER_NOT_FOUND");
    }
    if (!isAdmin && charger.station.operatorId !== operatorId) {
      throw new AppError("You do not manage this charger.", 403, "FORBIDDEN");
    }

    await prisma.charger.delete({ where: { id } });
    return { message: "Charger deleted successfully." };
  }
}
