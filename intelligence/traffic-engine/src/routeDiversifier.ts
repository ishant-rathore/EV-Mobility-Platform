import { summarizeRouteTraffic, type TrafficRoute } from "./trafficPredictor.js";

export interface DiversificationWeights {
  time: number;
  congestion: number;
  energy: number;
  capacityRisk: number;
}

export interface DiversificationConfig {
  capacityThreshold: number;
  overloadPenalty: number;
  weights: DiversificationWeights;
}

export interface DiversificationRouteInput {
  routeId: string;
  trafficRouteId: string;
  name: string;
  durationMinutes: number;
  energyKwh: number;
  currentLoad: number;
  predictedLoad: number;
  capacity: number;
  vehicleEligibility: string[];
  sourceMode: "DEMO" | "REAL";
}

export interface DiversificationScoreBreakdown {
  time: number;
  congestion: number;
  energy: number;
  capacityRisk: number;
  overloadPenalty: number;
  total: number;
}

export interface DiversificationCandidate extends DiversificationRouteInput {
  eligible: boolean;
  exclusionReason: string | null;
  rank: number | null;
  projectedLoadBefore: number;
  projectedLoadIfAssigned: number;
  projectedUtilizationPercent: number;
  capacityThresholdExceeded: boolean;
  score: number | null;
  scoreBreakdown: DiversificationScoreBreakdown | null;
}

export interface DiversificationDecision {
  advisory: true;
  sourceMode: "DEMO" | "REAL";
  simulationId: string;
  vehicleClass: string;
  demandUnits: number;
  capacityThresholdPercent: number;
  recommendedRouteId: string | null;
  recommendedTrafficRouteId: string | null;
  explanation: string;
  candidates: DiversificationCandidate[];
}

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

export interface DiversificationSimulationResult {
  advisory: true;
  sourceMode: "DEMO";
  requestCount: number;
  demandUnitsPerRequest: number;
  capacityThresholdPercent: number;
  assignments: Array<{
    requestNumber: number;
    vehicleClass: string;
    baselineRouteId: string | null;
    diversifiedRouteId: string | null;
  }>;
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

export const DEFAULT_DIVERSIFICATION_CONFIG: DiversificationConfig = {
  capacityThreshold: 0.85,
  overloadPenalty: 100,
  weights: {
    time: 35,
    congestion: 25,
    energy: 20,
    capacityRisk: 20,
  },
};

function round(value: number, decimals = 2): number {
  return Number(value.toFixed(decimals));
}

function normalizeClass(vehicleClass: string): string {
  return vehicleClass.trim().toUpperCase();
}

function scoreCandidate(
  route: DiversificationRouteInput,
  projectedLoadBefore: number,
  demandUnits: number,
  minimumDuration: number,
  minimumEnergy: number,
  config: DiversificationConfig,
): Pick<
  DiversificationCandidate,
  | "projectedLoadBefore"
  | "projectedLoadIfAssigned"
  | "projectedUtilizationPercent"
  | "capacityThresholdExceeded"
  | "score"
  | "scoreBreakdown"
> {
  const projectedLoadIfAssigned = projectedLoadBefore + demandUnits;
  const utilization = projectedLoadIfAssigned / route.capacity;
  const thresholdExceeded = utilization >= config.capacityThreshold;
  const overloadAmount = Math.max(0, utilization - config.capacityThreshold);

  const breakdown: DiversificationScoreBreakdown = {
    time: (route.durationMinutes / minimumDuration) * config.weights.time,
    congestion: utilization * config.weights.congestion,
    energy: (route.energyKwh / minimumEnergy) * config.weights.energy,
    capacityRisk: utilization ** 3 * config.weights.capacityRisk,
    overloadPenalty:
      thresholdExceeded ? config.overloadPenalty + overloadAmount * config.overloadPenalty * 4 : 0,
    total: 0,
  };
  breakdown.total =
    breakdown.time +
    breakdown.congestion +
    breakdown.energy +
    breakdown.capacityRisk +
    breakdown.overloadPenalty;

  return {
    projectedLoadBefore: round(projectedLoadBefore),
    projectedLoadIfAssigned: round(projectedLoadIfAssigned),
    projectedUtilizationPercent: round(utilization * 100, 1),
    capacityThresholdExceeded: thresholdExceeded,
    score: round(breakdown.total),
    scoreBreakdown: {
      time: round(breakdown.time),
      congestion: round(breakdown.congestion),
      energy: round(breakdown.energy),
      capacityRisk: round(breakdown.capacityRisk),
      overloadPenalty: round(breakdown.overloadPenalty),
      total: round(breakdown.total),
    },
  };
}

export function rankDiversificationRoutes(input: {
  routes: DiversificationRouteInput[];
  vehicleClass: string;
  projectedDemand?: ReadonlyMap<string, number>;
  demandUnits?: number;
  simulationId?: string;
  config?: DiversificationConfig;
}): DiversificationDecision {
  const config = input.config ?? DEFAULT_DIVERSIFICATION_CONFIG;
  const demandUnits = input.demandUnits ?? 1;
  const vehicleClass = normalizeClass(input.vehicleClass);
  const eligibleInputs = input.routes.filter((route) =>
    route.vehicleEligibility.map(normalizeClass).includes(vehicleClass),
  );
  const minimumDuration =
    eligibleInputs.length > 0
      ? Math.min(...eligibleInputs.map((route) => route.durationMinutes))
      : 1;
  const minimumEnergy =
    eligibleInputs.length > 0 ? Math.min(...eligibleInputs.map((route) => route.energyKwh)) : 0.01;

  const candidates = input.routes.map<DiversificationCandidate>((route) => {
    const eligible = route.vehicleEligibility.map(normalizeClass).includes(vehicleClass);
    const projectedLoadBefore =
      route.predictedLoad + (input.projectedDemand?.get(route.trafficRouteId) ?? 0);

    if (!eligible) {
      return {
        ...route,
        eligible: false,
        exclusionReason: `${vehicleClass} is not eligible for this corridor.`,
        rank: null,
        projectedLoadBefore: round(projectedLoadBefore),
        projectedLoadIfAssigned: round(projectedLoadBefore),
        projectedUtilizationPercent: round((projectedLoadBefore / route.capacity) * 100, 1),
        capacityThresholdExceeded:
          projectedLoadBefore / route.capacity >= config.capacityThreshold,
        score: null,
        scoreBreakdown: null,
      };
    }

    return {
      ...route,
      eligible: true,
      exclusionReason: null,
      rank: null,
      ...scoreCandidate(
        route,
        projectedLoadBefore,
        demandUnits,
        minimumDuration,
        minimumEnergy,
        config,
      ),
    };
  });

  const rankedEligible = candidates
    .filter((candidate) => candidate.eligible)
    .sort((left, right) =>
      (left.score ?? Number.POSITIVE_INFINITY) - (right.score ?? Number.POSITIVE_INFINITY) ||
      left.routeId.localeCompare(right.routeId),
    )
    .map((candidate, index) => ({ ...candidate, rank: index + 1 }));
  const rankByRoute = new Map(rankedEligible.map((candidate) => [candidate.routeId, candidate]));
  const rankedCandidates = candidates
    .map((candidate) => rankByRoute.get(candidate.routeId) ?? candidate)
    .sort((left, right) => {
      if (left.rank === null) return 1;
      if (right.rank === null) return -1;
      return left.rank - right.rank;
    });
  const recommended = rankedCandidates.find((candidate) => candidate.rank === 1);

  return {
    advisory: true,
    sourceMode: input.routes.some((route) => route.sourceMode === "REAL") ? "REAL" : "DEMO",
    simulationId: input.simulationId ?? "stateless",
    vehicleClass,
    demandUnits,
    capacityThresholdPercent: config.capacityThreshold * 100,
    recommendedRouteId: recommended?.routeId ?? null,
    recommendedTrafficRouteId: recommended?.trafficRouteId ?? null,
    explanation: recommended
      ? `${recommended.name} is the lowest combined time, congestion, energy, and capacity-risk score for ${vehicleClass}. This is an advisory recommendation only.`
      : `No legally eligible route is available for ${vehicleClass}.`,
    candidates: rankedCandidates,
  };
}

export class TrafficDiversificationEngine {
  private readonly demandBySimulation = new Map<string, Map<string, number>>();

  assign(input: {
    routes: DiversificationRouteInput[];
    vehicleClass: string;
    simulationId: string;
    demandUnits?: number;
    config?: DiversificationConfig;
  }): DiversificationDecision {
    const state = this.demandBySimulation.get(input.simulationId) ?? new Map<string, number>();
    const decision = rankDiversificationRoutes({ ...input, projectedDemand: state });

    if (decision.recommendedTrafficRouteId) {
      state.set(
        decision.recommendedTrafficRouteId,
        (state.get(decision.recommendedTrafficRouteId) ?? 0) + decision.demandUnits,
      );
      this.demandBySimulation.set(input.simulationId, state);
    }

    return decision;
  }

  getProjectedDemand(simulationId: string): ReadonlyMap<string, number> {
    return new Map(this.demandBySimulation.get(simulationId) ?? []);
  }

  reset(simulationId?: string): void {
    if (simulationId) {
      this.demandBySimulation.delete(simulationId);
      return;
    }
    this.demandBySimulation.clear();
  }
}

/** Shared in-process projection state used by journey evaluation and reset APIs. */
export const trafficDiversificationEngine = new TrafficDiversificationEngine();

export function toDiversificationRouteInputs(routes: TrafficRoute[]): DiversificationRouteInput[] {
  return routes.map((route) => {
    const traffic = summarizeRouteTraffic(route, "PREDICTED");
    return {
      routeId: route.routeId,
      trafficRouteId: route.routeId,
      name: route.name,
      durationMinutes: round((route.distanceKm / 45) * 60 * traffic.travelTimeMultiplier),
      energyKwh: round(route.distanceKm * 0.18 * traffic.travelTimeMultiplier),
      currentLoad: route.totalCurrentLoad,
      predictedLoad: route.totalPredictedLoad,
      capacity: route.totalCapacity,
      vehicleEligibility: route.vehicleEligibility,
      sourceMode: "DEMO",
    };
  });
}

function summarizeSimulationLoads(
  routes: DiversificationRouteInput[],
  addedDemand: ReadonlyMap<string, number>,
  assignments: ReadonlyMap<string, number>,
  config: DiversificationConfig,
) {
  const routeLoads = routes.map<SimulationRouteLoad>((route) => {
    const finalProjectedLoad = route.predictedLoad + (addedDemand.get(route.trafficRouteId) ?? 0);
    const utilization = finalProjectedLoad / route.capacity;
    return {
      routeId: route.routeId,
      name: route.name,
      capacity: route.capacity,
      initialPredictedLoad: route.predictedLoad,
      finalProjectedLoad: round(finalProjectedLoad),
      finalUtilizationPercent: round(utilization * 100, 1),
      assignments: assignments.get(route.routeId) ?? 0,
      capacityThresholdExceeded: utilization >= config.capacityThreshold,
    };
  });

  return {
    routes: routeLoads,
    overloadedRoutes: routeLoads.filter((route) => route.capacityThresholdExceeded).length,
    maximumUtilizationPercent: Math.max(
      ...routeLoads.map((route) => route.finalUtilizationPercent),
      0,
    ),
  };
}

export function simulateDiversification(input: {
  routes: DiversificationRouteInput[];
  vehicleClasses: string[];
  requestCount: number;
  demandUnitsPerRequest: number;
  config?: DiversificationConfig;
}): DiversificationSimulationResult {
  const config = input.config ?? DEFAULT_DIVERSIFICATION_CONFIG;
  const engine = new TrafficDiversificationEngine();
  const baselineDemand = new Map<string, number>();
  const baselineAssignments = new Map<string, number>();
  const diversifiedAssignments = new Map<string, number>();
  const assignments: DiversificationSimulationResult["assignments"] = [];

  for (let index = 0; index < input.requestCount; index += 1) {
    const vehicleClass = normalizeClass(
      input.vehicleClasses[index % input.vehicleClasses.length] ?? "CAR",
    );
    const eligible = input.routes.filter((route) =>
      route.vehicleEligibility.map(normalizeClass).includes(vehicleClass),
    );
    const baselineRoute = eligible
      .slice()
      .sort(
        (left, right) =>
          left.durationMinutes - right.durationMinutes || left.routeId.localeCompare(right.routeId),
      )[0];
    if (baselineRoute) {
      baselineDemand.set(
        baselineRoute.trafficRouteId,
        (baselineDemand.get(baselineRoute.trafficRouteId) ?? 0) + input.demandUnitsPerRequest,
      );
      baselineAssignments.set(
        baselineRoute.routeId,
        (baselineAssignments.get(baselineRoute.routeId) ?? 0) + 1,
      );
    }

    const diversified = engine.assign({
      routes: input.routes,
      vehicleClass,
      simulationId: "batch-simulation",
      demandUnits: input.demandUnitsPerRequest,
      config,
    });
    if (diversified.recommendedRouteId) {
      diversifiedAssignments.set(
        diversified.recommendedRouteId,
        (diversifiedAssignments.get(diversified.recommendedRouteId) ?? 0) + 1,
      );
    }
    assignments.push({
      requestNumber: index + 1,
      vehicleClass,
      baselineRouteId: baselineRoute?.routeId ?? null,
      diversifiedRouteId: diversified.recommendedRouteId,
    });
  }

  const baseline = summarizeSimulationLoads(
    input.routes,
    baselineDemand,
    baselineAssignments,
    config,
  );
  const diversified = summarizeSimulationLoads(
    input.routes,
    engine.getProjectedDemand("batch-simulation"),
    diversifiedAssignments,
    config,
  );

  return {
    advisory: true,
    sourceMode: "DEMO",
    requestCount: input.requestCount,
    demandUnitsPerRequest: input.demandUnitsPerRequest,
    capacityThresholdPercent: config.capacityThreshold * 100,
    assignments,
    baseline,
    diversified,
    explanation:
      "Baseline sends every eligible request to the shortest-time route; diversification recalculates time, congestion, energy, and capacity risk after every advisory assignment.",
  };
}

/** Backward-compatible stateless helper used by the original traffic API. */
export function diversifyRoutes(
  routes: TrafficRoute[],
  vehicleClass: string,
  projectedRequests = 0,
): DiversificationCandidate[] {
  const routeInputs = toDiversificationRouteInputs(routes);
  const projectedDemand = new Map(
    routeInputs.map((route) => [route.trafficRouteId, projectedRequests]),
  );
  return rankDiversificationRoutes({
    routes: routeInputs,
    vehicleClass,
    projectedDemand,
  }).candidates;
}

export function getDiversificationExplanation(
  originalRoutes: DiversificationCandidate[],
  diversifiedRoutes: DiversificationCandidate[],
  vehicleClass: string,
): string {
  const originalTop = originalRoutes.find((route) => route.eligible);
  const diversifiedTop = diversifiedRoutes.find((route) => route.rank === 1);
  if (!originalTop || !diversifiedTop) {
    return `No eligible routes for vehicle class ${normalizeClass(vehicleClass)}.`;
  }
  if (originalTop.routeId === diversifiedTop.routeId) {
    return `${originalTop.name} remains the lowest combined-cost advisory route.`;
  }
  return `${normalizeClass(vehicleClass)} is shifted from ${originalTop.name} to ${diversifiedTop.name} to reduce projected capacity risk.`;
}
