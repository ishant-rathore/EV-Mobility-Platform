import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../shared/errors.js";

export class VehicleService {
  static async listVehicles(userId: string, isAdmin: boolean, page = 1, limit = 20) {
    const where = isAdmin ? {} : { userId };
    const skip = (page - 1) * limit;
    const [total, vehicles] = await Promise.all([
      prisma.eVVehicle.count({ where }),
      prisma.eVVehicle.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
    ]);
    return { vehicles, meta: { page, limit, total } };
  }

  static async getVehicleById(id: string) {
    const vehicle = await prisma.eVVehicle.findUnique({ where: { id } });
    if (!vehicle) {
      throw new AppError("Vehicle not found.", 404, "VEHICLE_NOT_FOUND");
    }
    return vehicle;
  }

  static async createVehicle(userId: string, data: any) {
    if (data.isDefault) {
      await prisma.eVVehicle.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }
    return prisma.eVVehicle.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  static async updateVehicle(id: string, data: any) {
    return prisma.eVVehicle.update({
      where: { id },
      data,
    });
  }

  static async deleteVehicle(id: string) {
    await prisma.eVVehicle.delete({ where: { id } });
    return { message: "Vehicle deleted successfully." };
  }
}
