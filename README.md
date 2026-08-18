# VoltTwin AI

VoltTwin AI combines EV journey planning, energy estimation, traffic diversification, charger intelligence, reliability scoring, smart parking, and real-time IoT telemetry.

## Repository

- `backend`: Express, TypeScript, Prisma, PostgreSQL, MQTT, and real-time APIs.
- `frontend/apps/web`: React, Vite, TypeScript, Leaflet, and analytics UI.
- `frontend/shared`: frontend-shared contracts and utilities.
- `ai-service`: optional Python inference service for trained ML models.
- `database`: Prisma schema, migrations, seeds, and database tooling.
- `firmware`: ESP8266 and ESP32 prototype firmware.
- `simulator`: offline-safe charger and traffic simulators.
- `infrastructure`: local and deployment infrastructure.
- `docs`: product, architecture, domain, testing, and demo documentation.

## Getting started

1. Copy `.env.example` to `.env`.
2. Run `npm install`.
3. Run `docker compose up -d`.
4. Run `npm run db:generate && npm run db:migrate && npm run db:seed`.
5. Run `npm run dev`.

The optional Python AI service is intentionally inactive until a trained model is introduced.
