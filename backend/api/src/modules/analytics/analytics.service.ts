import { prisma } from "../../lib/prisma.js";
import { isInfrastructureOperatorRole } from "../../shared/roles.js";

export class AnalyticsService {
  static async getAnalytics(userId: string, roleName: string) {
    if (roleName === "ADMIN") {
      const [users, vehicles, stations, chargers, locations, bays, bookings, sessions, devices, chargingRevenue, parkingRevenue] = await Promise.all([
        prisma.user.count(),
        prisma.eVVehicle.count(),
        prisma.chargingStation.count(),
        prisma.charger.count(),
        prisma.parkingLocation.count(),
        prisma.parkingSlot.count(),
        prisma.booking.count(),
        prisma.chargingSession.count(),
        prisma.ioTDevice.count(),
        prisma.chargingSession.aggregate({ _sum: { cost: true, energyKwh: true } }),
        prisma.payment.aggregate({ where: { status: "COMPLETED" }, _sum: { amount: true } }),
      ]);
      return {
        scope: "PLATFORM",
        users,
        vehicles,
        stations,
        bookings,
        sessions,
        stationsManaged: stations,
        chargersManaged: chargers,
        chargingSessions: sessions,
        locationsManaged: locations,
        baysManaged: bays,
        parkingReservations: bookings,
        devicesManaged: devices,
        chargingRevenue: chargingRevenue._sum.cost ?? 0,
        parkingRevenue: parkingRevenue._sum.amount ?? 0,
        energyDeliveredKwh: chargingRevenue._sum.energyKwh ?? 0,
      };
    } else if (isInfrastructureOperatorRole(roleName)) {
      const [stations, chargers, sessions, locations, bays, bookings, devices, chargingRevenue, parkingRevenue] = await Promise.all([
        prisma.chargingStation.count({ where: { operatorId: userId } }),
        prisma.charger.count({ where: { station: { operatorId: userId } } }),
        prisma.chargingSession.count({ where: { charger: { station: { operatorId: userId } } } }),
        prisma.parkingLocation.count({ where: { operatorId: userId } }),
        prisma.parkingSlot.count({ where: { location: { operatorId: userId } } }),
        prisma.booking.count({ where: { parkingSlot: { location: { operatorId: userId } } } }),
        prisma.ioTDevice.count({ where: { parkingSlot: { location: { operatorId: userId } } } }),
        prisma.chargingSession.aggregate({
          where: { charger: { station: { operatorId: userId } } },
          _sum: { cost: true, energyKwh: true },
        }),
        prisma.payment.aggregate({
          where: { booking: { parkingSlot: { location: { operatorId: userId } } }, status: "COMPLETED" },
          _sum: { amount: true },
        }),
      ]);
      return {
        scope: "INFRASTRUCTURE_OPERATOR",
        stationsManaged: stations,
        chargersManaged: chargers,
        chargingSessions: sessions,
        locationsManaged: locations,
        baysManaged: bays,
        parkingReservations: bookings,
        devicesManaged: devices,
        chargingRevenue: chargingRevenue._sum.cost ?? 0,
        parkingRevenue: parkingRevenue._sum.amount ?? 0,
        energyDeliveredKwh: chargingRevenue._sum.energyKwh ?? 0,
      };
    } else {
      const [vehicles, journeys, bookings] = await Promise.all([
        prisma.eVVehicle.count({ where: { userId } }),
        prisma.journey.count({ where: { userId } }),
        prisma.booking.count({ where: { userId } }),
      ]);
      return { scope: "DRIVER", vehicles, journeys, bookings };
    }
  }
}
