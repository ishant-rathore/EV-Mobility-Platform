import { haversineDistanceKm, type Coordinates } from "../../shared/geo.js";
import type { RouteOption, RoutingProvider } from "./routing.provider.js";

export class DemoRoutingProvider implements RoutingProvider {
  async findRoutes(origin: Coordinates, destination: Coordinates): Promise<RouteOption[]> {
    const directDistance = Math.max(5, haversineDistanceKm(origin, destination));
    const latitudeDelta = destination.latitude - origin.latitude;
    const longitudeDelta = destination.longitude - origin.longitude;
    const midpoint = (offset: number): Coordinates => ({
      latitude: origin.latitude + latitudeDelta / 2 + longitudeDelta * offset,
      longitude: origin.longitude + longitudeDelta / 2 - latitudeDelta * offset,
    });

    return [
      {
        id: "demo-fastest",
        name: "Western Express",
        distanceKm: Number((directDistance * 1.18).toFixed(1)),
        durationMinutes: Math.ceil(((directDistance * 1.18) / 52) * 60),
        trafficFactor: 1.32,
        trafficRouteId: "route-north",
        chargerCandidateIds: ["station-demo-1", "station-demo-2"],
        geometry: [origin, midpoint(0.12), destination],
      },
      {
        id: "demo-diversified",
        name: "Eastern Bypass",
        distanceKm: Number((directDistance * 1.27).toFixed(1)),
        durationMinutes: Math.ceil(((directDistance * 1.27) / 58) * 60),
        trafficFactor: 1.08,
        trafficRouteId: "route-east",
        chargerCandidateIds: ["station-demo-2", "station-demo-1"],
        geometry: [origin, midpoint(-0.16), destination],
      },
      {
        id: "demo-city",
        name: "City Connector",
        distanceKm: Number((directDistance * 1.12).toFixed(1)),
        durationMinutes: Math.ceil(((directDistance * 1.12) / 38) * 60),
        trafficFactor: 1.55,
        trafficRouteId: "route-central",
        chargerCandidateIds: ["station-demo-1"],
        geometry: [origin, midpoint(0.04), destination],
      },
    ];
  }
}
