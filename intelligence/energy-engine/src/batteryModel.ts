export interface BatteryModelInput {
  batteryCapacityKwh: number;
  batteryHealthPercent: number;
  currentSocPercent: number;
  reserveSocPercent: number;
  efficiencyWhPerKm: number;
}

export interface BatteryModelResult {
  usableCapacityKwh: number;
  availableEnergyKwh: number;
  reserveEnergyKwh: number;
  usableAboveReserveKwh: number;
  estimatedRangeKm: number;
  rangeToReserveKm: number;
}

export function calculateBatteryState(input: BatteryModelInput): BatteryModelResult {
  const round = (value: number): number => Number(value.toFixed(2));
  const usableCapacityKwh = input.batteryCapacityKwh * (input.batteryHealthPercent / 100);
  const availableEnergyKwh = usableCapacityKwh * (input.currentSocPercent / 100);
  const reserveEnergyKwh = usableCapacityKwh * (input.reserveSocPercent / 100);
  const usableAboveReserveKwh = Math.max(0, availableEnergyKwh - reserveEnergyKwh);

  return {
    usableCapacityKwh: round(usableCapacityKwh),
    availableEnergyKwh: round(availableEnergyKwh),
    reserveEnergyKwh: round(reserveEnergyKwh),
    usableAboveReserveKwh: round(usableAboveReserveKwh),
    estimatedRangeKm: Math.floor((availableEnergyKwh * 1_000) / input.efficiencyWhPerKm),
    rangeToReserveKm: Math.floor((usableAboveReserveKwh * 1_000) / input.efficiencyWhPerKm),
  };
}
