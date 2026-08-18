import type { TrafficPredictionInput, TrafficRoute, TrafficSegment } from "./traffic.schemas.js";

export type PredictionMethod = "rush-hour" | "rule-based" | "regression" | "historical";
export type TrafficHorizon = "CURRENT" | "PREDICTED";

export interface RouteTrafficSnapshot {
  routeId: string;
  horizon: TrafficHorizon;
  sourceMode: "DEMO" | "REAL";
  currentLoad: number;
  predictedLoad: number;
  capacity: number;
  currentLoadPercent: number;
  predictedLoadPercent: number;
  currentLevel: TrafficPredictionResult["level"];
  predictedLevel: TrafficPredictionResult["level"];
  travelTimeMultiplier: number;
  vehicleEligibility: string[];
  vehicleEligible: boolean;
}

export interface TrafficPredictionResult {
  segmentId: string;
  congestionScore: number;
  travelTimeMultiplier: number;
  level: "LOW" | "MEDIUM" | "HIGH" | "SEVERE";
  predictedLoad: number;
  currentLoad: number;
  capacity: number;
  vehicleEligibility: string[];
  sourceMode: "DEMO" | "REAL";
  predictionMethod: PredictionMethod;
}

const RUSH_HOUR_MORNING_START = 7;
const RUSH_HOUR_MORNING_END = 10;
const RUSH_HOUR_EVENING_START = 17;
const RUSH_HOUR_EVENING_END = 20;

function calculateCongestionScore(input: TrafficPredictionInput): number {
  const speedCongestion = 1 - Math.min(1, input.observedSpeedKph / input.freeFlowSpeedKph);
  const occupancyRatio = input.occupancyPercent / 100;
  return Math.round(Math.max(0, Math.min(100, (speedCongestion * 0.7 + occupancyRatio * 0.3) * 100)));
}

function levelForScore(score: number): TrafficPredictionResult["level"] {
  return score >= 70 ? "SEVERE" : score >= 50 ? "HIGH" : score >= 25 ? "MEDIUM" : "LOW";
}

/** Stable Module 3 handoff consumed by routing and exposed to the UI. */
export function summarizeRouteTraffic(
  route: TrafficRoute,
  horizon: TrafficHorizon,
  vehicleClass?: string,
): RouteTrafficSnapshot {
  const currentLoadPercent = (route.totalCurrentLoad / route.totalCapacity) * 100;
  const predictedLoadPercent = (route.totalPredictedLoad / route.totalCapacity) * 100;
  const selectedLoadPercent = horizon === "PREDICTED" ? predictedLoadPercent : currentLoadPercent;

  return {
    routeId: route.routeId,
    horizon,
    sourceMode: "DEMO",
    currentLoad: route.totalCurrentLoad,
    predictedLoad: route.totalPredictedLoad,
    capacity: route.totalCapacity,
    currentLoadPercent: Number(currentLoadPercent.toFixed(1)),
    predictedLoadPercent: Number(predictedLoadPercent.toFixed(1)),
    currentLevel: levelForScore(currentLoadPercent),
    predictedLevel: levelForScore(predictedLoadPercent),
    travelTimeMultiplier: Number((1 + selectedLoadPercent / 200).toFixed(2)),
    vehicleEligibility: route.vehicleEligibility,
    vehicleEligible: vehicleClass ? route.vehicleEligibility.includes(vehicleClass) : true,
  };
}

export function getRouteTrafficSnapshot(
  routeId: string,
  horizon: TrafficHorizon,
  vehicleClass?: string,
): RouteTrafficSnapshot | undefined {
  const route = getDemoRoutes().find((candidate) => candidate.routeId === routeId);
  return route ? summarizeRouteTraffic(route, horizon, vehicleClass) : undefined;
}

function isRushHour(date: Date = new Date()): boolean {
  const hour = date.getHours();
  return (
    (hour >= RUSH_HOUR_MORNING_START && hour < RUSH_HOUR_MORNING_END) ||
    (hour >= RUSH_HOUR_EVENING_START && hour < RUSH_HOUR_EVENING_END)
  );
}

function getRushHourDelta(isRushHourNow: boolean): number {
  return isRushHourNow ? 0.35 : 0.1;
}

function predictWithRushHour(input: TrafficPredictionInput): TrafficPredictionResult {
  const rushHour = isRushHour();
  const delta = getRushHourDelta(rushHour);
  const currentLoad = input.occupancyPercent;
  const predictedLoad = Math.min(100, currentLoad + delta * 100);

  const congestionScore = calculateCongestionScore(input);

  return {
    segmentId: input.segmentId,
    congestionScore,
    travelTimeMultiplier: Number((1 + congestionScore / 100).toFixed(2)),
    level: levelForScore(congestionScore),
    predictedLoad: Number(predictedLoad.toFixed(1)),
    currentLoad: input.occupancyPercent,
    capacity: 100,
    vehicleEligibility: ["CAR", "BIKE", "TRUCK"],
    sourceMode: "DEMO",
    predictionMethod: "rush-hour",
  };
}

function predictWithRuleBased(input: TrafficPredictionInput): TrafficPredictionResult {
  const rushHour = isRushHour();
  const baseDelta = rushHour ? 0.3 : 0.15;
  const timeOfDayFactor = Math.sin(((new Date().getHours() - 6) * Math.PI) / 12);
  const incidentFactor = Math.random() < 0.1 ? 0.25 : 0;

  const totalDelta = baseDelta + Math.max(0, timeOfDayFactor) * 0.1 + incidentFactor;
  const currentLoad = input.occupancyPercent;
  const predictedLoad = Math.min(100, currentLoad + totalDelta * 100);

  const congestionScore = calculateCongestionScore(input);

  return {
    segmentId: input.segmentId,
    congestionScore,
    travelTimeMultiplier: Number((1 + congestionScore / 100).toFixed(2)),
    level: levelForScore(congestionScore),
    predictedLoad: Number(predictedLoad.toFixed(1)),
    currentLoad: input.occupancyPercent,
    capacity: 100,
    vehicleEligibility: ["CAR", "BIKE", "TRUCK"],
    sourceMode: "DEMO",
    predictionMethod: "rule-based",
  };
}

function predictWithRegression(input: TrafficPredictionInput): TrafficPredictionResult {
  const hour = new Date().getHours();
  const hourNormalized = hour / 24;
  const occupancyNormalized = input.occupancyPercent / 100;
  const speedRatio = input.observedSpeedKph / input.freeFlowSpeedKph;

  const coeffHour = 0.4;
  const coeffOccupancy = 0.35;
  const coeffSpeed = 0.25;

  const predictedCongestion = Math.min(
    1,
    coeffHour * Math.abs(hourNormalized - 0.5) * 2 + coeffOccupancy * occupancyNormalized + coeffSpeed * (1 - speedRatio),
  );

  const congestionScore = Math.round(predictedCongestion * 100);
  const currentLoad = input.occupancyPercent;
  const predictedLoad = Math.min(100, currentLoad + predictedCongestion * 100);

  return {
    segmentId: input.segmentId,
    congestionScore,
    travelTimeMultiplier: Number((1 + congestionScore / 100).toFixed(2)),
    level: levelForScore(congestionScore),
    predictedLoad: Number(predictedLoad.toFixed(1)),
    currentLoad: input.occupancyPercent,
    capacity: 100,
    vehicleEligibility: ["CAR", "BIKE", "TRUCK"],
    sourceMode: "DEMO",
    predictionMethod: "regression",
  };
}

function predictWithHistorical(input: TrafficPredictionInput): TrafficPredictionResult {
  const historicalData: Record<string, number[]> = {
    "corridor-north": [20, 25, 30, 35, 45, 60, 75, 80, 70, 55, 40, 30, 25, 20, 22, 28, 35, 50, 65, 70, 55, 40, 30, 22],
    "corridor-central": [15, 18, 22, 28, 38, 55, 70, 85, 78, 60, 45, 35, 28, 22, 20, 25, 32, 48, 62, 68, 52, 38, 28, 20],
    "corridor-south": [18, 20, 24, 30, 40, 58, 72, 82, 75, 58, 42, 32, 26, 22, 20, 24, 30, 45, 60, 65, 50, 35, 26, 20],
    "corridor-east": [20, 22, 25, 30, 40, 55, 68, 75, 70, 55, 42, 32, 28, 24, 22, 26, 32, 45, 58, 62, 50, 38, 30, 22],
  };

  const hour = new Date().getHours();
  const segmentHistory = historicalData[input.segmentId] ?? historicalData["corridor-central"]!;
  const historicalLoad = segmentHistory[hour] ?? 50;

  const currentLoad = input.occupancyPercent;
  const predictedLoad = historicalLoad;

  const congestionScore = calculateCongestionScore(input);

  return {
    segmentId: input.segmentId,
    congestionScore,
    travelTimeMultiplier: Number((1 + congestionScore / 100).toFixed(2)),
    level: levelForScore(congestionScore),
    predictedLoad: Number(predictedLoad.toFixed(1)),
    currentLoad: input.occupancyPercent,
    capacity: 100,
    vehicleEligibility: ["CAR", "BIKE", "TRUCK"],
    sourceMode: "DEMO",
    predictionMethod: "historical",
  };
}

export function predictTraffic(input: TrafficPredictionInput, method: PredictionMethod = "rule-based"): TrafficPredictionResult {
  switch (method) {
    case "rush-hour":
      return predictWithRushHour(input);
    case "rule-based":
      return predictWithRuleBased(input);
    case "regression":
      return predictWithRegression(input);
    case "historical":
      return predictWithHistorical(input);
    default:
      return predictWithRuleBased(input);
  }
}

export function predictTrafficForRoute(segments: TrafficSegment[], method: PredictionMethod = "rule-based"): TrafficPredictionResult[] {
  return segments.map((segment) =>
    predictTraffic(
      {
        segmentId: segment.segmentId,
        freeFlowSpeedKph: segment.freeFlowSpeedKph,
        observedSpeedKph: segment.observedSpeedKph,
        occupancyPercent: segment.occupancyPercent,
      },
      method,
    ),
  );
}

export function getDemoRoutes(): TrafficRoute[] {
  return [
    {
      routeId: "route-north",
      name: "Northern Corridor (NH-48)",
      distanceKm: 45.2,
      segments: [
        {
          segmentId: "corridor-north",
          name: "NH-48 North Stretch",
          capacity: 2000,
          currentLoad: 1200,
          predictedLoad: 1560,
          vehicleEligibility: ["CAR", "BIKE", "TRUCK"],
          freeFlowSpeedKph: 80,
          observedSpeedKph: 45,
          occupancyPercent: 60,
          distanceKm: 45.2,
        },
      ],
      totalCapacity: 2000,
      totalCurrentLoad: 1200,
      totalPredictedLoad: 1560,
      vehicleEligibility: ["CAR", "BIKE", "TRUCK"],
    },
    {
      routeId: "route-central",
      name: "Central Expressway",
      distanceKm: 32.8,
      segments: [
        {
          segmentId: "corridor-central",
          name: "Central Expressway Main",
          capacity: 1800,
          currentLoad: 1440,
          predictedLoad: 1728,
          vehicleEligibility: ["CAR", "BIKE"],
          freeFlowSpeedKph: 60,
          observedSpeedKph: 22,
          occupancyPercent: 80,
          distanceKm: 32.8,
        },
      ],
      totalCapacity: 1800,
      totalCurrentLoad: 1440,
      totalPredictedLoad: 1728,
      vehicleEligibility: ["CAR", "BIKE"],
    },
    {
      routeId: "route-south",
      name: "Southern Ring Road",
      distanceKm: 38.5,
      segments: [
        {
          segmentId: "corridor-south",
          name: "Southern Ring Road",
          capacity: 1600,
          currentLoad: 800,
          predictedLoad: 960,
          vehicleEligibility: ["CAR", "BIKE", "TRUCK", "COMMERCIAL"],
          freeFlowSpeedKph: 70,
          observedSpeedKph: 55,
          occupancyPercent: 50,
          distanceKm: 38.5,
        },
      ],
      totalCapacity: 1600,
      totalCurrentLoad: 800,
      totalPredictedLoad: 960,
      vehicleEligibility: ["CAR", "BIKE", "TRUCK", "COMMERCIAL"],
    },
    {
      routeId: "route-east",
      name: "Eastern Bypass",
      distanceKm: 28.3,
      segments: [
        {
          segmentId: "corridor-east",
          name: "Eastern Bypass",
          capacity: 1200,
          currentLoad: 720,
          predictedLoad: 840,
          vehicleEligibility: ["CAR", "BIKE"],
          freeFlowSpeedKph: 65,
          observedSpeedKph: 40,
          occupancyPercent: 60,
          distanceKm: 28.3,
        },
      ],
      totalCapacity: 1200,
      totalCurrentLoad: 720,
      totalPredictedLoad: 840,
      vehicleEligibility: ["CAR", "BIKE"],
    },
  ];
}
