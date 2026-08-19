export interface PageMeta { page?: number; limit?: number; total?: number }

export interface Station {
  id: string; name: string; address?: string | null; latitude: number; longitude: number;
  createdAt: string; chargers: Charger[];
}

export interface Charger {
  id: string; stationId: string; connectorType: string; maximumPowerKw: number;
  status: "AVAILABLE" | "OCCUPIED" | "OFFLINE" | "FAULTED";
  station?: { id: string; name: string; operatorId?: string | null };
  telemetry?: Array<{ powerKw: number; temperatureCelsius: number; recordedAt: string }>;
}

export interface TelemetrySnapshot {
  telemetry: { chargerId: string; status: string; powerKw?: number; temperatureCelsius?: number; recordedAt: string; sourceMode: string };
  reliability: { status: string; score: number; grade: string; freshness: string; reasons?: string[] };
  receivedAt: string;
}

export interface TelemetryResponse { source: string; disclaimer: string; chargers: TelemetrySnapshot[] }

export interface Occupancy { occupied: boolean; observedAt: string }

export interface ParkingLocation {
  id: string; name: string; latitude: number; longitude: number; createdAt: string;
  slots: ParkingBay[];
}

export interface ParkingBay {
  id: string; locationId: string; label: string; isEvEnabled: boolean;
  location?: { id: string; name: string; operatorId?: string | null };
  device?: IoTDevice | null; occupancies?: Occupancy[]; bookings?: Array<{ id: string; status: string; startsAt: string; endsAt: string }>;
}

export interface Booking {
  id: string; userId: string; parkingSlotId: string; startsAt: string; endsAt: string; status: string;
  parkingSlot: ParkingBay & { location: { id: string; name: string } };
  payment?: { id: string; amount: number; currency: string; status: string } | null;
  user?: { id: string; name: string; email: string };
}

export interface ChargingSession {
  id: string; userId: string; chargerId: string; startedAt: string; endedAt?: string | null;
  energyKwh?: number | null; cost?: number | null;
  charger: Charger & { station: { id: string; name: string } };
  user?: { id: string; name: string };
}

export interface IoTDevice {
  id: string; externalId: string; parkingSlotId?: string | null; lastSeenAt?: string | null;
  parkingSlot?: ParkingBay & { location: { id: string; name: string } };
}

export interface OperatorAnalytics {
  scope: string; stationsManaged: number; chargersManaged: number; chargingSessions: number;
  locationsManaged: number; baysManaged: number; parkingReservations: number; devicesManaged: number;
  chargingRevenue: number; parkingRevenue: number; energyDeliveredKwh: number;
}

export interface OperatorNotification { id: string; title: string; body: string; readAt?: string | null; createdAt: string }
export interface OperatorProfile { id: string; email: string; name: string; phone?: string | null; role: string; isActive?: boolean; createdAt?: string }
