<<<<<<< HEAD
// TODO: implement module.
=======
import { DemoStationProvider } from "../../integrations/charging-providers/demo-station.provider.js";
import type { StationRecord } from "../../integrations/charging-providers/station.provider.js";
import { haversineDistanceKm, type Coordinates } from "../../shared/geo.js";
import type { ConnectorType } from "../../shared/enums.js";
import {
  evaluateAndRankChargingCandidates,
  type ChargingCandidateInput,
  type RankedChargingCandidate,
} from "@ev-mobility/station-ranking";
import {
  selectBackupCharger,
  type ReliabilityScore,
} from "@ev-mobility/charger-reliability";
import {
  assessChargerReliability,
  getChargerReliability,
} from "../reliability/reliability.service.js";
import { rankStations } from "./station-ranking.service.js";

const provider = new DemoStationProvider();

export async function findChargingStations(options: {
  minimumPowerKw?: number;
  onlyAvailable?: boolean;
}) {
  const stations = await provider.listStations();
  return rankStations(
    stations.filter(
      (station) =>
        (!options.minimumPowerKw || station.powerKw >= options.minimumPowerKw) &&
        (!options.onlyAvailable || station.availableChargers > 0),
    ),
  );
}

export interface ChargingCandidateRecommendation extends RankedChargingCandidate {
  stationLatitude: number;
  stationLongitude: number;
  stationSourceMode: "REAL" | "OCPP" | "DEMO" | "SIMULATOR";
  isSimulated: boolean;
  reliability: ReliabilityScore;
}

export interface ChargingIntelligenceInput {
  stationIds?: readonly string[];
  connectorTypes: readonly ConnectorType[];
  minimumPowerKw?: number;
  routeGeometry?: readonly Coordinates[];
  origin?: Coordinates;
  maximumReachKm?: number;
  now?: Date;
}

export interface ChargingIntelligenceResult {
  sourceMode: "DEMO";
  isSimulated: true;
  generatedAt: string;
  primary: ChargingCandidateRecommendation | null;
  backup: ChargingCandidateRecommendation | null;
  candidates: ChargingCandidateRecommendation[];
  excludedCandidates: ChargingCandidateRecommendation[];
  disclaimer: string;
}

function stationDetourKm(station: StationRecord, routeGeometry?: readonly Coordinates[]): number {
  if (!routeGeometry?.length) return 0;
  const nearestDistance = Math.min(
    ...routeGeometry.map((point) => haversineDistanceKm(point, station)),
  );
  return Number((nearestDistance * 2).toFixed(1));
}

function stationReachable(
  station: StationRecord,
  origin?: Coordinates,
  maximumReachKm?: number,
): boolean {
  if (!origin || maximumReachKm === undefined) return true;
  const estimatedRoadDistanceKm = haversineDistanceKm(origin, station) * 1.15;
  return estimatedRoadDistanceKm <= maximumReachKm;
}

function reliabilityFor(
  charger: NonNullable<StationRecord["chargers"]>[number],
  now: Date,
): ReliabilityScore {
  return (
    getChargerReliability(charger.id, now) ??
    assessChargerReliability(
      {
        ...charger.reliabilityBaseline,
        chargerId: charger.id,
        status: charger.status,
      },
      now,
    )
  );
}

/**
 * Module 05 orchestration boundary. It applies route and vehicle hard filters,
 * then consumes Module 06 reliability assessments for primary and backup choice.
 */
export async function recommendChargingCandidates(
  input: ChargingIntelligenceInput,
): Promise<ChargingIntelligenceResult> {
  const now = input.now ?? new Date();
  const stations = await provider.listStations();
  const allowedStationIds = input.stationIds ? new Set(input.stationIds) : null;
  const detailedCandidates: ChargingCandidateRecommendation[] = stations
    .filter((station) => !allowedStationIds || allowedStationIds.has(station.id))
    .flatMap((station) =>
      (station.chargers ?? []).map((charger) => {
        const reliability = reliabilityFor(charger, now);
        const candidate: ChargingCandidateInput = {
          stationId: station.id,
          stationName: station.name,
          chargerId: charger.id,
          connectorType: charger.connectorType,
          status: reliability.status,
          availablePorts: reliability.status === "AVAILABLE" ? 1 : 0,
          powerKw: charger.powerKw,
          pricePerKwh: charger.pricePerKwh,
          detourKm: stationDetourKm(station, input.routeGeometry),
          estimatedWaitMinutes: station.estimatedWaitMinutes ?? 0,
          reachable: stationReachable(station, input.origin, input.maximumReachKm),
          reliabilityScore: reliability.score,
          reliabilityUsable: reliability.isUsable,
        };
        return {
          ...candidate,
          connectorCompatible: false,
          eligible: false,
          exclusionReasons: [],
          rank: null,
          score: null,
          scoreBreakdown: null,
          stationLatitude: station.latitude,
          stationLongitude: station.longitude,
          stationSourceMode: station.sourceMode ?? "DEMO",
          isSimulated: station.isSimulated ?? true,
          reliability,
        } satisfies ChargingCandidateRecommendation;
      }),
    );

  const evaluated = evaluateAndRankChargingCandidates(detailedCandidates, {
    connectorTypes: input.connectorTypes,
    minimumPowerKw: input.minimumPowerKw,
  });
  const detailsByCharger = new Map(
    detailedCandidates.map((candidate) => [candidate.chargerId, candidate]),
  );
  const hydrated = evaluated.map<ChargingCandidateRecommendation>((candidate) => ({
    ...detailsByCharger.get(candidate.chargerId)!,
    ...candidate,
  }));
  const candidates = hydrated.filter((candidate) => candidate.eligible);
  const excludedCandidates = hydrated.filter((candidate) => !candidate.eligible);
  const primary = candidates[0] ?? null;
  const backupSelection = selectBackupCharger(
    candidates.map((candidate) => ({
      chargerId: candidate.chargerId,
      reliability: candidate.reliability,
      connectorCompatible: candidate.connectorCompatible,
      reachable: candidate.reachable,
      detourKm: candidate.detourKm,
    })),
    primary?.chargerId,
  );
  const backup = backupSelection
    ? (candidates.find((candidate) => candidate.chargerId === backupSelection.chargerId) ?? null)
    : null;

  return {
    sourceMode: "DEMO",
    isSimulated: true,
    generatedAt: now.toISOString(),
    primary,
    backup,
    candidates,
    excludedCandidates,
    disclaimer:
      "Demo station data and prototype reliability heuristics; availability and wait time are not guaranteed.",
  };
}
>>>>>>> junior/main
