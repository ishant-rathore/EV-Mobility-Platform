export interface DemoAccessCommand {
  id: string;
  reservationId: string;
  parkingBayId: string;
  deviceId: string;
  command: "UNLOCK_DEMO_FLAP";
  status: "ACKNOWLEDGED";
  issuedAt: string;
  sourceMode: "SIMULATOR";
  isSimulated: true;
  disclaimer: string;
}
