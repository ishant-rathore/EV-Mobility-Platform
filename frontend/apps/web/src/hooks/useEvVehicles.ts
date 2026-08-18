import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../api/client";
import type { CreateVehicleInput, EvProfileSummary } from "../types/ev";

const VEHICLES_KEY = ["ev", "vehicles"] as const;

/** Saved vehicles for the demo driver. Powers the vehicle selector. */
export function useEvVehicles() {
  return useQuery({
    queryKey: VEHICLES_KEY,
    queryFn: () => apiRequest<EvProfileSummary[]>("/ev/vehicles"),
  });
}

export function useCreateEvVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateVehicleInput) =>
      apiRequest<EvProfileSummary>("/ev/vehicles", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: VEHICLES_KEY }),
  });
}

/** Updates SOC for one vehicle and refreshes the list so the battery card stays live. */
export function useUpdateVehicleSoc() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ vehicleId, currentSocPercent }: { vehicleId: string; currentSocPercent: number }) =>
      apiRequest<EvProfileSummary>(`/ev/vehicles/${vehicleId}/soc`, {
        method: "PATCH",
        body: JSON.stringify({ currentSocPercent }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: VEHICLES_KEY }),
  });
}
