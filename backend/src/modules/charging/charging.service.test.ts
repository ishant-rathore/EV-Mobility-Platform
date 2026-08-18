import { describe, expect, it } from "vitest";
import { findChargingStations } from "./charging.service.js";

describe("findChargingStations", () => {
  it("filters stations by charging power", async () => {
    const stations = await findChargingStations({ minimumPowerKw: 50 });
    expect(stations.every((station) => station.powerKw >= 50)).toBe(true);
  });
});
