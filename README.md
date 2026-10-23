# ⚡ EV Mobility Platform

> **Plan. Charge. Park. Go.**

An EV-mobility software project exploring a connected journey across route and energy planning, charging-station discovery, reservations, payments, and smart-parking/IoT workflows.

> **Status: In development.** The repository contains a multi-workspace web/API codebase and separate intelligence packages. The workflow described below is the project's intended product direction; it should not be read as proof that every feature is complete, deployed, hardware-connected, or passing end-to-end tests.

## Problem and approach

EV drivers can need several separate tools to plan a route, estimate energy use, find compatible chargers, arrange parking, and access a physical parking bay. This project explores how those decisions could be connected through a single application.

## Project areas

- **Driver experience:** vehicle profile, journey planning and charging/parking discovery.
- **Energy and route intelligence:** energy estimation, route-related modules, and station-ranking/recommendation packages.
- **Reservations and payments:** booking-related application workflows, with payment integrations to be verified in the running environment.
- **Operator workflows:** platform functions for charging/parking operators and administration.
- **IoT layer:** MQTT-related backend dependencies and simulator/hardware-oriented modules for occupancy and access workflows.

These are project areas and intended capabilities. Verify each workflow in source code, tests, and a running demo before describing it as production-ready.

## Architecture overview

```text
React + TypeScript web application
               |
          REST / WebSocket
               |
Node.js + Express + TypeScript API
     |          |             |
 PostgreSQL   Intelligence   MQTT services
   + Prisma   packages           |
                           IoT simulator / device
```

The repository is organized as an npm workspace. The root `package.json` names `apps/web`, `backend/api`, `packages/*`, `intelligence/*`, `iot/simulators`, and `database` as workspace areas.

## Technology stack

| Area | Technologies confirmed in project configuration |
| --- | --- |
| Web | React 19, TypeScript, Vite, React Router, Zustand, TanStack Query |
| API | Node.js, Express 5, TypeScript, Zod, Helmet, rate limiting |
| Database | PostgreSQL, Prisma ORM |
| Intelligence packages | Separate workspace modules for energy, route, traffic, charger reliability, station ranking, and recommendations |
| Realtime / IoT | Socket.IO and MQTT-related modules/dependencies |
| Testing | Vitest and API testing dependencies are configured in workspaces |
| Local environment | Docker Compose configuration and environment template are present |

## Requirements

- Node.js 20 or later.
- npm (root project specifies npm 11.5.2 as its package manager).
- PostgreSQL for database-backed workflows.
- An MQTT broker for development of MQTT-related flows.
- Docker is optional but useful when using the repository's local compose setup.

## Run locally

1. Clone the repository and enter the project directory:

    git clone https://github.com/ishant-rathore/EV-Mobility-Platform.git
    cd EV-Mobility-Platform

2. Install the root workspace dependencies:

    npm install

3. Create a local `.env` file from `.env.example` and review every value. Configure the database URL and MQTT settings for your own local environment. Never commit real credentials.

4. Generate Prisma Client, run development migrations, and seed the database when the database workspace is configured:

    npm run db:generate
    npm run db:migrate
    npm run db:seed

5. Start the web app and API using the root workspace command:

    npm run dev

The root script starts the backend API and web app concurrently. See the workspace-level `package.json` files for more detail.

## Useful scripts

| Command | Purpose declared in project scripts |
| --- | --- |
| `npm run dev` | Start the web app and API development processes |
| `npm run build` | Build available workspaces |
| `npm run typecheck` | Run workspace type checks where defined |
| `npm test` | Run workspace test scripts where defined |
| `npm run db:generate` | Generate Prisma Client for the API schema |
| `npm run db:migrate` | Run Prisma development migrations |
| `npm run db:seed` | Seed the configured local database |
| `docker compose up -d` | Start services declared in the Compose configuration, if configured for your machine |

These commands are taken from the repository scripts. This README update did not execute them, so it does not assert build, test, migration, or deployment success.

## Security and configuration

- Use local environment files for development and keep them out of Git.
- Keep `.env.example` limited to safe placeholders; do not put real passwords, tokens, payment secrets, or API keys in it.
- Never trust roles or resource ownership claims supplied by the frontend; authorization must be enforced by the API.
- Keep payment credentials on the server side and use test-mode credentials during development.
- Do not allow the browser to connect directly to PostgreSQL, MQTT brokers, or physical IoT devices.
- Before connecting real hardware, validate device authentication, topic access, command authorization, and safe failure behavior.

## Verification checklist

Before presenting this as a complete end-to-end platform, verify:

- [ ] Web and API startup using the documented root command.
- [ ] Database generation, migrations, and seed process in a clean local environment.
- [ ] Unit and integration tests with current results linked from CI.
- [ ] Authentication, authorization, and resource ownership on the API.
- [ ] Reservation/payment flows using test integrations only.
- [ ] MQTT simulation and device authorization without exposing secrets.
- [ ] A recorded demo or screenshots that show actual implemented workflows.

## Contributing

Keep changes within the existing workspace boundaries, add tests for behavior changes, update documentation when interfaces change, and use environment placeholders instead of real credentials.

## Related links

- [Repository](https://github.com/ishant-rathore/EV-Mobility-Platform)
- [GitHub Actions](https://github.com/ishant-rathore/EV-Mobility-Platform/actions)

---

**Core idea:** connect EV journey planning, charging intelligence, reservations, and smart-parking infrastructure through a modular application. Treat future or unverified capabilities as roadmap items until demonstrated.