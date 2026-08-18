export const ChargerStatus = {
  AVAILABLE: "AVAILABLE",
  OCCUPIED: "OCCUPIED",
  OFFLINE: "OFFLINE",
  FAULTED: "FAULTED",
} as const;

export type ChargerStatus = (typeof ChargerStatus)[keyof typeof ChargerStatus];
