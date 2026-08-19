import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../services/api.client";
import { useJourneyStore } from "../stores/journey.store";
import type { IntegratedJourneyEvaluationInput, RouteEvaluation } from "../types/journey";

export function useJourneyPlan() {
  const setRouteEvaluation = useJourneyStore((state) => state.setRouteEvaluation);
  return useMutation({
    mutationFn: (input: IntegratedJourneyEvaluationInput) =>
      apiRequest<RouteEvaluation>("/journeys/evaluate", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: (data, variables) => setRouteEvaluation(data, variables),
  });
}
