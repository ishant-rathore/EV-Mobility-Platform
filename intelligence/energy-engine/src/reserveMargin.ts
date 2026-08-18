<<<<<<< HEAD
// TODO: implement domain logic.
=======
export interface EnergyBudget {
  effectiveBatteryCapacityKwh: number;
  availableEnergyKwh: number;
  reserveEnergyKwh: number;
  usableEnergyKwh: number;
}

export function calculateEnergyBudget(input: {
  batteryCapacityKwh: number;
  usableBatteryCapacityKwh?: number;
  currentSocPercent: number;
  reserveSocPercent: number;
  availableEnergyKwh?: number;
  reserveEnergyKwh?: number;
  usableEnergyKwh?: number;
}): EnergyBudget {
  const effectiveBatteryCapacityKwh = input.usableBatteryCapacityKwh ?? input.batteryCapacityKwh;
  const availableEnergyKwh =
    input.availableEnergyKwh ?? effectiveBatteryCapacityKwh * (input.currentSocPercent / 100);
  const reserveEnergyKwh =
    input.reserveEnergyKwh ?? effectiveBatteryCapacityKwh * (input.reserveSocPercent / 100);

  return {
    effectiveBatteryCapacityKwh,
    availableEnergyKwh,
    reserveEnergyKwh,
    usableEnergyKwh:
      input.usableEnergyKwh ?? Math.max(0, availableEnergyKwh - reserveEnergyKwh),
  };
}
>>>>>>> junior/main
