export const CHARGER_OPERATIONAL_STATUSES = [
  "AVAILABLE",
  "CONNECTED",
  "CONNECTED_NOT_CHARGING",
  "CHARGING",
  "OCCUPIED",
  "FAULT",
  "FAULTED",
  "OFFLINE",
] as const;

export type ChargerOperationalStatus = (typeof CHARGER_OPERATIONAL_STATUSES)[number];
export type CanonicalChargerStatus =
  | "AVAILABLE"
  | "CONNECTED_NOT_CHARGING"
  | "CHARGING"
  | "FAULT"
  | "OFFLINE";

export const RELIABILITY_SOURCE_MODES = [
  "LIVE_IOT",
  "LIMITED_IOT",
  "OCPP",
  "HARDWARE_DEMO",
  "SIMULATOR",
  "DEMO",
] as const;

export type ReliabilitySourceMode = (typeof RELIABILITY_SOURCE_MODES)[number];
export type ReliabilityGrade = "A" | "B" | "C" | "D" | "F";
export type DataFreshness = "FRESH" | "AGING" | "STALE" | "UNKNOWN";
export type ReliabilityRecommendation = "PREFERRED" | "ACCEPTABLE" | "CAUTION" | "AVOID" | "UNAVAILABLE";
export type AvailabilityLevel = "HIGH" | "MODERATE" | "LOW" | "UNAVAILABLE";
export type ReliabilityFactorKey =
  | "currentState"
  | "uptime"
  | "sessionSuccess"
  | "heartbeatFreshness"
  | "recentFaults"
  | "temperatureStability"
  | "dataConfidence";

export interface ReliabilityInput {
  chargerId?: string;
  status?: ChargerOperationalStatus;
  uptimePercent: number;
  successfulSessionsPercent: number;
  heartbeatFreshnessPercent?: number;
  heartbeatAgeSeconds?: number;
  faultRatePercent: number;
  recentFaultCount?: number;
  temperatureCelsius?: number;
  telemetryCompletenessPercent?: number;
  sourceMode?: ReliabilitySourceMode;
  calculatedAt?: string;
}

export interface ReliabilityFactorScore {
  value: number;
  weight: number;
  contribution: number;
  explanation: string;
}

export interface AvailabilityAssessment {
  level: AvailabilityLevel;
  basis: "PROTOTYPE_HEURISTIC";
  explanation: string;
}

export interface ReliabilityScore {
  chargerId: string | null;
  score: number;
  grade: ReliabilityGrade;
  status: CanonicalChargerStatus;
  isUsable: boolean;
  recommendation: ReliabilityRecommendation;
  freshness: DataFreshness;
  confidencePercent: number;
  sourceMode: ReliabilitySourceMode;
  availability: AvailabilityAssessment;
  factors: Record<ReliabilityFactorKey, ReliabilityFactorScore>;
  reasons: string[];
  warnings: string[];
  invalidatedBy: string[];
  calculatedAt: string;
}

export interface BackupChargerCandidate {
  chargerId: string;
  reliability: ReliabilityScore;
  connectorCompatible: boolean;
  reachable: boolean;
  detourKm?: number;
}
