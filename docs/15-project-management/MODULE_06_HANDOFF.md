# Module 6 Handoff — Charger Reliability

## Delivered

- Pure explainable seven-factor 0–100 scoring package.
- Hard fault/offline and abnormal-temperature invalidation.
- Heartbeat freshness decay and backend-derived offline state after 15 minutes.
- Source confidence and explicit demo/simulator warnings.
- REST assessment/list/read endpoints.
- Automatic REST/MQTT telemetry-to-reliability handoff.
- Generic backup-charger selector that enforces reachability, connector compatibility, and usability.
- Unit, service, API integration, and fault-transition tests.

## Module 5 integration contract

Module 5 should consume the Module 6 result rather than trusting a static station score:

1. Exclude a charger when `isUsable === false`, even if its historical score is high.
2. Use `score` only after reachability, connector, state, and route constraints pass.
3. Display `reasons`, `warnings`, `freshness`, and `sourceMode` with the recommendation.
4. Use `selectBackupCharger` for a deterministic usable backup, or implement the same hard filters before station-level ranking.
5. Do not interpret `CHARGING`/connected as faulted; availability and operational reliability are related but separate inputs.

Import pure contracts from `@ev-mobility/charger-reliability`. Backend orchestration is in `backend/api/src/modules/reliability`.

## Module 7 integration contract

Send canonical status, timestamp, temperature, and source metadata through the existing telemetry service. Simulator output must carry `sourceMode: "SIMULATOR"` and `isSimulated: true`. No device or frontend should write reliability scores directly.

## Deferred

- Prisma-backed reliability history/snapshots.
- Rolling 7/30-day metrics, MTBF/MTTR, and trends.
- Authenticated device/API identities.
- Socket.IO reliability-update events and the Module 11 operator visualization.
- Predictive maintenance or failure forecasting.
