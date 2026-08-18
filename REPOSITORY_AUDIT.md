# Repository Audit

Audit date: 2026-08-18  
Repository: `EV-Mobility-Platform`  
Package manager currently in use: npm (`package-lock.json`, npm workspaces)

## Executive summary

This is a working modular-monolith prototype, not an empty scaffold. The backend implements EV
profiles and battery state, route/energy evaluation, traffic prediction, traffic diversification,
charger discovery, reliability scoring, recommendations, telemetry, MQTT adapters and WebSocket
support. The React/Vite UI implements the driver journey and operator traffic-diversification
flows. Prisma contains a broad EV/charging/parking schema, ESP8266 firmware is present, and offline
charger/traffic simulators protect the demo.

The principal gap is repository placement rather than missing product logic. Application code is
under `frontend/apps`, the API is directly under `backend`, pure calculations remain inside API
modules, firmware and simulators are separate roots, and the optional Python adapter is outside an
`intelligence` domain. These can be normalized safely if path-dependent configuration is migrated
together.

## Current tree

```text
EV-Mobility-Platform/
├── .github/                 # Existing CI workflows and PR template
├── ai-service/              # Optional FastAPI adapters; no trained models
├── backend/                 # Working Express API (src, tests, package, tsconfig)
├── database/                # Prisma schema, seed and migration placeholder
├── docs/                    # Product, architecture, domain, safety and demo docs
├── firmware/                # ESP8266 charger prototype; ESP32 scope note
├── frontend/
│   ├── apps/web/            # Working React/Vite application
│   ├── apps/mobile/         # Scope README only
│   └── shared/              # Shared routing/API types and events
├── infrastructure/          # Mosquitto, nginx and infrastructure notes
├── notes/                   # Ignored Obsidian documentation vault
├── postman/                 # API collection/environment
├── prototype/               # Prototype-assets scope README
├── scripts/                 # Dev/smoke scripts and two TS orchestration stubs
├── simulator/               # Working MQTT charger and traffic simulators
├── docker-compose.yml
├── package.json
├── package-lock.json
└── tsconfig.base.json
```

Hidden `.kilo/` and `.kilocode/` directories are local agent tooling and are not project
architecture. They must not be added to workspaces or application dependency graphs.

## Existing implementation to preserve

### Backend

- Express 5 application with Helmet, CORS, Pino HTTP logging and centralized Zod/AppError handling.
- REST groups: EV, journeys, routes, traffic, chargers, recommendations and telemetry.
- Module 01 EV repository with Prisma and offline in-memory implementations.
- Module 02 route provider abstraction, OSRM/demo providers, energy budget, environment factors,
  route segments and charging-stop candidates.
- Module 03 current/predicted traffic model with explicit `DEMO` provenance.
- Module 04 class-aware, capacity-aware route diversification and 20-request simulation.
- Charger discovery/ranking, reliability calculation and recommendation orchestration.
- MQTT client/handlers/topics and Socket.IO server contracts.
- 52 passing backend tests across 14 files at audit time.

### Frontend

- React 19, TypeScript, Vite, Tailwind, TanStack Query, Zustand, React Router, Leaflet and Recharts.
- Working vehicle selection, battery display, journey planning, route map/result and traffic twin.
- Operator before/after traffic-diversification visualization.
- Minimal placeholder pages exist only for currently unimplemented routed surfaces.

### Database

- Prisma/PostgreSQL models for users, EVs, journeys, routes/segments, traffic snapshots, stations,
  chargers, telemetry, reliability, recommendations, charging sessions, parking, bookings,
  payments, devices, occupancy, notifications, reviews and audit logs.
- Existing schema semantics are coherent and must be preserved during structural migration.
- Seed code imports the canonical Module 01 demo-vehicle definitions from the backend.

### IoT and simulation

- PlatformIO ESP8266 charger prototype with an explicit no-high-voltage safety warning.
- ESP32/shared firmware scope notes.
- MQTT charger simulator and deterministic-shape traffic simulator.
- Mosquitto configuration and example ACL.

### Documentation

- Substantial PRD, module plan, rules, safety, roles, design and architecture documents.
- Domain documentation for battery/energy, traffic, charging/IoT and API behavior.
- Deployment, testing, demo and archived Pay&Park notes.
- Existing content is not byte-for-byte duplicated, even where subjects overlap.

## Existing modules

| Domain | Status | Current location |
|---|---|---|
| EV profile/battery | Implemented | `backend/src/modules/ev` |
| Journey orchestration | Implemented | `backend/src/modules/journey` |
| Routing/energy | Implemented | `backend/src/modules/routing` |
| Traffic prediction/diversification | Implemented | `backend/src/modules/traffic` |
| Charging/station ranking | Implemented | `backend/src/modules/charging` |
| Reliability | Implemented | `backend/src/modules/reliability` |
| Recommendations | Implemented | `backend/src/modules/recommendation` |
| Telemetry | Implemented | `backend/src/modules/telemetry` |
| MQTT/WebSocket | Implemented adapters | `backend/src/integrations/mqtt`, `backend/src/realtime` |
| Auth/users/admin/parking/payment/etc. | Scope README only | `backend/src/modules/*` |
| Optional trained-model API | Health endpoint/adapters only | `ai-service` |

## Frameworks and packages detected

| Area | Detected dependencies |
|---|---|
| Web | React, Vite, Tailwind, TanStack Query, Zustand, React Router, Leaflet, Recharts |
| API | Node.js, Express, Zod, Prisma, PostgreSQL, Socket.IO, MQTT.js, Helmet, CORS, Pino |
| Tests | Vitest, Supertest |
| Firmware | PlatformIO, Arduino, PubSubClient, ArduinoJson |
| Optional AI | FastAPI/Pydantic configuration with empty model adapters |
| Dev | npm workspaces, TypeScript strict base config, Docker Compose, GitHub Actions |

React Hook Form, authentication libraries, Playwright and shadcn components are not currently
installed. They should be added only when an implemented feature requires them.

## Duplicate or overlapping structure

- `frontend/apps` overlaps the required top-level `apps` domain.
- `frontend/shared` is a real shared-types package and belongs under top-level `packages`.
- `firmware` and `simulator` are both parts of the required top-level `iot` domain.
- `ai-service` is explicitly future/inactive and belongs under `intelligence/future-ai`.
- `notes` is an ignored Obsidian companion vault that overlaps `docs`; preserve it under a docs
  archive rather than deleting it.
- `docs/08-Repository-Structure-and-Frameworks copy.md` has an accidental ` copy` suffix but is the
  only file with that content; it should be renamed, not discarded.
- `.github/workflows` is the functional GitHub-required location. Target
  `infrastructure/github/workflows` should document/point to it rather than duplicate workflows.

## Missing target domains and files

- Top-level: `apps`, `intelligence`, `iot`, `packages`, `mock-data`, `tests`.
- Root governance: `LICENSE`, `CODE_OF_CONDUCT.md`, `CHANGELOG.md`, `Makefile`.
- Workspace manifest: `pnpm-workspace.yaml` (npm remains authoritative because a lockfile and
  working npm workspace already exist).
- Backend target wrapper: `backend/api`, `backend/README.md`, workers scope.
- Database package/README and safe scripts.
- Structured IoT protocol/hardware documentation and future simulator scopes.
- Shared validation/API-contract package boundaries.
- Project-management documents and architecture decision records.

## Database entity-gap note

The schema already covers most requested concepts, but naming/coverage differs in several places:

- `Booking` currently represents a parking reservation; there is no separate generic
  `Reservation` model.
- `Recommendation` covers charging recommendations; there is no separately named
  `ChargingRecommendation` model.
- `ParkingLocation`/`ParkingSlot` cover parking-space semantics.
- `ChargingSession` exists; there is no generic `Session` model.
- Operator ownership/organization is not modeled as a first-class entity.

These are documented gaps only. No Prisma semantic change is justified by repository movement, and
no schema change will be made without a migration and a concrete implemented requirement.

## Risky migrations

1. Moving `backend` changes Prisma schema/seed relative paths and compiled output paths.
2. Moving web/shared packages changes workspace patterns, TypeScript extends paths and frontend
   relative imports.
3. Moving firmware/simulators changes CI filters, PlatformIO project paths and npm scripts.
4. Moving pure calculations into intelligence packages can break runtime resolution unless package
   build order and dependencies are explicit.
5. Documentation contains direct links to `backend/src` and references to old simulator paths.
6. Docker and CI files contain old source paths.
7. The worktree contains useful uncommitted Module 04 changes; they must move with their files.
8. Renaming package scopes changes npm workspace commands and requires lockfile regeneration.

## Working commands detected and verified before migration

```bash
npm install
npm run dev
npm run dev:backend
npm run dev:web
npm run typecheck
npm test
npm run build
npm run db:generate
npm run db:migrate
npm run db:seed
npm run docker:up
npm run docker:down
```

Verification baseline immediately before this migration:

- `npm test`: passed, 52 backend tests; web test command passed with no web test files.
- `npm run typecheck`: passed for API, web, shared types and simulators.
- `npm run build`: passed for API, web, shared types and simulators.

## Migration strategy

1. Keep npm/package-lock authoritative and mirror workspace paths in `pnpm-workspace.yaml` only for
   tooling compatibility.
2. Move the web/mobile apps intact to `apps/`; avoid redesigning working UI.
3. Move the current API intact to `backend/api/`; keep existing module names such as `routing`.
4. Move only reusable pure calculations into buildable `intelligence` packages and leave thin
   compatibility exports/orchestration in the API.
5. Consolidate firmware/simulators under `iot/` and preserve safety language.
6. Move existing frontend-shared contracts to `packages/shared-types`; scaffold only genuinely
   useful package boundaries.
7. Use deterministic JSON under `mock-data` with explicit `source: "demo"` and
   `isSimulated: true` metadata.
8. Preserve all documentation, renaming/moving files with link updates rather than deleting them.
9. Update CI, Compose, scripts and README paths in the same phase as their source moves.
10. Re-run lockfile generation, Prisma generation, typechecks, tests and production builds.
