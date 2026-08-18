import { prisma } from "../lib/prisma.js";
import { AuthenticatedUser } from "./authorization.types.js";

export class OwnershipService {
  /**
   * Checks if the user owns a specific vehicle.
   */
  static async ownsVehicle(user: AuthenticatedUser, vehicleId: string): Promise<boolean> {
    if (user.roleName === "ADMIN") return true;
    const vehicle = await prisma.eVVehicle.findUnique({ where: { id: vehicleId } });
    return vehicle?.userId === user.id;
  }

  /**
   * Checks if the user owns a specific journey.
   */
  static async ownsJourney(user: AuthenticatedUser, journeyId: string): Promise<boolean> {
    if (user.roleName === "ADMIN") return true;
    const journey = await prisma.journey.findUnique({ where: { id: journeyId } });
    return journey?.userId === user.id;
  }

  /**
   * Checks if the user owns a specific reservation.
   */
  static async ownsReservation(user: AuthenticatedUser, reservationId: string): Promise<boolean> {
    if (user.roleName === "ADMIN") return true;
    const booking = await prisma.booking.findUnique({ where: { id: reservationId } });
    return booking?.userId === user.id;
  }

  /**
   * Checks if the user is the operator of a specific charging station.
   */
  static async managesStation(user: AuthenticatedUser, stationId: string): Promise<boolean> {
    if (user.roleName === "ADMIN") return true;
    const station = await prisma.chargingStation.findUnique({ where: { id: stationId } });
    return station?.operatorId === user.id;
  }

  /**
   * Checks if the user is the operator of a specific parking location.
   */
  static async managesParking(user: AuthenticatedUser, parkingLocationId: string): Promise<boolean> {
    if (user.roleName === "ADMIN") return true;
    const parking = await prisma.parkingLocation.findUnique({ where: { id: parkingLocationId } });
    return parking?.operatorId === user.id;
  }

  /**
   * Checks if the user is the operator for an IoT device's parking location.
   */
  static async managesIoTDevice(user: AuthenticatedUser, deviceId: string): Promise<boolean> {
    if (user.roleName === "ADMIN") return true;
    const device = await prisma.ioTDevice.findUnique({
      where: { id: deviceId },
      include: { parkingSlot: { include: { location: true } } }
    });
    return device?.parkingSlot?.location?.operatorId === user.id;
  }
}
