import { AppError } from "../../shared/errors.js";
import { reservationRepository } from "../booking/booking.repository.js";
import { parkingRepository } from "../parking/parking.repository.js";
import type { DemoAccessCommand } from "./access.types.js";

const commands: DemoAccessCommand[] = [];

export function unlockDemoParkingAccess(
  reservationId: string,
  now: Date = new Date(),
): DemoAccessCommand {
  const reservation = reservationRepository.findById(reservationId);
  if (!reservation) {
    throw new AppError("Reservation not found.", 404, "RESERVATION_NOT_FOUND");
  }
  if (reservation.status !== "CONFIRMED" && reservation.status !== "ACTIVE") {
    throw new AppError(
      "Only a confirmed or active reservation can request access.",
      409,
      "RESERVATION_NOT_ACCESSIBLE",
    );
  }
  if (!reservation.parkingBayId) {
    throw new AppError(
      "This reservation has no assigned parking bay.",
      409,
      "PARKING_BAY_NOT_ASSIGNED",
    );
  }
  const accessOpensAt = new Date(reservation.startsAt).getTime() - 15 * 60 * 1_000;
  const accessClosesAt = new Date(reservation.endsAt).getTime();
  if (now.getTime() < accessOpensAt || now.getTime() > accessClosesAt) {
    throw new AppError(
      "Demo parking access is available from 15 minutes before the reservation until its end.",
      409,
      "ACCESS_OUTSIDE_WINDOW",
    );
  }

  const bay = parkingRepository.findById(reservation.parkingBayId);
  if (!bay?.deviceId) {
    throw new AppError(
      "The assigned demo bay has no access device.",
      409,
      "ACCESS_DEVICE_UNAVAILABLE",
    );
  }
  const command: DemoAccessCommand = {
    id: crypto.randomUUID(),
    reservationId,
    parkingBayId: bay.id,
    deviceId: bay.deviceId,
    command: "UNLOCK_DEMO_FLAP",
    status: "ACKNOWLEDGED",
    issuedAt: now.toISOString(),
    sourceMode: "SIMULATOR",
    isSimulated: true,
    disclaimer: "Simulated low-voltage prototype command; no live barrier or charger was controlled.",
  };
  commands.push(command);
  return { ...command };
}

export function resetAccessCommandStore(): void {
  commands.length = 0;
}
