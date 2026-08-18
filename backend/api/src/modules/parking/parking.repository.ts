import type { ParkingBayRecord } from "./parking.types.js";

export interface ParkingRepository {
  list(stationId?: string): ParkingBayRecord[];
  findById(id: string): ParkingBayRecord | null;
}

const DEMO_PARKING_BAYS: ParkingBayRecord[] = [
  {
    id: "parking-demo-1-a",
    stationId: "station-demo-1",
    label: "EV-A1",
    isEvEnabled: true,
    deviceId: "parking-device-demo-1-a",
    sourceMode: "DEMO",
    isSimulated: true,
  },
  {
    id: "parking-demo-1-b",
    stationId: "station-demo-1",
    label: "EV-A2",
    isEvEnabled: true,
    deviceId: "parking-device-demo-1-b",
    sourceMode: "DEMO",
    isSimulated: true,
  },
  {
    id: "parking-demo-2-a",
    stationId: "station-demo-2",
    label: "EV-B1",
    isEvEnabled: true,
    deviceId: "parking-device-demo-2-a",
    sourceMode: "DEMO",
    isSimulated: true,
  },
];

export class MemoryParkingRepository implements ParkingRepository {
  list(stationId?: string): ParkingBayRecord[] {
    return DEMO_PARKING_BAYS.filter((bay) => !stationId || bay.stationId === stationId).map(
      (bay) => ({ ...bay }),
    );
  }

  findById(id: string): ParkingBayRecord | null {
    const bay = DEMO_PARKING_BAYS.find((candidate) => candidate.id === id);
    return bay ? { ...bay } : null;
  }
}

export const parkingRepository: ParkingRepository = new MemoryParkingRepository();
