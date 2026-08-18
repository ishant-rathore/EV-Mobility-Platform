import type { StationRecord } from "../../integrations/charging-providers/station.provider.js";
import type { ChargerCandidate } from "./routing.types.js";

export function selectChargingStopCandidates(
  candidateIds: string[],
  stations: StationRecord[],
): ChargerCandidate[] {
  const stationById = new Map(stations.map((station) => [station.id, station]));
  return candidateIds.flatMap((id) => {
    const station = stationById.get(id);
    return station
      ? [
          {
            id: station.id,
            name: station.name,
            availableChargers: station.availableChargers,
            powerKw: station.powerKw,
            reliabilityScore: station.reliabilityScore,
          },
        ]
      : [];
  });
}

export function recommendChargingStop(
  chargingRequired: boolean,
  candidates: ChargerCandidate[],
): ChargerCandidate | null {
  return chargingRequired ? (candidates[0] ?? null) : null;
}
