# EV Mobility Platform

Intelligent EV journey planning, charging, smart parking, payment, IoT access, and mobility analytics platform.

## Monorepo Domains
- `apps/` — Web/mobile applications
- `backend/` — API and background workers
- `intelligence/` — EV energy, routing, station ranking, charging optimization
- `iot/` — Firmware, MQTT, hardware, simulators
- `database/` — PostgreSQL/Prisma schema, migrations, seeds
- `packages/` — Shared TypeScript contracts and validation
- `tests/` — Unit, integration, E2E, hardware, performance
- `infrastructure/` — Docker, MQTT, CI/CD, deployment
- `mock-data/` — Stable hackathon/demo data
- `docs/` — Product and engineering documentation

## Golden Path
Login → EV Profile → Journey → Energy Estimate → Station Recommendation → Charging + Parking Reservation → Payment → IoT Unlock → Occupancy → Session Complete → Analytics.
