import type { RecommendationDecision } from "@ev-mobility/recommendation-engine";

const recommendations = new Map<string, RecommendationDecision>();

export function saveRecommendation(
  recommendation: RecommendationDecision,
): RecommendationDecision {
  recommendations.set(recommendation.recommendationId, recommendation);
  return recommendation;
}

export function findRecommendation(
  recommendationId: string,
): RecommendationDecision | null {
  return recommendations.get(recommendationId) ?? null;
}

export function resetRecommendationStore(): void {
  recommendations.clear();
}
