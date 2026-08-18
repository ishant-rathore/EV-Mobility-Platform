import type { EnergyEstimate, EnergyEstimateInput } from "./routing.types.js";

export function estimateRouteEnergy(input: EnergyEstimateInput): EnergyEstimate {
  const requiredKwh = (input.distanceKm * input.efficiencyWhPerKm) / 1000;
  const availableKwh = input.batteryCapacityKwh * (input.currentSocPercent / 100);
  const projectedArrivalSocPercent =
    ((availableKwh - requiredKwh) / input.batteryCapacityKwh) * 100;

  return {
    distanceKm: input.distanceKm,
    requiredKwh: Number(requiredKwh.toFixed(2)),
    projectedArrivalSocPercent: Number(projectedArrivalSocPercent.toFixed(1)),
    chargingRequired: projectedArrivalSocPercent < input.reserveSocPercent,
  };
}
