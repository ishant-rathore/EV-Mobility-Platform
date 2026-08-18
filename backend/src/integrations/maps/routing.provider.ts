import type { Coordinates } from "../../shared/geo.js";

export interface RouteOption {
  id: string;
  distanceKm: number;
  durationMinutes: number;
  geometry: Coordinates[];
}

export interface RoutingProvider {
  findRoutes(origin: Coordinates, destination: Coordinates): Promise<RouteOption[]>;
}
