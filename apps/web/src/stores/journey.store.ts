import { create } from "zustand";
import type { IntegratedJourneyEvaluationInput, RouteEvaluation } from "../types/journey";

interface JourneyState {
  routeEvaluation: RouteEvaluation | null;
  /** The request that produced `routeEvaluation`, kept so a live fault event can replay it (Module 8). */
  lastRequest: IntegratedJourneyEvaluationInput | null;
  setRouteEvaluation: (
    routeEvaluation: RouteEvaluation,
    request?: IntegratedJourneyEvaluationInput,
  ) => void;
}

export const useJourneyStore = create<JourneyState>((set) => ({
  routeEvaluation: null,
  lastRequest: null,
  setRouteEvaluation: (routeEvaluation, request) =>
    set((state) => ({ routeEvaluation, lastRequest: request ?? state.lastRequest })),
}));
