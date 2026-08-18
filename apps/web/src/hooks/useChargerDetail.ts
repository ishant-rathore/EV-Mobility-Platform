import { useQuery } from "@tanstack/react-query";
import type { RankedChargingCandidate } from "@ev-mobility/shared-types";
import { apiRequest } from "../services/api.client";

/** Powers the charger details screen (`/chargers/:chargerId`). */
export function useChargerDetail(chargerId: string | undefined) {
  return useQuery({
    queryKey: ["chargers", chargerId] as const,
    queryFn: () => apiRequest<RankedChargingCandidate>(`/chargers/${chargerId}`),
    enabled: Boolean(chargerId),
  });
}
