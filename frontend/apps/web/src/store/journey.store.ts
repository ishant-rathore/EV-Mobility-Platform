import { create } from "zustand";
import type { JourneyRecommendation } from "../types/journey";

interface JourneyState {
  recommendation: JourneyRecommendation | null;
  setRecommendation: (recommendation: JourneyRecommendation) => void;
}

export const useJourneyStore = create<JourneyState>((set) => ({
  recommendation: null,
  setRecommendation: (recommendation) => set({ recommendation }),
}));
