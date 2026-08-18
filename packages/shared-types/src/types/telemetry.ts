import type { ChargerReliabilityAssessment } from "./routing.js";

export type CanonicalTelemetryStatus =
  | "AVAILABLE"
  | "CONNECTED_NOT_CHARGING"
  | "CHARGING"
  | "FAULT"
  | "OFFLINE";

export type TelemetrySourceMode =
  | "LIVE_IOT"
  | "LIMITED_IOT"
  | "OCPP"
  | "HARDWARE_DEMO"
  | "SIMULATOR";

export interface ChargerTelemetry {
  chargerId: string;
  status: CanonicalTelemetryStatus;
  powerKw?: number;
  voltageV?: number;
  currentA?: number;
  energyKwh?: number;
  temperatureCelsius?: number;
  deviceUptimeSeconds?: number;
  sequenceNumber?: number;
  recordedAt: string;
  sourceMode: TelemetrySourceMode;
  isSimulated: boolean;
}

export interface ChargerTelemetrySnapshot {
  telemetry: ChargerTelemetry;
  reliability: ChargerReliabilityAssessment;
  receivedAt: string;
}

export interface TelemetrySnapshotResponse {
  source: "normalized-telemetry";
  disclaimer: string;
  chargers: ChargerTelemetrySnapshot[];
}
