import type { EnergyEstimate, EnergyEstimateInput } from "./routing.types.js";
import {
  estimateAdjustedConsumptionKwh,
  estimateBaseConsumptionKwh,
} from "./consumption-model.service.js";
import { calculateEnergyBudget } from "./reserve-margin.service.js";

export function estimateRouteEnergy(input: EnergyEstimateInput): EnergyEstimate {
  const trafficFactor = input.trafficFactor ?? 1.0;
  const environmentFactor = input.environmentFactor ?? 1.0;
  const auxiliaryLoadKwh = input.auxiliaryLoadKwh ?? 0;

  const baseEnergyKwh = estimateBaseConsumptionKwh(input.distanceKm, input.efficiencyWhPerKm);
  const requiredKwh = estimateAdjustedConsumptionKwh({
    distanceKm: input.distanceKm,
    efficiencyWhPerKm: input.efficiencyWhPerKm,
    trafficFactor,
    environmentFactor,
    auxiliaryLoadKwh,
  });
  const {
    effectiveBatteryCapacityKwh,
    availableEnergyKwh,
    reserveEnergyKwh,
    usableEnergyKwh,
  } = calculateEnergyBudget(input);

  const projectedArrivalSocPercent =
    ((availableEnergyKwh - requiredKwh) / effectiveBatteryCapacityKwh) * 100;

  const energyDeficitKwh = Math.max(0, requiredKwh - availableEnergyKwh);
  const canReachDestinationWithoutCharging = requiredKwh <= availableEnergyKwh;
  const chargingRequired = requiredKwh > usableEnergyKwh;

  return {
    distanceKm: input.distanceKm,
    effectiveBatteryCapacityKwh: Number(effectiveBatteryCapacityKwh.toFixed(2)),
    baseEnergyKwh: Number(baseEnergyKwh.toFixed(2)),
    trafficFactor: Number(trafficFactor.toFixed(2)),
    environmentFactor: Number(environmentFactor.toFixed(2)),
    auxiliaryLoadKwh: Number(auxiliaryLoadKwh.toFixed(2)),
    requiredKwh: Number(requiredKwh.toFixed(2)),
    availableEnergyKwh: Number(availableEnergyKwh.toFixed(2)),
    reserveEnergyKwh: Number(reserveEnergyKwh.toFixed(2)),
    usableEnergyKwh: Number(usableEnergyKwh.toFixed(2)),
    projectedArrivalSocPercent: Number(Math.max(0, projectedArrivalSocPercent).toFixed(1)),
    energyDeficitKwh: Number(energyDeficitKwh.toFixed(2)),
    canReachDestinationWithoutCharging,
    chargingRequired,
  };
}
