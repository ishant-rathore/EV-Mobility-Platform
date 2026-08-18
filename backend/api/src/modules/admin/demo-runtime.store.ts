export const DEMO_SOURCE_MODES = ["REAL", "DEMO", "SIMULATOR"] as const;
export type DemoSourceMode = (typeof DEMO_SOURCE_MODES)[number];

export const DEMO_TRAFFIC_LEVELS = ["MEDIUM", "HIGH"] as const;
export type DemoTrafficLevel = (typeof DEMO_TRAFFIC_LEVELS)[number];

export interface DemoRuntimeState {
  requestedMode: DemoSourceMode;
  effectiveMode: DemoSourceMode;
  frozen: boolean;
  frozenAt: string | null;
  trafficOverrides: Record<string, DemoTrafficLevel>;
  lastAction: string;
  updatedAt: string;
  warnings: string[];
}

const trafficOverrides = new Map<string, DemoTrafficLevel>();

let requestedMode: DemoSourceMode = "DEMO";
let frozen = false;
let frozenAt: string | null = null;
let lastAction = "Demo runtime initialized";
let updatedAt = new Date().toISOString();

function touch(action: string): void {
  lastAction = action;
  updatedAt = new Date().toISOString();
}

function effectiveModeFor(mode: DemoSourceMode): DemoSourceMode {
  // A live traffic/charger provider is not configured in the P0 repository.
  // Preserve the user's request, but never label demo data as live.
  return mode === "REAL" ? "DEMO" : mode;
}

export function getDemoRuntimeState(): DemoRuntimeState {
  const effectiveMode = effectiveModeFor(requestedMode);
  return {
    requestedMode,
    effectiveMode,
    frozen,
    frozenAt,
    trafficOverrides: Object.fromEntries(trafficOverrides),
    lastAction,
    updatedAt,
    warnings:
      requestedMode === "REAL" && effectiveMode !== "REAL"
        ? ["REAL mode was requested, but no verified live provider is configured. DEMO fallback remains active."]
        : [],
  };
}

export function setDemoSourceMode(mode: DemoSourceMode): DemoRuntimeState {
  requestedMode = mode;
  touch(`Requested source mode ${mode}`);
  return getDemoRuntimeState();
}

export function setDemoFrozen(nextFrozen: boolean): DemoRuntimeState {
  frozen = nextFrozen;
  frozenAt = nextFrozen ? new Date().toISOString() : null;
  touch(nextFrozen ? "Data frozen for presentation" : "Data updates resumed");
  return getDemoRuntimeState();
}

export function isDemoDataFrozen(): boolean {
  return frozen;
}

export function setDemoTrafficLevel(
  routeId: string,
  level: DemoTrafficLevel,
): DemoRuntimeState {
  trafficOverrides.set(routeId, level);
  touch(`Set ${routeId} traffic to ${level}`);
  return getDemoRuntimeState();
}

export function getDemoTrafficLevel(routeId: string): DemoTrafficLevel | undefined {
  return trafficOverrides.get(routeId);
}

export function resetDemoRuntimeState(): DemoRuntimeState {
  requestedMode = "DEMO";
  frozen = false;
  frozenAt = null;
  trafficOverrides.clear();
  touch("All mutable demo state reset");
  return getDemoRuntimeState();
}
