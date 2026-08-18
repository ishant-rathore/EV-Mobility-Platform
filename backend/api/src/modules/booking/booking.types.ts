export type ReservationStatus =
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED";

export type DemoPaymentStatus = "NOT_REQUIRED" | "PENDING" | "APPROVED" | "DECLINED";

export interface ReservationRecord {
  id: string;
  recommendationId: string;
  driverId: string;
  vehicleId: string;
  routeId: string;
  stationId: string;
  chargerId: string;
  parkingBayId: string | null;
  startsAt: string;
  endsAt: string;
  status: ReservationStatus;
  paymentRequired: boolean;
  paymentStatus: DemoPaymentStatus;
  sourceMode: "DEMO";
  isSimulated: true;
  warnings: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationRecordInput {
  recommendationId: string;
  driverId: string;
  vehicleId: string;
  routeId: string;
  stationId: string;
  chargerId: string;
  parkingBayId: string | null;
  startsAt: string;
  endsAt: string;
  paymentRequired: boolean;
  warnings: string[];
}
