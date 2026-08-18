import type { Coordinates } from "../../shared/geo.js";

export interface RouteOption {
  id: string;
  name?: string;
  distanceKm: number;
  durationMinutes: number;
  trafficFactor?: number;
  /** Module 3 corridor identifier when this provider can supply a stable mapping. */
  trafficRouteId?: string;
  chargerCandidateIds?: string[];
  geometry: Coordinates[];
}

export interface RoutingProvider {
  findRoutes(origin: Coordinates, destination: Coordinates): Promise<RouteOption[]>;
}
