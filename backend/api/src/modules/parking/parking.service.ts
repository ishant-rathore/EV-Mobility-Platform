import { parkingRepository } from "./parking.repository.js";

export function listParkingBays(stationId?: string) {
  return {
    sourceMode: "DEMO" as const,
    isSimulated: true as const,
    bays: parkingRepository.list(stationId),
    disclaimer: "Demo parking inventory; occupancy and access are simulated.",
  };
}
