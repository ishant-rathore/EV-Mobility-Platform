import { create } from "zustand";
import type { RouteEvaluation } from "../types/journey";

interface JourneyState {
  routeEvaluation: RouteEvaluation | null;
  setRouteEvaluation: (routeEvaluation: RouteEvaluation) => void;
}

export const useJourneyStore = create<JourneyState>((set) => ({
  routeEvaluation: null,
  setRouteEvaluation: (routeEvaluation) => set({ routeEvaluation }),
}));
