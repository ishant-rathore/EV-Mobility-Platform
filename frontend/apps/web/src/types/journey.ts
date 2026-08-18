export interface JourneyRecommendation {
  recommendationId: string;
  energy: {
    distanceKm: number;
    requiredKwh: number;
    projectedArrivalSocPercent: number;
    chargingRequired: boolean;
  };
  recommendedStation: {
    id: string;
    name: string;
    availableChargers: number;
    powerKw: number;
    reliabilityScore: number;
  } | null;
  explanation: string;
}
