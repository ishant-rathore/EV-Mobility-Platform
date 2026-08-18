# Module 08 handoff — Recommendation Orchestrator

## Status

P0 backend, pure intelligence, API, shared types, UI summary, and automated tests are implemented.

## Authoritative files

- `intelligence/recommendation-engine/src/recommendationEngine.ts`
- `intelligence/recommendation-engine/src/explainability.ts`
- `backend/api/src/modules/recommendation/recommendation-orchestrator.service.ts`
- `backend/api/src/modules/recommendation/recommendation.routes.ts`
- `packages/shared-types/src/types/routing.ts`
- `apps/web/src/pages/driver/JourneyResult.tsx`

## Endpoints

- `POST /api/v1/recommendations/evaluate`: direct Module 8 output using a stored EV profile.
- `POST /api/v1/journeys/evaluate`: detailed evidence plus the same `recommendation` object.
- `POST /api/v1/recommendations`: legacy compatibility endpoint; not authoritative for new flows.

## Fault-aware behavior

Module 8 is stateless. Each evaluation consumes current Module 6 reliability. Tests verify that simulator fault telemetry invalidates the old primary, Module 5 promotes the backup, and Module 8 returns the promoted charger identifier.

## Remaining Module 8 P1/P2

- Fastest/Cheapest/Most Reliable preference modes.
- Availability-at-ETA prediction.
- Charge target calculation after Module 9 transaction requirements stabilize.
- Learned ranking, personalization, and multi-stop optimization remain future scope.
