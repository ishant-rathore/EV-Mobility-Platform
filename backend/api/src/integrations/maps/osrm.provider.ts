import type { Coordinates } from "../../shared/geo.js";
import type { RouteOption, RoutingProvider } from "./routing.provider.js";

export class OsrmRoutingProvider implements RoutingProvider {
  constructor(private readonly baseUrl = "https://router.project-osrm.org") {}

  async findRoutes(origin: Coordinates, destination: Coordinates): Promise<RouteOption[]> {
    const coordinates = `${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}`;
    const response = await fetch(
      `${this.baseUrl}/route/v1/driving/${coordinates}?alternatives=3&overview=full&geometries=geojson`,
      { signal: AbortSignal.timeout(5_000) },
    );
    if (!response.ok) {
      throw new Error(`OSRM request failed with status ${response.status}`);
    }

    const body = (await response.json()) as {
      routes: Array<{
        distance: number;
        duration: number;
        geometry?: { coordinates: Array<[number, number]> };
      }>;
    };
    return body.routes.map((route, index) => ({
      id: `osrm-${index + 1}`,
      name: `OSRM Alternative ${index + 1}`,
      distanceKm: Number((route.distance / 1000).toFixed(1)),
      durationMinutes: Math.ceil(route.duration / 60),
      trafficFactor: 1,
      geometry:
        route.geometry?.coordinates.map(([longitude, latitude]) => ({ latitude, longitude })) ??
        [origin, destination],
    }));
  }
}
