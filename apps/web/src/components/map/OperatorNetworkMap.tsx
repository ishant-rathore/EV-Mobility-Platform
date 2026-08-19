import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { ChargerTelemetrySnapshot } from "@ev-mobility/shared-types";
import type { OperatorStation, OperatorTrafficRoute } from "../../types/operator";
import { congestionLevel, normalizeOperatorStatus } from "../../utils/operator.metrics";

type MapPosition = [number, number];

const ROUTE_POSITIONS: Record<string, MapPosition[]> = {
  "route-north": [[19.018, 72.84], [19.076, 72.878], [19.158, 72.89]],
  "route-central": [[19.018, 72.84], [19.061, 72.855], [19.114, 72.87]],
  "route-south": [[19.018, 72.84], [19.035, 72.91], [19.082, 72.96]],
  "route-east": [[19.018, 72.84], [19.076, 72.878], [19.112, 72.93]],
};

const TRAFFIC_COLORS = {
  LOW: "#22c55e",
  MEDIUM: "#06b6d4",
  HIGH: "#f59e0b",
  SEVERE: "#ef4444",
} as const;

const CHARGER_COLORS = {
  AVAILABLE: "#22c55e",
  CONNECTED_NOT_CHARGING: "#38bdf8",
  CHARGING: "#06b6d4",
  FAULT: "#ef4444",
  OFFLINE: "#64748b",
} as const;

interface OperatorNetworkMapProps {
  routes: OperatorTrafficRoute[];
  stations: OperatorStation[];
  telemetry: ChargerTelemetrySnapshot[];
}

function stationStatus(
  station: OperatorStation,
  liveStatuses: ReadonlyMap<string, ChargerTelemetrySnapshot>,
) {
  const statuses = (station.chargers ?? []).map(
    (charger) => liveStatuses.get(charger.id)?.reliability.status ?? normalizeOperatorStatus(charger.status),
  );
  if (statuses.includes("FAULT")) return "FAULT" as const;
  if (statuses.includes("OFFLINE")) return "OFFLINE" as const;
  if (statuses.includes("CHARGING")) return "CHARGING" as const;
  if (statuses.includes("CONNECTED_NOT_CHARGING")) return "CONNECTED_NOT_CHARGING" as const;
  return "AVAILABLE" as const;
}

export function OperatorNetworkMap({ routes, stations, telemetry }: OperatorNetworkMapProps) {
  const liveStatuses = new Map(
    telemetry.map((snapshot) => [snapshot.telemetry.chargerId, snapshot] as const),
  );
  const routeBounds = routes.flatMap((route) => ROUTE_POSITIONS[route.routeId] ?? []);
  const stationBounds: MapPosition[] = stations.map((station) => [station.latitude, station.longitude]);
  const bounds: MapPosition[] = [...routeBounds, ...stationBounds];

  if (bounds.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10" aria-label="Simulated operator traffic and charger map">
      <MapContainer bounds={bounds} boundsOptions={{ padding: [36, 36] }} className="h-[430px] w-full" scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {routes.map((route) => {
          const positions = ROUTE_POSITIONS[route.routeId];
          if (!positions) return null;
          const level = congestionLevel(route.totalPredictedLoad, route.totalCapacity);
          const predictedPercent = route.totalCapacity > 0
            ? Math.round((route.totalPredictedLoad / route.totalCapacity) * 100)
            : 100;
          return (
            <Polyline key={route.routeId} positions={positions} pathOptions={{ color: TRAFFIC_COLORS[level], weight: 6, opacity: 0.82 }}>
              <Tooltip sticky>{route.name} · {level}</Tooltip>
              <Popup>
                <strong>{route.name}</strong><br />Predicted utilization: {predictedPercent}%<br />DEMO advisory route
              </Popup>
            </Polyline>
          );
        })}
        {stations.map((station) => {
          const status = stationStatus(station, liveStatuses);
          return (
            <CircleMarker
              key={station.id}
              center={[station.latitude, station.longitude]}
              radius={10}
              pathOptions={{ color: "#0b1120", fillColor: CHARGER_COLORS[status], fillOpacity: 0.95, weight: 2 }}
            >
              <Tooltip direction="top">{station.name} · {status}</Tooltip>
              <Popup>
                <strong>{station.name}</strong><br />Status: {status}<br />{station.availableChargers} demo port(s) available
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
      <div className="flex flex-wrap gap-4 bg-slate-950/95 px-4 py-3 text-xs text-slate-300">
        {Object.entries(TRAFFIC_COLORS).map(([label, color]) => (
          <span key={label} className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />{label}</span>
        ))}
        <span className="ml-auto text-amber-200">DEMO routes · status may be SIMULATED</span>
      </div>
    </div>
  );
}
