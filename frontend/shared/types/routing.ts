export interface RouteLocation {
  label: string;
  latitude: number;
  longitude: number;
}

export interface RouteEvaluationInput {
  origin: RouteLocation;
  destination: RouteLocation;
  vehicle: {
    id?: string;
    batteryCapacityKwh: number;
    usableBatteryCapacityKwh?: number;
    efficiencyWhPerKm: number;
    currentSocPercent: number;
  };
  reserveSocPercent: number;
  environmentFactor?: number;
  environment?: {
    weatherCondition?: "CLEAR" | "RAIN" | "HOT" | "COLD";
    ambientTemperatureC?: number;
    elevationGainM?: number;
  };
  auxiliaryLoadKwh: number;
  provider: "DEMO" | "OSRM" | "AUTO";
  trafficHorizon?: "CURRENT" | "PREDICTED";
}

export interface IntegratedJourneyEvaluationInput {
  vehicleId: string;
  currentSocPercent?: number;
  reserveSocPercent?: number;
  origin: RouteLocation;
  destination: RouteLocation;
  environmentFactor?: number;
  environment?: RouteEvaluationInput["environment"];
  auxiliaryLoadKwh: number;
  provider: "DEMO" | "OSRM" | "AUTO";
  trafficHorizon?: "CURRENT" | "PREDICTED";
}

export interface RouteEnergyEstimate {
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
  traffic?: {
    routeId: string;
    horizon: "CURRENT" | "PREDICTED";
    sourceMode: "DEMO" | "REAL";
    currentLoad: number;
    predictedLoad: number;
    capacity: number;
    currentLoadPercent: number;
    predictedLoadPercent: number;
    currentLevel: "LOW" | "MEDIUM" | "HIGH" | "SEVERE";
    predictedLevel: "LOW" | "MEDIUM" | "HIGH" | "SEVERE";
    travelTimeMultiplier: number;
    vehicleEligibility: string[];
    vehicleEligible: boolean;
  };
  estimatedEtaMinutes: number;
  estimatedEnergyKwh: number;
  estimatedArrivalSocPercent: number;
  chargingRequired: boolean;
  energy: RouteEnergyEstimate;
  environmentAdjustment: {
    weatherFactor: number;
    temperatureFactor: number;
    elevationFactor: number;
    combinedFactor: number;
    sourceMode: "ESTIMATED" | "MANUAL";
  };
  chargerCandidates: ChargerCandidate[];
  recommendedChargingStop: ChargerCandidate | null;
  segments: Array<{
    segmentIndex: number;
    start: { latitude: number; longitude: number };
    end: { latitude: number; longitude: number };
    distanceKm: number;
    estimatedEnergyKwh: number;
  }>;
  geometry: Array<{ latitude: number; longitude: number }>;
}

export interface RouteEvaluation {
  generatedAt: string;
  requestedProvider: "DEMO" | "OSRM" | "AUTO";
  sourceMode: "DEMO" | "OSRM";
  fallbackReason?: string;
  origin: RouteLocation;
  destination: RouteLocation;
  routes: EvaluatedRoute[];
  vehicleSnapshot?: {
    vehicleId: string;
    name: string;
    vehicleClass: "CAR" | "BIKE" | "TRUCK" | "COMMERCIAL";
    currentSocPercent: number;
    reserveSocPercent: number;
    usableCapacityKwh: number;
    sourceMode: "REAL" | "OCPP" | "DEMO" | "SIMULATOR";
  };
  integration?: {
    modules: string[];
    trafficHorizon: "CURRENT" | "PREDICTED";
  };
}
