export interface StationRecord {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  availableChargers: number;
  powerKw: number;
  reliabilityScore: number;
  pricePerKwh: number;
}

export interface StationProvider {
  listStations(): Promise<StationRecord[]>;
}
