import type { z } from "zod";
import type { evProfileSchema } from "./ev.schemas.js";

type EvProfileInput = z.infer<typeof evProfileSchema>;

export function summarizeEvProfile(profile: EvProfileInput) {
  const availableKwh = profile.batteryCapacityKwh * (profile.currentSocPercent / 100);
  return {
    ...profile,
    estimatedRangeKm: Math.floor((availableKwh * 1000) / profile.efficiencyWhPerKm),
  };
}
