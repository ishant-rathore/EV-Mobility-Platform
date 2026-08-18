<<<<<<< HEAD
// TODO: implement domain logic.
=======
import { estimateAdjustedConsumptionKwh, estimateBaseConsumptionKwh } from "./consumptionModel.js";
import { calculateEnergyBudget } from "./reserveMargin.js";

export interface EnergyEstimateInput {
  distanceKm: number;
  batteryCapacityKwh: number;
  usableBatteryCapacityKwh?: number;
  efficiencyWhPerKm: number;
  currentSocPercent: number;
  reserveSocPercent: number;
  availableEnergyKwh?: number;
  reserveEnergyKwh?: number;
  usableEnergyKwh?: number;
  trafficFactor?: number;
  environmentFactor?: number;
  auxiliaryLoadKwh?: number;
}

export interface EnergyEstimate {
  distanceKm: number;
  effectiveBatteryCapacityKwh: number;
  baseEnergyKwh: number;
  trafficFactor: number;
  environmentFactor: number;
  auxiliaryLoadKwh: number;
  requiredKwh: number;
  availableEnergyKwh: number;
  reserveEnergyKwh: number;
  usableEnergyKwh: number;
  projectedArrivalSocPercent: number;
  energyDeficitKwh: number;
  canReachDestinationWithoutCharging: boolean;
  chargingRequired: boolean;
}

export function estimateRouteEnergy(input: EnergyEstimateInput): EnergyEstimate {
  const trafficFactor = input.trafficFactor ?? 1;
  const environmentFactor = input.environmentFactor ?? 1;
  const auxiliaryLoadKwh = input.auxiliaryLoadKwh ?? 0;
  const baseEnergyKwh = estimateBaseConsumptionKwh(input.distanceKm, input.efficiencyWhPerKm);
  const requiredKwh = estimateAdjustedConsumptionKwh({
    distanceKm: input.distanceKm,
    efficiencyWhPerKm: input.efficiencyWhPerKm,
    trafficFactor,
    environmentFactor,
    auxiliaryLoadKwh,
  });
  const budget = calculateEnergyBudget(input);
  const projectedArrivalSocPercent =
    ((budget.availableEnergyKwh - requiredKwh) / budget.effectiveBatteryCapacityKwh) * 100;

  return {
    distanceKm: input.distanceKm,
    effectiveBatteryCapacityKwh: Number(budget.effectiveBatteryCapacityKwh.toFixed(2)),
    baseEnergyKwh: Number(baseEnergyKwh.toFixed(2)),
    trafficFactor: Number(trafficFactor.toFixed(2)),
    environmentFactor: Number(environmentFactor.toFixed(2)),
    auxiliaryLoadKwh: Number(auxiliaryLoadKwh.toFixed(2)),
    requiredKwh: Number(requiredKwh.toFixed(2)),
    availableEnergyKwh: Number(budget.availableEnergyKwh.toFixed(2)),
    reserveEnergyKwh: Number(budget.reserveEnergyKwh.toFixed(2)),
    usableEnergyKwh: Number(budget.usableEnergyKwh.toFixed(2)),
    projectedArrivalSocPercent: Number(Math.max(0, projectedArrivalSocPercent).toFixed(1)),
    energyDeficitKwh: Number(Math.max(0, requiredKwh - budget.availableEnergyKwh).toFixed(2)),
    canReachDestinationWithoutCharging: requiredKwh <= budget.availableEnergyKwh,
    chargingRequired: requiredKwh > budget.usableEnergyKwh,
  };
}
>>>>>>> junior/main
