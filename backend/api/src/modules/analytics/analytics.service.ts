import { prisma } from "../../lib/prisma.js";

export class AnalyticsService {
  static async getAnalytics(userId: string, roleName: string) {
    if (roleName === "ADMIN") {
      const [users, vehicles, stations, bookings, sessions] = await Promise.all([
        prisma.user.count(),
        prisma.eVVehicle.count(),
        prisma.chargingStation.count(),
        prisma.booking.count(),
        prisma.chargingSession.count(),
      ]);
      return { scope: "PLATFORM", users, vehicles, stations, bookings, sessions };
    } else if (roleName === "OPERATOR") {
      const stations = await prisma.chargingStation.count({ where: { operatorId: userId } });
      const sessions = await prisma.chargingSession.count({
        where: { charger: { station: { operatorId: userId } } },
      });
      return { scope: "OPERATOR", stationsManaged: stations, sessionsHandled: sessions };
    } else if (roleName === "PARKING_OPERATOR") {
      const locations = await prisma.parkingLocation.count({ where: { operatorId: userId } });
      const bookings = await prisma.booking.count({
        where: { parkingSlot: { location: { operatorId: userId } } },
      });
      return { scope: "PARKING_OPERATOR", locationsManaged: locations, bookingsHandled: bookings };
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
