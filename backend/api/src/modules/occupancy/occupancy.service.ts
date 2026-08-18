import type { OccupancyEventRecord } from "./occupancy.types.js";

const occupiedByBay = new Map<string, boolean>();
const events: OccupancyEventRecord[] = [];

export function isParkingBayOccupied(parkingBayId: string): boolean {
  return occupiedByBay.get(parkingBayId) ?? false;
}

export function recordOccupancyEvent(
  reservationId: string,
  parkingBayId: string,
  occupied: boolean,
  occurredAt: string = new Date().toISOString(),
): OccupancyEventRecord {
  occupiedByBay.set(parkingBayId, occupied);
  const event: OccupancyEventRecord = {
    id: crypto.randomUUID(),
    reservationId,
    parkingBayId,
    occupied,
    occurredAt,
    sourceMode: "SIMULATOR",
    isSimulated: true,
  };
  events.push(event);
  return { ...event };
}

export function listOccupancyEvents(reservationId: string): OccupancyEventRecord[] {
  return events.filter((event) => event.reservationId === reservationId).map((event) => ({ ...event }));
}

export function resetOccupancyStore(): void {
  occupiedByBay.clear();
  events.length = 0;
}
