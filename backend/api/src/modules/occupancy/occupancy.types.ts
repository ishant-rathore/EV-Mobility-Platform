export interface OccupancyEventRecord {
  id: string;
  reservationId: string;
  parkingBayId: string;
  occupied: boolean;
  occurredAt: string;
  sourceMode: "SIMULATOR";
  isSimulated: true;
}
