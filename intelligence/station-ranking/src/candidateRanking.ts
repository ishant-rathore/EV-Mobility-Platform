export type CandidateOperationalStatus =
  | "AVAILABLE"
  | "CONNECTED_NOT_CHARGING"
  | "CHARGING"
  | "FAULT"
  | "OFFLINE";

export interface ChargingCandidateInput {
  stationId: string;
  stationName: string;
  chargerId: string;
  connectorType: string;
  status: CandidateOperationalStatus;
  availablePorts: number;
  powerKw: number;
  pricePerKwh: number;
  detourKm: number;
  estimatedWaitMinutes: number;
  reachable: boolean;
  reliabilityScore: number;
  reliabilityUsable: boolean;
}

export interface CandidateRankingContext {
  connectorTypes: readonly string[];
  minimumPowerKw?: number;
}

export type CandidateExclusionReason =
  | "CONNECTOR_INCOMPATIBLE"
  | "BELOW_MINIMUM_POWER"
  | "UNREACHABLE"
  | "NO_AVAILABLE_PORT"
  | "FAULT_OR_OFFLINE"
  | "RELIABILITY_UNUSABLE";

export interface CandidateScoreBreakdown {
  reliability: number;
  availability: number;
  power: number;
  detour: number;
  wait: number;
  costPenalty: number;
  total: number;
}

export interface RankedChargingCandidate extends ChargingCandidateInput {
  connectorCompatible: boolean;
  eligible: boolean;
  exclusionReasons: CandidateExclusionReason[];
  rank: number | null;
  score: number | null;
  scoreBreakdown: CandidateScoreBreakdown | null;
}

function rounded(value: number): number {
  return Number(value.toFixed(2));
}

export function scoreChargingCandidate(
  candidate: ChargingCandidateInput,
): CandidateScoreBreakdown {
  const reliability = candidate.reliabilityScore * 0.45;
  const availability = Math.min(candidate.availablePorts, 4) * 3.75;
  const power = Math.min(candidate.powerKw / 120, 1) * 15;
  const detour = Math.max(0, 15 - candidate.detourKm * 1.5);
  const wait = Math.max(0, 10 - candidate.estimatedWaitMinutes * 0.5);
  const costPenalty = Math.min(candidate.pricePerKwh * 0.4, 12);
  const total = reliability + availability + power + detour + wait - costPenalty;

  return {
    reliability: rounded(reliability),
    availability: rounded(availability),
    power: rounded(power),
    detour: rounded(detour),
    wait: rounded(wait),
    costPenalty: rounded(costPenalty),
    total: rounded(total),
  };
}

function exclusionReasons(
  candidate: ChargingCandidateInput,
  context: CandidateRankingContext,
): CandidateExclusionReason[] {
  const reasons: CandidateExclusionReason[] = [];
  if (!context.connectorTypes.includes(candidate.connectorType)) {
    reasons.push("CONNECTOR_INCOMPATIBLE");
  }
  if (context.minimumPowerKw !== undefined && candidate.powerKw < context.minimumPowerKw) {
    reasons.push("BELOW_MINIMUM_POWER");
  }
  if (!candidate.reachable) reasons.push("UNREACHABLE");
  if (candidate.availablePorts < 1) reasons.push("NO_AVAILABLE_PORT");
  if (candidate.status === "FAULT" || candidate.status === "OFFLINE") {
    reasons.push("FAULT_OR_OFFLINE");
  }
  if (!candidate.reliabilityUsable) reasons.push("RELIABILITY_UNUSABLE");
  return reasons;
}

export function evaluateAndRankChargingCandidates(
  candidates: readonly ChargingCandidateInput[],
  context: CandidateRankingContext,
): RankedChargingCandidate[] {
  const evaluated = candidates.map<RankedChargingCandidate>((candidate) => {
    const reasons = exclusionReasons(candidate, context);
    const scoreBreakdown = reasons.length === 0 ? scoreChargingCandidate(candidate) : null;
    return {
      ...candidate,
      connectorCompatible: context.connectorTypes.includes(candidate.connectorType),
      eligible: reasons.length === 0,
      exclusionReasons: reasons,
      rank: null,
      score: scoreBreakdown?.total ?? null,
      scoreBreakdown,
    };
  });

  const eligible = evaluated
    .filter((candidate) => candidate.eligible)
    .sort(
      (left, right) =>
        (right.score ?? 0) - (left.score ?? 0) || left.chargerId.localeCompare(right.chargerId),
    )
    .map((candidate, index) => ({ ...candidate, rank: index + 1 }));
  const excluded = evaluated
    .filter((candidate) => !candidate.eligible)
    .sort((left, right) => left.chargerId.localeCompare(right.chargerId));

  return [...eligible, ...excluded];
}
