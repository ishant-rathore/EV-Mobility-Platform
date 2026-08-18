import { haversineDistanceKm, type Coordinates } from "../../shared/geo.js";
import type { RouteOption, RoutingProvider } from "./routing.provider.js";

export class DemoRoutingProvider implements RoutingProvider {
  async findRoutes(origin: Coordinates, destination: Coordinates): Promise<RouteOption[]> {
    const directDistance = haversineDistanceKm(origin, destination);
    return [
      {
        id: "demo-fastest",
        distanceKm: Number((directDistance * 1.18).toFixed(1)),
        durationMinutes: Math.ceil((directDistance / 45) * 60),
        geometry: [origin, destination],
      },
      {
        id: "demo-diversified",
        distanceKm: Number((directDistance * 1.27).toFixed(1)),
        durationMinutes: Math.ceil((directDistance / 50) * 60),
        geometry: [origin, destination],
      },
    ];
  }
}
