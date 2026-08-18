export const ChargerStatus = {
  AVAILABLE: "AVAILABLE",
  OCCUPIED: "OCCUPIED",
  OFFLINE: "OFFLINE",
  FAULTED: "FAULTED",
} as const;

export type ChargerStatus = (typeof ChargerStatus)[keyof typeof ChargerStatus];

/** Vehicle class. Also consumed by the diversification engine for road eligibility. */
export const VehicleClass = {
  CAR: "CAR",
  BIKE: "BIKE",
  TRUCK: "TRUCK",
  COMMERCIAL: "COMMERCIAL",
} as const;

export type VehicleClass = (typeof VehicleClass)[keyof typeof VehicleClass];

export const ConnectorType = {
  CCS2: "CCS2",
  CHADEMO: "CHADEMO",
  TYPE2: "TYPE2",
  BHARAT_DC_001: "BHARAT_DC_001",
  BHARAT_AC_001: "BHARAT_AC_001",
  LEV_AC: "LEV_AC",
} as const;

export type ConnectorType = (typeof ConnectorType)[keyof typeof ConnectorType];

/**
 * Provenance of a dynamic value. Required on anything that could be mistaken
 * for a measurement, so seeded demo data is never presented as real.
 */
export const SourceMode = {
  REAL: "REAL",
  OCPP: "OCPP",
  DEMO: "DEMO",
  SIMULATOR: "SIMULATOR",
} as const;

export type SourceMode = (typeof SourceMode)[keyof typeof SourceMode];

export const VEHICLE_CLASSES = ["CAR", "BIKE", "TRUCK", "COMMERCIAL"] as const;

export const CONNECTOR_TYPES = [
  "CCS2",
  "CHADEMO",
  "TYPE2",
  "BHARAT_DC_001",
  "BHARAT_AC_001",
  "LEV_AC",
] as const;

export const SOURCE_MODES = ["REAL", "OCPP", "DEMO", "SIMULATOR"] as const;
