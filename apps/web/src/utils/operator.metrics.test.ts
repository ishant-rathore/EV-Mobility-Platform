import { describe, expect, it } from "vitest";
import type {
  ChargerReliabilityAssessment,
  ChargerTelemetrySnapshot,
  DemoReservation,
} from "@ev-mobility/shared-types";
import type { OperatorDashboardData } from "../types/operator";
import {
  congestionLevel,
  deriveOperatorMetrics,
  normalizeOperatorStatus,
} from "./operator.metrics";

const reliability: ChargerReliabilityAssessment = {
  chargerId: "charger-a",
  score: 10,
  grade: "F",
  status: "FAULT",
  isUsable: false,
  recommendation: "AVOID",
  freshness: "FRESH",
  confidencePercent: 80,
  sourceMode: "SIMULATOR",
  reasons: ["Fault reported"],
  warnings: ["Simulated"],
  invalidatedBy: ["ACTIVE_FAULT"],
  calculatedAt: "2026-08-18T12:00:00.000Z",
};

function reservation(id: string, status: DemoReservation["status"]): DemoReservation {
  return {
    id,
    recommendationId: "rec",
    driverId: "driver",
    vehicleId: "vehicle",
    routeId: "route",
    stationId: "station",
    chargerId: "charger",
    parkingBayId: null,
    startsAt: "2026-08-18T12:00:00.000Z",
    endsAt: "2026-08-18T13:00:00.000Z",
    status,
    paymentRequired: false,
    paymentStatus: "NOT_REQUIRED",
    sourceMode: "DEMO",
    isSimulated: true,
    warnings: [],
    createdAt: "2026-08-18T11:00:00.000Z",
    updatedAt: "2026-08-18T11:00:00.000Z",
  };
}

describe("Module 11 operator metrics", () => {
  it("normalizes legacy charger states", () => {
    expect(normalizeOperatorStatus("CONNECTED")).toBe("CONNECTED_NOT_CHARGING");
    expect(normalizeOperatorStatus("FAULTED")).toBe("FAULT");
    expect(normalizeOperatorStatus("unknown")).toBe("OFFLINE");
  });

  it("uses live telemetry over seeded status and counts sessions and overloads", () => {
    const telemetry: ChargerTelemetrySnapshot[] = [{
      telemetry: {
        chargerId: "charger-a",
        status: "FAULT",
        recordedAt: "2026-08-18T12:00:00.000Z",
        sourceMode: "SIMULATOR",
        isSimulated: true,
      },
      reliability,
      receivedAt: "2026-08-18T12:00:00.000Z",
    }];
    const data: OperatorDashboardData = {
      routes: [
        { routeId: "a", name: "A", distanceKm: 10, totalCapacity: 100, totalCurrentLoad: 50, totalPredictedLoad: 90, vehicleEligibility: ["CAR"] },
        { routeId: "b", name: "B", distanceKm: 12, totalCapacity: 100, totalCurrentLoad: 30, totalPredictedLoad: 50, vehicleEligibility: ["CAR"] },
      ],
      stations: [{
        id: "station",
        name: "Station",
        latitude: 19,
        longitude: 72,
        availableChargers: 2,
        powerKw: 60,
        reliabilityScore: 90,
        pricePerKwh: 18,
        chargers: [
          { id: "charger-a", connectorType: "CCS2", status: "AVAILABLE", powerKw: 60, pricePerKwh: 18 },
          { id: "charger-b", connectorType: "TYPE2", status: "CHARGING", powerKw: 22, pricePerKwh: 16 },
        ],
      }],
      telemetry,
      reservations: [reservation("active", "ACTIVE"), reservation("confirmed", "CONFIRMED")],
    };

    const metrics = deriveOperatorMetrics(data);
    expect(metrics).toMatchObject({
      routeCount: 2,
      overloadedRouteCount: 1,
      chargerCount: 2,
      faultedChargerCount: 1,
      chargingChargerCount: 1,
      activeSessionCount: 1,
      confirmedReservationCount: 1,
    });
  });

  it("assigns the documented traffic levels", () => {
    expect(congestionLevel(20, 100)).toBe("LOW");
    expect(congestionLevel(60, 100)).toBe("MEDIUM");
    expect(congestionLevel(80, 100)).toBe("HIGH");
    expect(congestionLevel(95, 100)).toBe("SEVERE");
  });
});
