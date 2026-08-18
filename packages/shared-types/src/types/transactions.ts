export type ReservationStatus =
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED";

export interface DemoReservation {
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
  paymentStatus: "NOT_REQUIRED" | "PENDING" | "APPROVED" | "DECLINED";
  sourceMode: "DEMO";
  isSimulated: true;
  warnings: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DemoParkingBay {
  id: string;
  stationId: string;
  label: string;
  isEvEnabled: boolean;
  deviceId: string | null;
  sourceMode: "DEMO";
  isSimulated: true;
}

export interface DemoPayment {
  id: string;
  reservationId: string;
  idempotencyKey: string;
  amount: number;
  currency: "INR";
  status: "APPROVED" | "DECLINED";
  provider: "DEMO_PAYMENT";
  providerReference: string;
  sourceMode: "DEMO";
  isSimulated: true;
  createdAt: string;
  disclaimer: string;
}

export interface DemoAccessCommand {
  id: string;
  reservationId: string;
  parkingBayId: string;
  deviceId: string;
  command: "UNLOCK_DEMO_FLAP";
  status: "ACKNOWLEDGED";
  issuedAt: string;
  sourceMode: "SIMULATOR";
  isSimulated: true;
  disclaimer: string;
}

export interface DemoOccupancyEvent {
  id: string;
  reservationId: string;
  parkingBayId: string;
  occupied: boolean;
  occurredAt: string;
  sourceMode: "SIMULATOR";
  isSimulated: true;
}
