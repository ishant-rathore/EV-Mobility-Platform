import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../../app.js";
import { resetReliabilityStore } from "../reliability/reliability.service.js";
import { chargerTelemetrySchema } from "./telemetry.schemas.js";
import {
  getLatestTelemetry,
  resetTelemetryStore,
  subscribeToTelemetry,
} from "./telemetry.service.js";

describe("Module 07 normalized telemetry", () => {
  beforeEach(() => {
    resetTelemetryStore();
    resetReliabilityStore();
  });

  it("normalizes legacy states and makes demo provenance explicit", () => {
    const connected = chargerTelemetrySchema.parse({
      chargerId: "charger-demo-1-ccs2",
      status: "CONNECTED",
      sourceMode: "DEMO",
    });

    expect(connected).toMatchObject({
      status: "CONNECTED_NOT_CHARGING",
      sourceMode: "HARDWARE_DEMO",
      isSimulated: true,
    });
    expect(connected.recordedAt).toEqual(expect.any(String));
  });

  it("accepts limited-IoT messages without inventing unavailable measurements", () => {
    const telemetry = chargerTelemetrySchema.parse({
      chargerId: "limited-device",
      status: "AVAILABLE",
      sourceMode: "LIMITED_IOT",
    });

    expect(telemetry.powerKw).toBeUndefined();
    expect(telemetry.temperatureCelsius).toBeUndefined();
    expect(telemetry.isSimulated).toBe(false);
  });

  it("stores a snapshot, updates reliability, and notifies subscribers", async () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToTelemetry(listener);

    const postResponse = await request(app).post("/api/v1/telemetry").send({
      chargerId: "charger-demo-1-ccs2",
      status: "FAULT",
      temperatureCelsius: 78,
      sourceMode: "SIMULATOR",
      isSimulated: true,
    });

    expect(postResponse.status).toBe(202);
    expect(listener).toHaveBeenCalledOnce();
    expect(listener.mock.calls[0]?.[0]).toMatchObject({
      telemetry: { status: "FAULT", sourceMode: "SIMULATOR" },
      reliability: { isUsable: false },
      receivedAt: expect.any(String),
    });

    const listResponse = await request(app).get("/api/v1/telemetry");
    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toMatchObject({
      source: "normalized-telemetry",
      chargers: [{ telemetry: { chargerId: "charger-demo-1-ccs2" } }],
    });

    unsubscribe();
  });

  it("isolates listener errors from ingestion", async () => {
    const unsubscribe = subscribeToTelemetry(() => {
      throw new Error("dashboard unavailable");
    });

    const response = await request(app).post("/api/v1/telemetry").send({
      chargerId: "resilient-device",
      status: "AVAILABLE",
      sourceMode: "OCPP",
    });

    expect(response.status).toBe(202);
    expect(getLatestTelemetry("resilient-device")?.status).toBe("AVAILABLE");
    unsubscribe();
  });
});
