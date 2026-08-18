import {
  getDemoRoutes as getBaseDemoRoutes,
  summarizeRouteTraffic,
  type RouteTrafficSnapshot,
  type TrafficHorizon,
  type TrafficRoute,
} from "@ev-mobility/traffic-engine";
import { getDemoTrafficLevel } from "../admin/demo-runtime.store.js";

const LOAD_PERCENT_BY_LEVEL = {
  MEDIUM: 60,
  HIGH: 85,
} as const;

function withTrafficOverride(route: TrafficRoute): TrafficRoute {
  const level = getDemoTrafficLevel(route.routeId);
  if (!level) return route;

  const loadPercent = LOAD_PERCENT_BY_LEVEL[level];
  const totalPredictedLoad = Math.round(route.totalCapacity * loadPercent / 100);
  const segmentCapacity = route.segments.reduce((sum, segment) => sum + segment.capacity, 0);
  return {
    ...route,
    totalPredictedLoad,
    segments: route.segments.map((segment) => {
      const share = segmentCapacity > 0 ? segment.capacity / segmentCapacity : 0;
      return {
        ...segment,
        predictedLoad: Math.round(totalPredictedLoad * share),
      };
    }),
  };
}

/** Mutable demo view kept outside the pure intelligence package. */
export function getControlledDemoRoutes(): TrafficRoute[] {
  return getBaseDemoRoutes().map(withTrafficOverride);
}

export function getControlledRouteTrafficSnapshot(
  routeId: string,
  horizon: TrafficHorizon,
  vehicleClass?: string,
): RouteTrafficSnapshot | undefined {
  const route = getControlledDemoRoutes().find((candidate) => candidate.routeId === routeId);
  return route ? summarizeRouteTraffic(route, horizon, vehicleClass) : undefined;
}
