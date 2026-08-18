import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../shared/errors.js";

export class ParkingService {
  static async listLocations(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [total, locations] = await Promise.all([
      prisma.parkingLocation.count(),
      prisma.parkingLocation.findMany({
        skip,
        take: limit,
        include: { slots: { include: { device: true } }, operator: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      }),
    ]);
    return { locations, meta: { page, limit, total } };
  }

  static async getLocationById(id: string) {
    const location = await prisma.parkingLocation.findUnique({
      where: { id },
      include: { slots: { include: { device: true, occupancies: { take: 1, orderBy: { observedAt: "desc" } } } }, operator: true },
    });
    if (!location) {
      throw new AppError("Parking location not found.", 404, "PARKING_LOCATION_NOT_FOUND");
    }
    return location;
  }

  static async createLocation(operatorId: string, data: any) {
    return prisma.parkingLocation.create({
      data: { ...data, operatorId },
      include: { slots: true },
    });
  }

  static async updateLocation(id: string, data: any) {
    return prisma.parkingLocation.update({
      where: { id },
      data,
    });
  }

  static async listBays(locationId?: string, page = 1, limit = 50) {
    const where = locationId ? { locationId } : {};
    const skip = (page - 1) * limit;
    const [total, bays] = await Promise.all([
      prisma.parkingSlot.count({ where }),
      prisma.parkingSlot.findMany({
        where,
        skip,
        take: limit,
        include: { location: true, device: true },
        orderBy: { label: "asc" },
      }),
    ]);
    return { bays, meta: { page, limit, total } };
  }

  static async createBay(operatorId: string, isAdmin: boolean, data: any) {
    const loc = await prisma.parkingLocation.findUnique({ where: { id: data.locationId } });
    if (!loc) {
      throw new AppError("Parking location not found.", 404, "PARKING_LOCATION_NOT_FOUND");
    }
    if (!isAdmin && loc.operatorId !== operatorId) {
      throw new AppError("You do not manage this parking location.", 403, "FORBIDDEN");
    }
    return prisma.parkingSlot.create({ data });
  }

  static async updateBay(id: string, operatorId: string, isAdmin: boolean, data: any) {
    const bay = await prisma.parkingSlot.findUnique({ where: { id }, include: { location: true } });
    if (!bay) {
      throw new AppError("Parking slot not found.", 404, "BAY_NOT_FOUND");
    }
    if (!isAdmin && bay.location.operatorId !== operatorId) {
      throw new AppError("You do not manage this parking slot.", 403, "FORBIDDEN");
    }
    return prisma.parkingSlot.update({ where: { id }, data });
  }
}
