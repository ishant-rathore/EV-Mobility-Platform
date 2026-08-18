import type {
  CreateReservationRecordInput,
  ReservationRecord,
} from "./booking.types.js";

export interface ReservationRepository {
  create(input: CreateReservationRecordInput): ReservationRecord;
  findById(id: string): ReservationRecord | null;
  list(driverId?: string): ReservationRecord[];
  update(id: string, patch: Partial<Pick<ReservationRecord, "status" | "paymentStatus">>): ReservationRecord | null;
  hasChargerConflict(chargerId: string, startsAt: string, endsAt: string): boolean;
  hasParkingConflict(parkingBayId: string, startsAt: string, endsAt: string): boolean;
  reset(): void;
}

function overlaps(
  leftStart: string,
  leftEnd: string,
  rightStart: string,
  rightEnd: string,
): boolean {
  return new Date(leftStart).getTime() < new Date(rightEnd).getTime()
    && new Date(leftEnd).getTime() > new Date(rightStart).getTime();
}

function blocksInventory(reservation: ReservationRecord): boolean {
  return reservation.status !== "CANCELLED" && reservation.status !== "COMPLETED";
}

export class MemoryReservationRepository implements ReservationRepository {
  private readonly reservations = new Map<string, ReservationRecord>();

  create(input: CreateReservationRecordInput): ReservationRecord {
    const now = new Date().toISOString();
    const reservation: ReservationRecord = {
      ...input,
      id: crypto.randomUUID(),
      status: input.paymentRequired ? "PENDING_PAYMENT" : "CONFIRMED",
      paymentStatus: input.paymentRequired ? "PENDING" : "NOT_REQUIRED",
      sourceMode: "DEMO",
      isSimulated: true,
      createdAt: now,
      updatedAt: now,
    };
    this.reservations.set(reservation.id, reservation);
    return { ...reservation, warnings: [...reservation.warnings] };
  }

  findById(id: string): ReservationRecord | null {
    const reservation = this.reservations.get(id);
    return reservation ? { ...reservation, warnings: [...reservation.warnings] } : null;
  }

  list(driverId?: string): ReservationRecord[] {
    return [...this.reservations.values()]
      .filter((reservation) => !driverId || reservation.driverId === driverId)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
      .map((reservation) => ({ ...reservation, warnings: [...reservation.warnings] }));
  }

  update(
    id: string,
    patch: Partial<Pick<ReservationRecord, "status" | "paymentStatus">>,
  ): ReservationRecord | null {
    const current = this.reservations.get(id);
    if (!current) return null;
    const updated = { ...current, ...patch, updatedAt: new Date().toISOString() };
    this.reservations.set(id, updated);
    return { ...updated, warnings: [...updated.warnings] };
  }

  hasChargerConflict(chargerId: string, startsAt: string, endsAt: string): boolean {
    return [...this.reservations.values()].some(
      (reservation) =>
        blocksInventory(reservation)
        && reservation.chargerId === chargerId
        && overlaps(reservation.startsAt, reservation.endsAt, startsAt, endsAt),
    );
  }

  hasParkingConflict(parkingBayId: string, startsAt: string, endsAt: string): boolean {
    return [...this.reservations.values()].some(
      (reservation) =>
        blocksInventory(reservation)
        && reservation.parkingBayId === parkingBayId
        && overlaps(reservation.startsAt, reservation.endsAt, startsAt, endsAt),
    );
  }

  reset(): void {
    this.reservations.clear();
  }
}

export const reservationRepository: ReservationRepository = new MemoryReservationRepository();
