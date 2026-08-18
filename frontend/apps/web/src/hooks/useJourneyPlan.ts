import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../api/client";
import { useJourneyStore } from "../store/journey.store";
import type { JourneyRecommendation } from "../types/journey";

export interface JourneyPlanInput {
  distanceKm: number;
  batteryCapacityKwh: number;
  efficiencyWhPerKm: number;
  currentSocPercent: number;
  reserveSocPercent: number;
}

export function useJourneyPlan() {
  const setRecommendation = useJourneyStore((state) => state.setRecommendation);
  return useMutation({
    mutationFn: (input: JourneyPlanInput) =>
      apiRequest<JourneyRecommendation>("/journeys/plan", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: setRecommendation,
  });
}
