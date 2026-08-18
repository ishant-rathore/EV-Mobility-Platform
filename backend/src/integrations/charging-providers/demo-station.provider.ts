import type { StationProvider, StationRecord } from "./station.provider.js";

const stations: StationRecord[] = [
  {
    id: "station-demo-1",
    name: "VoltTwin Central Hub",
    latitude: 19.076,
    longitude: 72.8777,
    availableChargers: 3,
    powerKw: 60,
    reliabilityScore: 94,
    pricePerKwh: 18,
  },
  {
    id: "station-demo-2",
    name: "GreenRoute Charging Point",
    latitude: 19.1136,
    longitude: 72.8697,
    availableChargers: 1,
    powerKw: 30,
    reliabilityScore: 82,
    pricePerKwh: 15,
  },
];

export class DemoStationProvider implements StationProvider {
  async listStations(): Promise<StationRecord[]> {
    return stations;
  }
}
