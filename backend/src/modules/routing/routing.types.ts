export interface EnergyEstimateInput {
  distanceKm: number;
  batteryCapacityKwh: number;
  efficiencyWhPerKm: number;
  currentSocPercent: number;
  reserveSocPercent: number;
}

export interface EnergyEstimate {
  distanceKm: number;
  requiredKwh: number;
  projectedArrivalSocPercent: number;
  chargingRequired: boolean;
}
