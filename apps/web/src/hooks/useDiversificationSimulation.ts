import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../services/api.client";
import type { DiversificationSimulation } from "../types/diversification";

export function useDiversificationSimulation() {
  return useQuery({
    queryKey: ["traffic", "diversification", "twenty-request-demo"],
    queryFn: () =>
      apiRequest<DiversificationSimulation>("/traffic/diversify/simulate", {
        method: "POST",
        body: JSON.stringify({
          requestCount: 20,
          demandUnitsPerRequest: 20,
          vehicleClasses: ["CAR", "BIKE", "TRUCK", "COMMERCIAL"],
        }),
      }),
    staleTime: 30_000,
  });
}
