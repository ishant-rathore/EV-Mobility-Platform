# Modules 1–6 integration handoff

## Status

The P0 journey chain is wired end to end through `POST /api/v1/journeys/evaluate`.

1. Module 1 loads the stored EV profile and owns SOC, battery health, efficiency, reserve, vehicle class, and connector types.
2. Module 2 evaluates route energy and whether charging is required.
3. Module 3 supplies current or predicted traffic factors.
4. Module 4 selects an eligible advisory route using traffic capacity and vehicle class.
5. Module 5 evaluates route-linked, reachable, connector-compatible charger candidates and produces an explainable ranking.
6. Module 6 supplies dynamic reliability, invalidates faulted/offline chargers, and selects the backup.

Module 8 consumes this chain and adds a single explainable recommendation summary. It does not alter the ownership of any Module 1–6 decision.

## Authoritative contracts

- Journey orchestration: `backend/api/src/modules/journey/journey.service.ts`
- Station candidate orchestration: `backend/api/src/modules/charging/charging.service.ts`
- Pure station ranking: `intelligence/station-ranking/src/candidateRanking.ts`
- Reliability state and telemetry: `backend/api/src/modules/reliability/reliability.service.ts`
- Pure reliability and backup selection: `intelligence/charger-reliability/src/`
- Shared frontend response types: `packages/shared-types/src/types/routing.ts`

The routing module still returns its legacy station summaries for API compatibility, but the `chargingIntelligence.primary` and `chargingIntelligence.backup` fields are authoritative for integrated journey decisions.

## Failure handoff

REST telemetry and MQTT telemetry share the same ingestion service. When a recommended charger receives fresh `FAULT`/`FAULTED` telemetry, Module 6 makes it unusable. The next Module 5 evaluation excludes it and promotes an eligible backup. Stale telemetry is treated as offline by the reliability module.

## Data honesty

Bundled stations and operational baselines are demo data. Responses are labelled `DEMO`/`SIMULATED`, and scoring explicitly states that range, detour, wait, availability, and reliability are prototype estimates.
