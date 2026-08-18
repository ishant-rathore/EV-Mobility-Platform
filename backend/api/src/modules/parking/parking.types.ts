export interface ParkingBayRecord {
  id: string;
  stationId: string;
  label: string;
  isEvEnabled: boolean;
  deviceId: string | null;
  sourceMode: "DEMO";
  isSimulated: true;
}
