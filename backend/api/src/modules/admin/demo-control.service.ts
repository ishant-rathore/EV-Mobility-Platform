import { simulateDiversification, toDiversificationRouteInputs, trafficDiversificationEngine } from "../traffic/diversification.service.js";
import { getControlledDemoRoutes } from "../traffic/demo-traffic.service.js";
import { resetAccessCommandStore } from "../iot/access.service.js";
import { resetOccupancyStore } from "../occupancy/occupancy.service.js";
import { resetPaymentStore } from "../payment/payment.service.js";
import { resetRecommendationStore } from "../recommendation/recommendation.store.js";
import { resetReliabilityStore } from "../reliability/reliability.service.js";
import { resetReservationStore } from "../booking/booking.service.js";
import { chargerTelemetrySchema } from "../telemetry/telemetry.schemas.js";
import { listTelemetrySnapshots, recordTelemetry, resetTelemetryStore } from "../telemetry/telemetry.service.js";
import { AppError } from "../../shared/errors.js";
import {
  getDemoRuntimeState,
  resetDemoRuntimeState,
  setDemoFrozen,
  setDemoSourceMode,
  setDemoTrafficLevel,
  type DemoSourceMode,
  type DemoTrafficLevel,
} from "./demo-runtime.store.js";

let lastBatch: ReturnType<typeof simulateDiversification> | null = null;

function assertNotFrozen(): void {
  if (getDemoRuntimeState().frozen) {
    throw new AppError(
      "Demo data is frozen. Resume updates before triggering a scenario.",
      409,
      "DEMO_DATA_FROZEN",
    );
  }
}

export function getDemoControlSnapshot() {
  return {
    runtime: getDemoRuntimeState(),
    routes: getControlledDemoRoutes(),
    telemetry: listTelemetrySnapshots(),
    lastBatch,
    sourceMode: "DEMO" as const,
    isSimulated: true as const,
    disclaimer: "Scenario controls affect process-local demo state only. No public road, payment network, database, or high-voltage charger is controlled.",
  };
}

export function changeDemoMode(mode: DemoSourceMode) {
  return getDemoControlSnapshotAfter(() => setDemoSourceMode(mode));
}

export function changeDemoFreeze(frozen: boolean) {
  return getDemoControlSnapshotAfter(() => setDemoFrozen(frozen));
}

export function changeDemoTraffic(routeId: string, level: DemoTrafficLevel) {
  assertNotFrozen();
  if (!getControlledDemoRoutes().some((route) => route.routeId === routeId)) {
    throw new AppError("Demo traffic route not found", 404, "DEMO_ROUTE_NOT_FOUND");
  }
  return getDemoControlSnapshotAfter(() => setDemoTrafficLevel(routeId, level));
}

export function triggerDemoCharger(
  chargerId: string,
  action: "CHARGING" | "FAULT" | "RESTORE",
) {
  assertNotFrozen();
  const status = action === "RESTORE" ? "AVAILABLE" : action;
  const telemetry = chargerTelemetrySchema.parse({
    chargerId,
    status,
    powerKw: action === "CHARGING" ? 42 : 0,
    voltageV: 230,
    currentA: action === "CHARGING" ? 32 : 0,
    temperatureCelsius: action === "FAULT" ? 74 : 31,
    recordedAt: new Date().toISOString(),
    sourceMode: "SIMULATOR",
    isSimulated: true,
  });
  recordTelemetry(telemetry);
  return getDemoControlSnapshot();
}

export function runDemoVehicleBatch(input: {
  requestCount: number;
  demandUnitsPerRequest: number;
  vehicleClasses: string[];
}) {
  assertNotFrozen();
  lastBatch = simulateDiversification({
    routes: toDiversificationRouteInputs(getControlledDemoRoutes()),
    ...input,
  });
  return getDemoControlSnapshot();
}

export function resetAllDemoState() {
  trafficDiversificationEngine.reset();
  resetTelemetryStore();
  resetReliabilityStore();
  resetRecommendationStore();
  resetReservationStore();
  resetPaymentStore();
  resetOccupancyStore();
  resetAccessCommandStore();
  lastBatch = null;
  resetDemoRuntimeState();
  return {
    ...getDemoControlSnapshot(),
    resetScopes: [
      "runtime",
      "traffic-diversification",
      "telemetry",
      "reliability",
      "recommendations",
      "reservations",
      "payments",
      "occupancy",
      "access-commands",
    ],
  };
}

function getDemoControlSnapshotAfter(action: () => unknown) {
  action();
  return getDemoControlSnapshot();
}
