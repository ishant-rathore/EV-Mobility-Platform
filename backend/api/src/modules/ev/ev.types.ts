import type { ConnectorType, SourceMode, VehicleClass } from "../../shared/enums.js";

/** The stored description of a vehicle. Contains no derived values. */
export interface EvProfile {
  name: string;
  vehicleClass: VehicleClass;
  connectorTypes: ConnectorType[];
  batteryCapacityKwh: number;
  batteryHealthPercent: number;
  efficiencyWhPerKm: number;
  currentSocPercent: number;
  reserveSocPercent: number;
}

/** Everything derived from an {@link EvProfile} by the battery engine. */
export interface BatteryState {
  usableCapacityKwh: number;
  availableEnergyKwh: number;
  reserveEnergyKwh: number;
  usableAboveReserveKwh: number;
  /** Display only. Ignores the safety reserve. */
  estimatedRangeKm: number;
  /** Reachability. This is the number routing and recommendation must use. */
  rangeToReserveKm: number;
}

/** A stored vehicle plus its computed battery state. The API response shape. */
export interface EvProfileSummary extends EvProfile, BatteryState {
  vehicleId: string;
  isDefault: boolean;
  sourceMode: SourceMode;
  updatedAt: string;
}

export interface EvVehicleRecord extends EvProfile {
  id: string;
  isDefault: boolean;
  sourceMode: SourceMode;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * The Module 1 → Module 2 handoff. A superset of the routing module's
 * EnergyEstimateInput, so routing can spread this straight into its own input
 * instead of re-deriving energy from raw SOC.
 */
export interface EvEnergyContext {
  vehicleId: string;
  vehicleClass: VehicleClass;
  connectorTypes: ConnectorType[];
  batteryCapacityKwh: number;
  usableCapacityKwh: number;
  efficiencyWhPerKm: number;
  currentSocPercent: number;
  reserveSocPercent: number;
  availableEnergyKwh: number;
  reserveEnergyKwh: number;
  usableAboveReserveKwh: number;
  rangeToReserveKm: number;
}
