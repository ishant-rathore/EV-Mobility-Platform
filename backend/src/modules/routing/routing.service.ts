import { estimateRouteEnergy } from "./energy.service.js";
import type { EnergyEstimateInput } from "./routing.types.js";

export function evaluateRoute(input: EnergyEstimateInput) {
  return {
    routeId: crypto.randomUUID(),
    energy: estimateRouteEnergy(input),
  };
}
