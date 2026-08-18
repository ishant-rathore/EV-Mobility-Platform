export type VehicleClass = "CAR" | "BIKE" | "TRUCK" | "COMMERCIAL";

export type ConnectorType =
  | "CCS2"
  | "CHADEMO"
  | "TYPE2"
  | "BHARAT_DC_001"
  | "BHARAT_AC_001"
  | "LEV_AC";

export type SourceMode = "REAL" | "OCPP" | "DEMO" | "SIMULATOR";

/** Mirrors the backend's EvProfileSummary — see docs/06-api/VEHICLE_API.md. */
export interface EvProfileSummary {
  vehicleId: string;
  name: string;
  vehicleClass: VehicleClass;
  connectorTypes: ConnectorType[];
  batteryCapacityKwh: number;
  batteryHealthPercent: number;
  efficiencyWhPerKm: number;
  currentSocPercent: number;
  reserveSocPercent: number;
  isDefault: boolean;
  sourceMode: SourceMode;
  updatedAt: string;
  usableCapacityKwh: number;
  availableEnergyKwh: number;
  reserveEnergyKwh: number;
  usableAboveReserveKwh: number;
  estimatedRangeKm: number;
  rangeToReserveKm: number;
}

export interface CreateVehicleInput {
  name: string;
  vehicleClass: VehicleClass;
  connectorTypes: ConnectorType[];
  batteryCapacityKwh: number;
  batteryHealthPercent?: number;
  efficiencyWhPerKm: number;
  currentSocPercent: number;
  reserveSocPercent?: number;
  isDefault?: boolean;
}
