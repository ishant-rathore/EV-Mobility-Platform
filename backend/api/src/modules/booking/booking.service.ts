import { AppError } from "../../shared/errors.js";
import { evRepository } from "../ev/ev.store.js";
import {
  isParkingBayOccupied,
  listOccupancyEvents,
  recordOccupancyEvent,
} from "../occupancy/occupancy.service.js";
import { parkingRepository } from "../parking/parking.repository.js";
import { findRecommendation } from "../recommendation/recommendation.store.js";
import { reservationRepository } from "./booking.repository.js";

export interface CreateReservationInput {
  recommendationId: string;
  driverId: string;
  vehicleId: string;
  startsAt: string;
  endsAt: string;
  assignParkingBay: boolean;
  paymentRequired: boolean;
}

export async function createReservation(input: CreateReservationInput) {
  const recommendation = findRecommendation(input.recommendationId);
  if (!recommendation) {
    throw new AppError(
      "The recommendation does not exist or is no longer available in this demo process.",
      404,
      "RECOMMENDATION_NOT_FOUND",
    );
  }
  if (
    recommendation.status !== "READY"
    || !recommendation.recommendedRouteId
    || !recommendation.recommendedStationId
    || !recommendation.recommendedChargerId
  ) {
    throw new AppError(
      "Only a READY recommendation with an eligible charger can be reserved.",
      409,
      "RECOMMENDATION_NOT_RESERVABLE",
    );
  }

  const vehicle = await evRepository.findById(input.vehicleId);
  if (!vehicle) {
    throw new AppError("The selected EV profile does not exist.", 404, "EV_VEHICLE_NOT_FOUND");
  }

  if (
    reservationRepository.hasChargerConflict(
      recommendation.recommendedChargerId,
      input.startsAt,
      input.endsAt,
    )
  ) {
    throw new AppError(
      "The recommended charger is already reserved during that time window.",
      409,
      "RESERVATION_CONFLICT",
    );
  }

  const parkingBay = input.assignParkingBay
    ? parkingRepository
        .list(recommendation.recommendedStationId)
        .find(
          (bay) =>
            bay.isEvEnabled
            && !isParkingBayOccupied(bay.id)
            && !reservationRepository.hasParkingConflict(bay.id, input.startsAt, input.endsAt),
        ) ?? null
    : null;
  const warnings = [
    "Demo reservation only; it does not reserve capacity on a live charging network.",
    ...(input.assignParkingBay && !parkingBay
      ? ["No conflict-free demo parking bay was available; the charger reservation was kept without a bay."]
      : []),
  ];

  return reservationRepository.create({
    recommendationId: recommendation.recommendationId,
    driverId: input.driverId,
    vehicleId: input.vehicleId,
    routeId: recommendation.recommendedRouteId,
    stationId: recommendation.recommendedStationId,
    chargerId: recommendation.recommendedChargerId,
    parkingBayId: parkingBay?.id ?? null,
    startsAt: input.startsAt,
    endsAt: input.endsAt,
    paymentRequired: input.paymentRequired,
    warnings,
  });
}

export function getReservation(reservationId: string) {
  const reservation = reservationRepository.findById(reservationId);
  if (!reservation) {
    throw new AppError("Reservation not found.", 404, "RESERVATION_NOT_FOUND");
  }
  return reservation;
}

export function listReservations(driverId?: string) {
  return {
    sourceMode: "DEMO" as const,
    isSimulated: true as const,
    reservations: reservationRepository.list(driverId),
  };
}

export function recordReservationOccupancy(
  reservationId: string,
  occupied: boolean,
) {
  const reservation = getReservation(reservationId);
  if (!reservation.parkingBayId) {
    throw new AppError(
      "This reservation has no assigned parking bay.",
      409,
      "PARKING_BAY_NOT_ASSIGNED",
    );
  }
  if (reservation.status !== "CONFIRMED" && reservation.status !== "ACTIVE") {
    throw new AppError(
      "Occupancy can only be recorded for a confirmed or active reservation.",
      409,
      "OCCUPANCY_NOT_ALLOWED",
    );
  }
  const event = recordOccupancyEvent(reservation.id, reservation.parkingBayId, occupied);
  const updatedReservation = occupied
    ? reservationRepository.update(reservation.id, { status: "ACTIVE" })
    : reservationRepository.findById(reservation.id);
  return {
    event,
    reservation: updatedReservation,
    history: listOccupancyEvents(reservation.id),
  };
}

export function resetReservationStore(): void {
  reservationRepository.reset();
}
