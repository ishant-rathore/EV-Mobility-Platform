# EV Mobility Platform

EV Mobility Platform (product UI: VoltTwin AI) combines EV journey planning, energy estimation, advisory traffic diversification, charger intelligence, explainable reliability scoring, smart parking, and real-time IoT telemetry.

## Repository

- `apps`: React/Vite web UI and the mobile application boundary.
- `backend/api`: Express, TypeScript, Prisma, PostgreSQL, MQTT, and real-time APIs.
- `intelligence`: pure energy, routing, traffic, station-ranking, and reliability calculations.
- `iot`: ESP8266/ESP32 prototype firmware, MQTT protocol, hardware assets, and simulators.
- `database`: Prisma schema, migrations, seeds, and database tooling.
- `packages`: shared TypeScript contracts plus documented extraction boundaries.
- `mock-data`: clearly labelled deterministic demo fallback data.
- `tests`: cross-domain test plans; executable tests remain colocated with their owners.
- `infrastructure`: local and deployment infrastructure.
- `scripts`: safe developer automation.
- `docs`: product, architecture, domain, testing, and demo documentation.

## Getting started

1. Copy `.env.example` to `.env`.
2. Run `npm install`.
3. Run `docker compose up -d`.
4. Run `npm run db:generate`, then `npm run db:migrate` and `npm run db:seed` when a local database is required.
5. Run `npm run dev`.

`npm run typecheck`, `npm test`, and `npm run build` validate the workspace. Demo traffic, charger, and telemetry inputs are labelled `DEMO`/`SIMULATED`; range and arrival values are estimates. The optional Python AI service is intentionally inactive until a trained model is introduced.

Implemented P0 modules are EV profile/battery (1), routing/energy (2), traffic prediction (3), traffic diversification (4), charging-station intelligence (5), and charger reliability (6). `POST /api/v1/journeys/evaluate` is the authoritative six-module workflow: it uses the server-owned EV profile, selects a diversified route, ranks compatible and reachable chargers, and returns a reliability-aware primary plus backup.
