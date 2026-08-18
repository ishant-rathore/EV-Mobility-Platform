import {
  calculateReliability,
  type ChargerOperationalStatus,
  type ReliabilityInput,
  type ReliabilityScore,
  type ReliabilitySourceMode,
} from "@ev-mobility/charger-reliability";

interface TelemetryReliabilitySignal {
  chargerId: string;
  status: ChargerOperationalStatus;
  temperatureCelsius?: number;
  recordedAt: string;
  sourceMode?: ReliabilitySourceMode;
  isSimulated?: boolean;
}

const operationalProfiles = new Map<string, ReliabilityInput>();
const latestTelemetry = new Map<string, TelemetryReliabilitySignal>();

function neutralProfile(chargerId: string): ReliabilityInput {
  return {
    chargerId,
    status: "AVAILABLE",
    uptimePercent: 50,
    successfulSessionsPercent: 50,
    heartbeatFreshnessPercent: 50,
    faultRatePercent: 50,
    recentFaultCount: 0,
    telemetryCompletenessPercent: 40,
    sourceMode: "DEMO",
  };
}

function ageSeconds(recordedAt: string, now: Date): number {
  const recordedTime = new Date(recordedAt).getTime();
  if (!Number.isFinite(recordedTime)) return Number.POSITIVE_INFINITY;
  return Math.max(0, (now.getTime() - recordedTime) / 1_000);
}

export function assessChargerReliability(
  input: ReliabilityInput & { chargerId: string },
  now: Date = new Date(),
): ReliabilityScore {
  const normalizedInput = { ...input, calculatedAt: now.toISOString() };
  operationalProfiles.set(input.chargerId, normalizedInput);
  return calculateReliability(normalizedInput);
}

export function ingestChargerTelemetry(
  telemetry: TelemetryReliabilitySignal,
  receivedAt: Date = new Date(),
): ReliabilityScore {
  latestTelemetry.set(telemetry.chargerId, telemetry);
  return getChargerReliability(telemetry.chargerId, receivedAt)!;
}

export function getChargerReliability(
  chargerId: string,
  now: Date = new Date(),
): ReliabilityScore | null {
  const profile = operationalProfiles.get(chargerId);
  const telemetry = latestTelemetry.get(chargerId);
  if (!profile && !telemetry) return null;

  if (!telemetry) {
    return calculateReliability({ ...(profile ?? neutralProfile(chargerId)), calculatedAt: now.toISOString() });
  }

  const base = profile ?? neutralProfile(chargerId);
  const heartbeatAgeSeconds = ageSeconds(telemetry.recordedAt, now);
  const telemetryIsStale = heartbeatAgeSeconds > 900;
  const sourceMode = telemetry.sourceMode ?? (telemetry.isSimulated ? "SIMULATOR" : base.sourceMode ?? "DEMO");
  const isFault = telemetry.status === "FAULT" || telemetry.status === "FAULTED";

  return calculateReliability({
    ...base,
    chargerId,
    status: telemetryIsStale ? "OFFLINE" : telemetry.status,
    heartbeatAgeSeconds,
    recentFaultCount: (base.recentFaultCount ?? 0) + (isFault ? 1 : 0),
    temperatureCelsius: telemetry.temperatureCelsius,
    telemetryCompletenessPercent: Math.max(base.telemetryCompletenessPercent ?? 0, 60),
    sourceMode,
    calculatedAt: now.toISOString(),
  });
}

export function listChargerReliability(now: Date = new Date()): ReliabilityScore[] {
  const chargerIds = new Set([...operationalProfiles.keys(), ...latestTelemetry.keys()]);
  return [...chargerIds]
    .map((chargerId) => getChargerReliability(chargerId, now))
    .filter((assessment): assessment is ReliabilityScore => assessment !== null)
    .sort((left, right) => right.score - left.score || (left.chargerId ?? "").localeCompare(right.chargerId ?? ""));
}

export function resetReliabilityStore(): void {
  operationalProfiles.clear();
  latestTelemetry.clear();
}

export { calculateReliability };
