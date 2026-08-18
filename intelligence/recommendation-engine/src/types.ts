export type RecommendationStatus =
  | "READY"
  | "NO_CHARGING_REQUIRED"
  | "NO_FEASIBLE_CHARGER"
  | "NO_ELIGIBLE_ROUTE";

export type RecommendationSourceMode = "LIVE" | "DEMO" | "MIXED";

export interface RecommendationRouteInput {
  routeId: string;
  name: string;
  estimatedEtaMinutes: number;
  estimatedArrivalSocPercent: number;
  estimatedEnergyKwh: number;
  chargingRequired: boolean;
  trafficHorizon?: "CURRENT" | "PREDICTED";
  trafficLevel?: "LOW" | "MEDIUM" | "HIGH" | "SEVERE";
  projectedUtilizationPercent?: number;
}

export interface RecommendationChargerInput {
  chargerId: string;
  stationId: string;
  stationName: string;
  connectorType: string;
  powerKw: number;
  estimatedWaitMinutes: number;
  detourKm: number;
  pricePerKwh: number;
  reliabilityScore: number;
  reliabilityGrade: "A" | "B" | "C" | "D" | "F";
  reliabilityFreshness: "FRESH" | "AGING" | "STALE" | "UNKNOWN";
  reliabilitySourceMode: string;
  reliabilityReasons: readonly string[];
  reliabilityWarnings: readonly string[];
}

export interface RecommendationOrchestratorInput {
  recommendationId: string;
  generatedAt: string;
  sourceMode: RecommendationSourceMode;
  isSimulated: boolean;
  selectedRouteId: string | null;
  routes: readonly RecommendationRouteInput[];
  chargingRequired: boolean;
  primaryCharger: RecommendationChargerInput | null;
  backupCharger: RecommendationChargerInput | null;
}

export interface RecommendationDecision {
  recommendationId: string;
  generatedAt: string;
  status: RecommendationStatus;
  sourceMode: RecommendationSourceMode;
  isSimulated: boolean;
  recommendedRouteId: string | null;
  recommendedRouteName: string | null;
  recommendedChargerId: string | null;
  recommendedStationId: string | null;
  backupChargerId: string | null;
  backupStationId: string | null;
  estimatedArrivalSocPercent: number | null;
  estimatedEtaMinutes: number | null;
  estimatedWaitMinutes: number | null;
  estimatedDetourKm: number | null;
  estimatedPricePerKwh: number | null;
  reliabilityScore: number | null;
  reasons: string[];
  warnings: string[];
}
