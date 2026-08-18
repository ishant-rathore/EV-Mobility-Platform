import { beforeEach, describe, expect, it } from "vitest";
import { resetReliabilityStore } from "../../modules/reliability/reliability.service.js";
import {
  getLatestTelemetry,
  resetTelemetryStore,
} from "../../modules/telemetry/telemetry.service.js";
import { handleTelemetryMessage } from "./mqtt.handlers.js";

describe("Module 07 MQTT ingestion", () => {
  beforeEach(() => {
    resetTelemetryStore();
    resetReliabilityStore();
  });

  it("ingests simulator and hardware-demo payloads through one contract", () => {
    const simulator = handleTelemetryMessage(
      "volttwin/chargers/simulator-one/telemetry",
      Buffer.from(JSON.stringify({
        chargerId: "simulator-one",
        status: "CHARGING",
        powerKw: 32,
        sourceMode: "SIMULATOR",
      })),
    );
    const hardware = handleTelemetryMessage(
      "volttwin/chargers/hardware-one/telemetry",
      Buffer.from(JSON.stringify({
        chargerId: "hardware-one",
        status: "AVAILABLE",
        sourceMode: "HARDWARE_DEMO",
      })),
    );

    expect(simulator).toMatchObject({ status: "CHARGING", isSimulated: true });
    expect(hardware).toMatchObject({ status: "AVAILABLE", isSimulated: true });
  });

  it("rejects a payload whose charger does not match its topic", () => {
    expect(() => handleTelemetryMessage(
      "volttwin/chargers/expected/telemetry",
      Buffer.from(JSON.stringify({
        chargerId: "unexpected",
        status: "AVAILABLE",
        sourceMode: "SIMULATOR",
      })),
    )).toThrow(/does not match/);

    expect(getLatestTelemetry("unexpected")).toBeNull();
  });
});
