import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../api/client";
import { useJourneyStore } from "../store/journey.store";
import type { IntegratedJourneyEvaluationInput, RouteEvaluation } from "../types/journey";

export function useJourneyPlan() {
  const setRouteEvaluation = useJourneyStore((state) => state.setRouteEvaluation);
  return useMutation({
    mutationFn: (input: IntegratedJourneyEvaluationInput) =>
      apiRequest<RouteEvaluation>("/journeys/evaluate", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: setRouteEvaluation,
  });
}
