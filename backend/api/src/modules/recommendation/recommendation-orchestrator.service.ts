import {
  orchestrateRecommendation,
  type RecommendationChargerInput,
  type RecommendationDecision,
  type RecommendationSourceMode,
} from "@ev-mobility/recommendation-engine";
import type { ChargingCandidateRecommendation } from "../charging/charging.service.js";
import type { EvaluatedRoute } from "../routing/routing.types.js";
import type { DiversificationDecision } from "../traffic/diversification.service.js";
import { saveRecommendation } from "./recommendation.store.js";

interface ChargingDecisionInput {
  required: boolean;
  isSimulated: boolean;
  primary: ChargingCandidateRecommendation | null;
  backup: ChargingCandidateRecommendation | null;
}

export interface JourneyRecommendationContext {
  generatedAt: string;
  routeSourceMode: "DEMO" | "OSRM";
  routes: readonly EvaluatedRoute[];
  diversification: DiversificationDecision;
  charging: ChargingDecisionInput;
}

function toRecommendationCharger(
  candidate: ChargingCandidateRecommendation | null,
): RecommendationChargerInput | null {
  return candidate
    ? {
        chargerId: candidate.chargerId,
        stationId: candidate.stationId,
        stationName: candidate.stationName,
        connectorType: candidate.connectorType,
        powerKw: candidate.powerKw,
        estimatedWaitMinutes: candidate.estimatedWaitMinutes,
        detourKm: candidate.detourKm,
        pricePerKwh: candidate.pricePerKwh,
        reliabilityScore: candidate.reliability.score,
        reliabilityGrade: candidate.reliability.grade,
        reliabilityFreshness: candidate.reliability.freshness,
        reliabilitySourceMode: candidate.reliability.sourceMode,
        reliabilityReasons: candidate.reliability.reasons,
        reliabilityWarnings: candidate.reliability.warnings,
      }
    : null;
}

export function composeJourneyRecommendation(
  context: JourneyRecommendationContext,
): RecommendationDecision {
  const hasDemoTraffic = context.routes.some((route) => route.traffic?.sourceMode === "DEMO");
  const isSimulated = context.charging.isSimulated || hasDemoTraffic;
  const sourceMode: RecommendationSourceMode = isSimulated
    ? context.routeSourceMode === "DEMO"
      ? "DEMO"
      : "MIXED"
    : "LIVE";

  return saveRecommendation(orchestrateRecommendation({
    recommendationId: crypto.randomUUID(),
    generatedAt: context.generatedAt,
    sourceMode,
    isSimulated,
    selectedRouteId: context.diversification.recommendedRouteId,
    routes: context.routes.map((route) => {
      const diversified = context.diversification.candidates.find(
        (candidate) => candidate.routeId === route.routeId,
      );
      return {
        routeId: route.routeId,
        name: route.name,
        estimatedEtaMinutes: route.estimatedEtaMinutes,
        estimatedArrivalSocPercent: route.estimatedArrivalSocPercent,
        estimatedEnergyKwh: route.estimatedEnergyKwh,
        chargingRequired: route.chargingRequired,
        ...(route.traffic
          ? {
              trafficHorizon: route.traffic.horizon,
              trafficLevel: route.traffic.predictedLevel,
            }
          : {}),
        ...(diversified
          ? { projectedUtilizationPercent: diversified.projectedUtilizationPercent }
          : {}),
      };
    }),
    chargingRequired: context.charging.required,
    primaryCharger: toRecommendationCharger(context.charging.primary),
    backupCharger: toRecommendationCharger(context.charging.backup),
  }));
}
