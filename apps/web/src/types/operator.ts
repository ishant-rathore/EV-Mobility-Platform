import type {
  CanonicalTelemetryStatus,
  ChargerTelemetrySnapshot,
  DemoReservation,
} from "@ev-mobility/shared-types";

export interface OperatorTrafficRoute {
  routeId: string;
  name: string;
  distanceKm: number;
  totalCapacity: number;
  totalCurrentLoad: number;
  totalPredictedLoad: number;
  vehicleEligibility: string[];
}

export interface OperatorStationCharger {
  id: string;
  connectorType: string;
  status: string;
  powerKw: number;
  pricePerKwh: number;
}

export interface OperatorStation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  availableChargers: number;
  powerKw: number;
  reliabilityScore: number;
  pricePerKwh: number;
  estimatedWaitMinutes?: number;
  sourceMode?: string;
  isSimulated?: boolean;
  chargers?: OperatorStationCharger[];
}

export interface OperatorStationResponse {
  stations: OperatorStation[];
}

export interface ReservationListResponse {
  sourceMode: "DEMO";
  isSimulated: true;
  reservations: DemoReservation[];
}

export interface OperatorDashboardData {
  routes: OperatorTrafficRoute[];
  stations: OperatorStation[];
  telemetry: ChargerTelemetrySnapshot[];
  reservations: DemoReservation[];
}

export interface OperatorMetrics {
  routeCount: number;
  overloadedRouteCount: number;
  stationCount: number;
  chargerCount: number;
  availableChargerCount: number;
  chargingChargerCount: number;
  faultedChargerCount: number;
  offlineChargerCount: number;
  activeSessionCount: number;
  confirmedReservationCount: number;
  statuses: Map<string, CanonicalTelemetryStatus>;
}
