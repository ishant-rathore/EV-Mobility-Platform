import type {
  ChargerOperationalStatus,
  ReliabilityInput,
} from "@ev-mobility/charger-reliability";
import type { ConnectorType, SourceMode } from "../../shared/enums.js";

export interface StationChargerRecord {
  id: string;
  connectorType: ConnectorType;
  status: ChargerOperationalStatus;
  powerKw: number;
  pricePerKwh: number;
  reliabilityBaseline: Omit<ReliabilityInput, "chargerId" | "status">;
}

export interface StationRecord {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  availableChargers: number;
  powerKw: number;
  reliabilityScore: number;
  pricePerKwh: number;
  estimatedWaitMinutes?: number;
  sourceMode?: SourceMode;
  isSimulated?: boolean;
  chargers?: StationChargerRecord[];
}

export interface StationProvider {
  listStations(): Promise<StationRecord[]>;
}
