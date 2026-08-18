import type { ConnectorType, VehicleClass } from "../../shared/enums.js";
import type {
  RouteTrafficSnapshot,
  TrafficHorizon,
} from "../traffic/traffic-prediction.service.js";
import type {
  EnvironmentAdjustment,
  EnvironmentConditions,
} from "./environment-factor.service.js";
import type { RouteSegmentEstimate } from "./route-segments.service.js";

export interface EnergyEstimateInput {
  distanceKm: number;
  batteryCapacityKwh: number;
  usableBatteryCapacityKwh?: number;
  efficiencyWhPerKm: number;
  currentSocPercent: number;
  reserveSocPercent: number;
  availableEnergyKwh?: number;
  reserveEnergyKwh?: number;
  usableEnergyKwh?: number;
  trafficFactor?: number;
  environmentFactor?: number;
  auxiliaryLoadKwh?: number;
}

export interface EnergyEstimate {
  distanceKm: number;
  effectiveBatteryCapacityKwh: number;
  baseEnergyKwh: number;
  trafficFactor: number;
  environmentFactor: number;
  auxiliaryLoadKwh: number;
  requiredKwh: number;
  availableEnergyKwh: number;
  reserveEnergyKwh: number;
  usableEnergyKwh: number;
  projectedArrivalSocPercent: number;
  energyDeficitKwh: number;
  canReachDestinationWithoutCharging: boolean;
  chargingRequired: boolean;
}

export interface RouteLocation {
  label?: string;
  latitude: number;
  longitude: number;
}

export interface VehicleEnergyProfile {
  id?: string;
  batteryCapacityKwh: number;
  usableBatteryCapacityKwh?: number;
  efficiencyWhPerKm: number;
  currentSocPercent: number;
  vehicleClass?: VehicleClass;
  connectorTypes?: ConnectorType[];
  availableEnergyKwh?: number;
  reserveEnergyKwh?: number;
  usableEnergyKwh?: number;
}

export type RouteProviderMode = "DEMO" | "OSRM" | "AUTO";

export interface RouteEvaluationInput {
  origin: RouteLocation;
  destination: RouteLocation;
  vehicle: VehicleEnergyProfile;
  reserveSocPercent: number;
  environmentFactor?: number;
  environment?: EnvironmentConditions;
  auxiliaryLoadKwh: number;
  provider: RouteProviderMode;
  trafficHorizon?: TrafficHorizon;
}

export interface ChargerCandidate {
  id: string;
  name: string;
  availableChargers: number;
  powerKw: number;
  reliabilityScore: number;
}

export interface EvaluatedRoute {
  routeId: string;
  name: string;
  sourceMode: "DEMO" | "OSRM";
  distanceKm: number;
  baseEtaMinutes: number;
  trafficFactor: number;
  traffic?: RouteTrafficSnapshot;
  estimatedEtaMinutes: number;
  estimatedEnergyKwh: number;
  estimatedArrivalSocPercent: number;
  chargingRequired: boolean;
  energy: EnergyEstimate;
  environmentAdjustment: EnvironmentAdjustment;
  chargerCandidates: ChargerCandidate[];
  recommendedChargingStop: ChargerCandidate | null;
  segments: RouteSegmentEstimate[];
  geometry: Array<{ latitude: number; longitude: number }>;
}

export interface RouteEvaluationResult {
  generatedAt: string;
  requestedProvider: RouteProviderMode;
  sourceMode: "DEMO" | "OSRM";
  fallbackReason?: string;
  origin: RouteLocation;
  destination: RouteLocation;
  routes: EvaluatedRoute[];
}
