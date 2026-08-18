export interface RankableStation {
  reliabilityScore: number;
  availableChargers: number;
  powerKw: number;
  pricePerKwh: number;
}

export function calculateStationScore(station: RankableStation): number {
  return station.reliabilityScore + station.availableChargers * 5 + station.powerKw * 0.1 - station.pricePerKwh;
}

export function rankStations<T extends RankableStation>(stations: readonly T[]): T[] {
  return [...stations].sort((left, right) => calculateStationScore(right) - calculateStationScore(left));
}
