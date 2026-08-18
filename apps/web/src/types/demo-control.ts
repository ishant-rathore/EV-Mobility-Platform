import type { ChargerTelemetrySnapshot } from "@ev-mobility/shared-types";
import type { DiversificationSimulation } from "./diversification";
import type { OperatorTrafficRoute } from "./operator";

export type DemoSourceMode = "REAL" | "DEMO" | "SIMULATOR";
export type DemoTrafficLevel = "MEDIUM" | "HIGH";

export interface DemoRuntimeState {
  requestedMode: DemoSourceMode;
  effectiveMode: DemoSourceMode;
  frozen: boolean;
  frozenAt: string | null;
  trafficOverrides: Record<string, DemoTrafficLevel>;
  lastAction: string;
  updatedAt: string;
  warnings: string[];
}

export interface DemoControlSnapshot {
  runtime: DemoRuntimeState;
  routes: OperatorTrafficRoute[];
  telemetry: ChargerTelemetrySnapshot[];
  lastBatch: DiversificationSimulation | null;
  sourceMode: "DEMO";
  isSimulated: true;
  disclaimer: string;
  resetScopes?: string[];
}
