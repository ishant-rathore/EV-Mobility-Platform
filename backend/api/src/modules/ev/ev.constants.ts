/**
 * Tunable limits for the EV profile and battery engine.
 * Nothing in this module may hardcode these values inline.
 */

export const MIN_SOC_PERCENT = 0;
export const MAX_SOC_PERCENT = 100;

/** Energy held back so the driver never arrives at exactly zero. */
export const DEFAULT_RESERVE_SOC_PERCENT = 10;
export const MIN_RESERVE_SOC_PERCENT = 0;
/** Above this the vehicle is unusable for planning, so reject it as a typo. */
export const MAX_RESERVE_SOC_PERCENT = 50;

/** Battery health as a percentage of nominal capacity. 100 = as-new. */
export const DEFAULT_BATTERY_HEALTH_PERCENT = 100;
export const MIN_BATTERY_HEALTH_PERCENT = 50;
export const MAX_BATTERY_HEALTH_PERCENT = 100;

/** Sanity bounds. Wider than any real vehicle; they only catch unit mistakes. */
export const MAX_BATTERY_CAPACITY_KWH = 1000;
export const MAX_EFFICIENCY_WH_PER_KM = 2000;

/** Energy values are reported to this many decimals. */
export const ENERGY_DECIMAL_PLACES = 2;

export const WH_PER_KWH = 1000;

/** No auth/user-scoping yet (see work.md §8) — every seeded vehicle hangs off this demo user. */
export const DEMO_USER_ID = "user-demo-1";
