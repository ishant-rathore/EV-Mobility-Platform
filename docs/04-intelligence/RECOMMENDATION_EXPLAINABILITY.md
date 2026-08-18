# Recommendation explainability

Module 8 composes decisions already produced by Modules 1–6. It does not independently recalculate battery range, traffic, route eligibility, charger ranking, or reliability.

## Output contract

Every recommendation includes:

- a status: `READY`, `NO_CHARGING_REQUIRED`, `NO_FEASIBLE_CHARGER`, or `NO_ELIGIBLE_ROUTE`;
- the selected route and optional primary/backup charger identifiers;
- estimated arrival SOC, ETA, wait, detour, price, and reliability where available;
- source provenance and `isSimulated`;
- human-readable reasons and actionable warnings.

Reasons are derived from concrete inputs: Module 4 route selection, Module 3 traffic horizon/level, projected corridor utilization, Module 5 connector/power/wait/detour ranking, and Module 6 reliability score/freshness/reasons. They must not describe a value as live when its source is demo or simulated.

## Fault recomputation

Module 7 telemetry enters the shared telemetry service and updates Module 6. On the next journey or recommendation evaluation, Module 5 excludes an unusable charger and Module 8 composes the promoted primary and remaining backup state. Module 8 is stateless; it never caches a stale recommendation.

## Boundaries

The pure implementation is `intelligence/recommendation-engine`. Backend code maps application results into that engine. HTTP input validation, vehicle lookup, providers, mutable telemetry, and transaction logic remain in `backend/api`.
