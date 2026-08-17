/**
 * Shared TypeScript types used across modules.
 * Prisma-generated types are the source of truth for DB models.
 * This file holds API-layer and business-logic types.
 */

// ─── Coordinates ─────────────────────────────────────────

export interface LatLng {
  lat: number;
  lng: number;
}

// ─── Journey Planning ────────────────────────────────────

export interface JourneyPlanRequest {
  origin: LatLng;
  destination: LatLng;
  socPercent: number;
  vehicleProfileId: string;
}

export interface EnergyEstimate {
  distanceKm: number;
  estimatedEnergyKWh: number;
  arrivalSocPercent: number;
  chargingRequired: boolean;
  assumptions: string[];
}

// ─── Station Ranking ─────────────────────────────────────

export interface StationScore {
  stationId: string;
  score: number;
  reasons: string[];
  factors: {
    availability: number;
    cost: number;
    wait: number;
    detour: number;
    power: number;
  };
  labels: string[]; // e.g. "Best Overall", "Cheapest", "Fastest"
}

// ─── MQTT ────────────────────────────────────────────────

export interface MqttCommand {
  commandId: string;
  action: 'UNLOCK' | 'LOCK';
  reservationId: string;
  expiresAt: string;
}

export interface MqttStatus {
  deviceId: string;
  bayId: string;
  locked: boolean;
  occupied: boolean;
  timestamp: string;
}

export interface MqttHeartbeat {
  deviceId: string;
  uptime: number;
  freeHeap: number;
  timestamp: string;
}

// ─── API Response ────────────────────────────────────────

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
