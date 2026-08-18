<<<<<<< HEAD
// TODO: implement domain logic.
=======
export interface ConsumptionModelInput {
  distanceKm: number;
  efficiencyWhPerKm: number;
  trafficFactor: number;
  environmentFactor: number;
  auxiliaryLoadKwh: number;
}

export function estimateBaseConsumptionKwh(
  distanceKm: number,
  efficiencyWhPerKm: number,
): number {
  return (distanceKm * efficiencyWhPerKm) / 1_000;
}

export function estimateAdjustedConsumptionKwh(input: ConsumptionModelInput): number {
  return (
    estimateBaseConsumptionKwh(input.distanceKm, input.efficiencyWhPerKm) *
      input.trafficFactor *
      input.environmentFactor +
    input.auxiliaryLoadKwh
  );
}
>>>>>>> junior/main
