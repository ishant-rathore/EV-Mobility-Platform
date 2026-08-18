import { haversineDistanceKm, type Coordinates } from "./routeGraph.js";

export interface RouteSegmentEstimate {
  segmentIndex: number;
  start: Coordinates;
  end: Coordinates;
  distanceKm: number;
  estimatedEnergyKwh: number;
}

export function estimateRouteSegments(
  geometry: Coordinates[],
  routeDistanceKm: number,
  routeEnergyKwh: number,
): RouteSegmentEstimate[] {
  const segments = geometry.slice(1).flatMap((end, index) => {
    const start = geometry[index];
    return start ? [{ start, end, distanceKm: haversineDistanceKm(start, end) }] : [];
  });
  const geometryDistanceKm = segments.reduce((total, segment) => total + segment.distanceKm, 0);

  return segments.map((segment, segmentIndex) => {
    const distanceShare =
      geometryDistanceKm > 0 ? segment.distanceKm / geometryDistanceKm : 1 / segments.length;
    return {
      segmentIndex,
      start: segment.start,
      end: segment.end,
      distanceKm: Number((routeDistanceKm * distanceShare).toFixed(2)),
      estimatedEnergyKwh: Number((routeEnergyKwh * distanceShare).toFixed(2)),
    };
  });
}
