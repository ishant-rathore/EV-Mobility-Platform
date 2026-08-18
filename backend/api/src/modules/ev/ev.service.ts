import { AppError } from "../../shared/errors.js";
import { calculateBatteryState } from "@ev-mobility/energy-engine";
import {
  MAX_SOC_PERCENT,
  MIN_SOC_PERCENT,
} from "./ev.constants.js";
import type { BatteryState, EvEnergyContext, EvProfile, EvProfileSummary } from "./ev.types.js";

/**
 * Rejects profiles the battery maths cannot honestly describe.
 * Zod already guards the HTTP boundary; this guards every other caller.
 */
export function assertUsableProfile(profile: EvProfile): void {
  if (!Number.isFinite(profile.currentSocPercent)) {
    throw new AppError("State of charge must be a number.", 400, "EV_SOC_OUT_OF_RANGE");
  }

  if (profile.currentSocPercent < MIN_SOC_PERCENT || profile.currentSocPercent > MAX_SOC_PERCENT) {
    throw new AppError(
      `State of charge must be between ${MIN_SOC_PERCENT} and ${MAX_SOC_PERCENT}.`,
      400,
      "EV_SOC_OUT_OF_RANGE",
    );
  }

  if (!Number.isFinite(profile.efficiencyWhPerKm) || profile.efficiencyWhPerKm <= 0) {
    throw new AppError(
      "Efficiency must be greater than zero.",
      400,
      "EV_EFFICIENCY_INVALID",
    );
  }

  if (!Number.isFinite(profile.batteryCapacityKwh) || profile.batteryCapacityKwh <= 0) {
    throw new AppError("Battery capacity must be greater than zero.", 400, "EV_CAPACITY_INVALID");
  }

  if (!Number.isFinite(profile.batteryHealthPercent) || profile.batteryHealthPercent <= 0) {
    throw new AppError("Battery health must be greater than zero.", 400, "EV_HEALTH_INVALID");
  }
}

/**
 * Derives every energy figure from a stored profile.
 *
 * A reserve above the current charge is not an error — it means the driver is
 * already inside the reserve. That case yields zero usable energy rather than a
 * negative range, so downstream reachability checks fail closed.
 */
export function computeBatteryState(profile: EvProfile): BatteryState {
  assertUsableProfile(profile);
  return calculateBatteryState(profile);
}

/** Profile plus derived battery state, without persistence concerns. */
export function summarizeEvProfile(profile: EvProfile) {
  return { ...profile, ...computeBatteryState(profile) };
}

/** True when the driver cannot reach the distance without dipping into reserve. */
export function requiresChargingStop(profile: EvProfile, distanceKm: number): boolean {
  return distanceKm > computeBatteryState(profile).rangeToReserveKm;
}

/** Narrows a full summary to the fields Module 2 (routing/energy) consumes. */
export function toEnergyContext(summary: EvProfileSummary): EvEnergyContext {
  return {
    vehicleId: summary.vehicleId,
    vehicleClass: summary.vehicleClass,
    connectorTypes: summary.connectorTypes,
    batteryCapacityKwh: summary.batteryCapacityKwh,
    usableCapacityKwh: summary.usableCapacityKwh,
    efficiencyWhPerKm: summary.efficiencyWhPerKm,
    currentSocPercent: summary.currentSocPercent,
    reserveSocPercent: summary.reserveSocPercent,
    availableEnergyKwh: summary.availableEnergyKwh,
    reserveEnergyKwh: summary.reserveEnergyKwh,
    usableAboveReserveKwh: summary.usableAboveReserveKwh,
    rangeToReserveKm: summary.rangeToReserveKm,
  };
}
