import type { StationRecord } from "../../integrations/charging-providers/station.provider.js";

export function rankStations(stations: StationRecord[]): StationRecord[] {
  return [...stations].sort((a, b) => {
    const aScore = a.reliabilityScore + a.availableChargers * 5 + a.powerKw * 0.1 - a.pricePerKwh;
    const bScore = b.reliabilityScore + b.availableChargers * 5 + b.powerKw * 0.1 - b.pricePerKwh;
    return bScore - aScore;
  });
}
