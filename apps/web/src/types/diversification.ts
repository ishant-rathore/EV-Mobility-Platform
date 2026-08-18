export interface SimulationRouteLoad {
  routeId: string;
  name: string;
  capacity: number;
  initialPredictedLoad: number;
  finalProjectedLoad: number;
  finalUtilizationPercent: number;
  assignments: number;
  capacityThresholdExceeded: boolean;
}

export interface DiversificationSimulation {
  advisory: true;
  sourceMode: "DEMO";
  requestCount: number;
  demandUnitsPerRequest: number;
  capacityThresholdPercent: number;
  baseline: {
    routes: SimulationRouteLoad[];
    overloadedRoutes: number;
    maximumUtilizationPercent: number;
  };
  diversified: {
    routes: SimulationRouteLoad[];
    overloadedRoutes: number;
    maximumUtilizationPercent: number;
  };
  explanation: string;
}
