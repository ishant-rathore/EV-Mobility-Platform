import type { StationProvider, StationRecord } from "./station.provider.js";

export class OcppStationProvider implements StationProvider {
  async listStations(): Promise<StationRecord[]> {
    throw new Error("OCPP provider is not configured");
  }
}
