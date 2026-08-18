import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { EvaluatedRoute, RouteLocation } from "../../types/journey";

interface RouteAlternativesMapProps {
  routes: EvaluatedRoute[];
  origin: RouteLocation;
  destination: RouteLocation;
}

const ROUTE_COLORS = ["#5ee7a5", "#60a5fa", "#f59e0b", "#f472b6"];

export function RouteAlternativesMap({
  routes,
  origin,
  destination,
}: RouteAlternativesMapProps) {
  const bounds: LatLngBoundsExpression = routes.flatMap((route) =>
    route.geometry.map(
      (point): [number, number] => [point.latitude, point.longitude],
    ),
  );

  if (bounds.length === 0) {
    return null;
  }

  return (
    <div
      aria-label="Map of evaluated route alternatives"
      className="mt-8 overflow-hidden rounded-2xl border border-white/10"
    >
      <MapContainer
        bounds={bounds}
        boundsOptions={{ padding: [28, 28] }}
        className="h-[360px] w-full"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {routes.map((route, index) => {
          const positions: LatLngExpression[] = route.geometry.map((point) => [
            point.latitude,
            point.longitude,
          ]);
          return (
            <Polyline
              key={route.routeId}
              pathOptions={{ color: ROUTE_COLORS[index % ROUTE_COLORS.length], weight: 5 }}
              positions={positions}
            >
              <Popup>
                {route.name}: {route.distanceKm} km, estimated {route.estimatedEnergyKwh} kWh
              </Popup>
            </Polyline>
          );
        })}
        <CircleMarker center={[origin.latitude, origin.longitude]} pathOptions={{ color: "#22c55e" }}>
          <Popup>Origin: {origin.label ?? "Selected origin"}</Popup>
        </CircleMarker>
        <CircleMarker
          center={[destination.latitude, destination.longitude]}
          pathOptions={{ color: "#ef4444" }}
        >
          <Popup>Destination: {destination.label ?? "Selected destination"}</Popup>
        </CircleMarker>
      </MapContainer>
    </div>
  );
}
