import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../shared/errors.js";
import { isInfrastructureOperatorRole } from "../../shared/roles.js";

export class IoTDeviceService {
  static async listDevices(userId: string, roleName: string, page = 1, limit = 50) {
    const where = roleName === "ADMIN"
      ? {}
      : isInfrastructureOperatorRole(roleName)
        ? { parkingSlot: { location: { operatorId: userId } } }
        : { id: "__no_devices__" };
    const skip = (page - 1) * limit;
    const [total, devices] = await Promise.all([
      prisma.ioTDevice.count({ where }),
      prisma.ioTDevice.findMany({
        where,
        skip,
        take: limit,
        include: { parkingSlot: { include: { location: true } } },
        orderBy: { id: "asc" },
      }),
    ]);
    return { devices, meta: { page, limit, total } };
  }

  static async sendCommand(deviceId: string, command: "UNLOCK" | "LOCK", userId: string, roleName: string, reservationId?: string) {
    const device = await prisma.ioTDevice.findUnique({
      where: { id: deviceId },
      include: { parkingSlot: { include: { location: true } } },
    });

    if (!device) {
      throw new AppError("IoT Device not found.", 404, "DEVICE_NOT_FOUND");
    }

    // Business authorization
    let isAuthorized = false;

    if (roleName === "ADMIN") {
      isAuthorized = true;
    } else if (isInfrastructureOperatorRole(roleName)) {
      if (device.parkingSlot?.location?.operatorId === userId) {
        isAuthorized = true;
      }
    } else if (roleName === "DRIVER") {
      if (reservationId && command === "UNLOCK") {
        const booking = await prisma.booking.findUnique({
          where: { id: reservationId },
        });
        if (
          booking &&
          booking.userId === userId &&
          booking.parkingSlotId === device.parkingSlotId &&
          (booking.status === "CONFIRMED" || booking.status === "ACTIVE")
        ) {
          const now = Date.now();
          const accessStart = new Date(booking.startsAt).getTime() - 15 * 60 * 1000;
          const accessEnd = new Date(booking.endsAt).getTime();
          if (now >= accessStart && now <= accessEnd) {
            isAuthorized = true;
          }
        }
      }
    }

    if (!isAuthorized) {
      throw new AppError("Unauthorized to control this IoT device.", 403, "FORBIDDEN_DEVICE_ACCESS");
    }

    const createdCommand = await prisma.deviceCommand.create({
      data: {
        deviceId,
        command,
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    return {
      success: true,
      deviceId,
      command,
      status: "EXECUTED",
      commandId: createdCommand.id,
      timestamp: new Date().toISOString(),
    };
  }
}
