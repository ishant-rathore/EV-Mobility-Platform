import type { CanonicalTelemetryStatus } from "@ev-mobility/shared-types";
import type { OperatorDashboardData, OperatorMetrics } from "../types/operator";

const OVERLOAD_THRESHOLD_PERCENT = 85;

export function normalizeOperatorStatus(status: string): CanonicalTelemetryStatus {
  if (status === "CONNECTED" || status === "OCCUPIED") return "CONNECTED_NOT_CHARGING";
  if (status === "FAULTED") return "FAULT";
  if (
    status === "AVAILABLE"
    || status === "CONNECTED_NOT_CHARGING"
    || status === "CHARGING"
    || status === "FAULT"
    || status === "OFFLINE"
  ) return status;
  return "OFFLINE";
}

export function congestionLevel(load: number, capacity: number) {
  const percent = capacity > 0 ? (load / capacity) * 100 : 100;
  if (percent >= 90) return "SEVERE" as const;
  if (percent >= 75) return "HIGH" as const;
  if (percent >= 50) return "MEDIUM" as const;
  return "LOW" as const;
}

export function deriveOperatorMetrics(data: OperatorDashboardData): OperatorMetrics {
  const statuses = new Map<string, CanonicalTelemetryStatus>();
  for (const station of data.stations) {
    for (const charger of station.chargers ?? []) {
      statuses.set(charger.id, normalizeOperatorStatus(charger.status));
    }
  }
  for (const snapshot of data.telemetry) {
    statuses.set(snapshot.telemetry.chargerId, snapshot.reliability.status);
  }

  const allStatuses = [...statuses.values()];
  return {
    routeCount: data.routes.length,
    overloadedRouteCount: data.routes.filter(
      (route) => route.totalCapacity <= 0
        || (route.totalPredictedLoad / route.totalCapacity) * 100 >= OVERLOAD_THRESHOLD_PERCENT,
    ).length,
    stationCount: data.stations.length,
    chargerCount: statuses.size,
    availableChargerCount: allStatuses.filter((status) => status === "AVAILABLE").length,
    chargingChargerCount: allStatuses.filter((status) => status === "CHARGING").length,
    faultedChargerCount: allStatuses.filter((status) => status === "FAULT").length,
    offlineChargerCount: allStatuses.filter((status) => status === "OFFLINE").length,
    activeSessionCount: data.reservations.filter((reservation) => reservation.status === "ACTIVE").length,
    confirmedReservationCount: data.reservations.filter(
      (reservation) => reservation.status === "CONFIRMED",
    ).length,
    statuses,
  };
}
