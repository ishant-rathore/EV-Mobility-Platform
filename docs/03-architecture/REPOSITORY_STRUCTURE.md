# EV Mobility Platform — Complete Repository Structure

**Project:** EV Mobility Platform / VoltTwin AI  
**Architecture:** SIH 2026 MVP Monorepo  
**Primary Problem:** EV Mobility Platform  
**Supporting Capability:** Traffic Prediction / Route Diversification  
**Core Domains:** EV Journey Planning • Charging Intelligence • Smart Parking • IoT • Payments • Analytics

---

# 1. Repository Overview

```text
EV-Mobility-Platform/
│
├── apps/                 # User-facing web/mobile applications
├── backend/              # Platform API + business logic
├── intelligence/         # EV intelligence and optimization layer
├── iot/                  # Physical mobility / IoT layer
├── database/             # PostgreSQL + Prisma persistent data
├── packages/             # Shared contracts across the platform
├── tests/                # Quality + reliability
├── infrastructure/       # Deployment + DevOps
├── mock-data/            # Demo fallback / offline resilience
├── scripts/              # Development + utility scripts
├── docs/                 # Documentation hub
│
├── README.md
├── CONTRIBUTING.md
├── SECURITY.md
├── LICENSE
├── .gitignore
├── .env.example
└── docker-compose.yml
```

---

# 2. `apps/` — User-Facing Applications

```text
apps/
│
├── web/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── ev-profile/
│   │   │   ├── journey/
│   │   │   ├── charging/
│   │   │   ├── station/
│   │   │   ├── reservation/
│   │   │   ├── parking/
│   │   │   ├── payment/
│   │   │   ├── iot/
│   │   │   └── analytics/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── stores/
│   │   └── types/
│   └── package.json
│
└── mobile/
```

Frontend responsibility:

```text
USER INPUT
   ↓
WEB / MOBILE UI
   ↓
API REQUEST
   ↓
BACKEND RESPONSE
   ↓
VISUALIZE
   ↓
USER ACTION
```

The frontend displays route, energy, charger, reservation, payment and IoT state. Authoritative decision logic belongs in backend/intelligence services.

---

# 3. `backend/` — Platform API + Business Logic

```text
backend/
│
├── api/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── vehicles/
│   │   │   ├── journeys/
│   │   │   ├── routing/
│   │   │   ├── energy/
│   │   │   ├── charging/
│   │   │   ├── stations/
│   │   │   ├── ranking/
│   │   │   ├── reservations/
│   │   │   ├── parking/
│   │   │   ├── payments/
│   │   │   ├── iot/
│   │   │   ├── sessions/
│   │   │   ├── notifications/
│   │   │   ├── analytics/
│   │   │   └── admin/
│   │   ├── integrations/
│   │   │   ├── maps/
│   │   │   ├── charging-providers/
│   │   │   ├── payment-gateway/
│   │   │   └── mqtt/
│   │   └── jobs/
│   └── tests/
│
└── workers/
```

Backend owns platform orchestration, transactions, authorization and integrations.

---

# 4. `intelligence/` — EV Intelligence Layer

```text
intelligence/
│
├── energy-engine/
│   ├── energyCalculator.ts
│   ├── batteryModel.ts
│   ├── consumptionModel.ts
│   ├── reserveMargin.ts
│   └── weatherFactor.ts
│
├── route-engine/
│   ├── routePlanner.ts
│   ├── routeProvider.ts
│   ├── routeSegments.ts
│   └── chargingStops.ts
│
├── station-ranking/
│   ├── rankingEngine.ts
│   ├── scoring.ts
│   ├── weights.ts
│   ├── filters.ts
│   └── compatibility.ts
│
├── charging-optimizer/
│   ├── chargingPlanner.ts
│   ├── chargeTarget.ts
│   ├── chargingTime.ts
│   └── costEstimator.ts
│
└── future-ai/
    ├── demand-prediction/
    ├── queue-prediction/
    └── dynamic-pricing/
```

## Core formulas

```text
Energy Required
=
Distance × Vehicle Consumption × Adjustment Factors
```

```text
Station Score
=
Detour
+ Wait Time
+ Charging Cost
+ Travel Impact
+ Availability / Compatibility Factors
```

Recommended flow:

```text
Hard Filters
→ Normalize
→ Weighted Score
→ Rank
→ Explain Recommendation
```

---

# 5. `iot/` — Physical Mobility Layer

```text
iot/
│
├── firmware/
│   ├── parking-device/
│   │   ├── src/
│   │   │   ├── wifi/
│   │   │   ├── mqtt/
│   │   │   ├── sensors/
│   │   │   ├── actuators/
│   │   │   ├── occupancy/
│   │   │   ├── heartbeat/
│   │   │   └── diagnostics/
│   │   ├── include/
│   │   ├── test/
│   │   └── platformio.ini
│   └── charging-device/
│
├── mqtt/
│   ├── topics.md
│   ├── payloads.md
│   ├── commands.md
│   └── status.md
│
├── hardware/
│   ├── BOM.md
│   ├── wiring/
│   ├── circuits/
│   ├── CAD/
│   └── prototype/
│
└── simulators/
    ├── esp-simulator/
    ├── occupancy-simulator/
    └── charger-simulator/
```

## Physical flow

```text
APP
 ↓
BACKEND
 ↓
MQTT
 ↓
ESP8266 / ESP32
 ↓
SENSOR + SERVO
 ↓
SMART PARKING / CHARGING INFRASTRUCTURE
```

Hackathon hardware:

- NodeMCU ESP8266 / ESP32.
- Occupancy sensor.
- Servo / flap lock.
- LEDs / optional OLED.
- MQTT.
- Safe low-voltage demo setup.

---

# 6. `database/` — Persistent Platform Data

```text
database/
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── seeds/
│   ├── users.seed.ts
│   ├── vehicles.seed.ts
│   ├── stations.seed.ts
│   ├── chargers.seed.ts
│   ├── parking.seed.ts
│   └── demo.seed.ts
│
└── scripts/
    ├── reset.ts
    ├── seed.ts
    └── backup.ts
```

## Core ER model

```text
User
 ↓
Vehicle
 ↓
Journey
 ↓
Charging Plan
 ↓
Station ───── Charger
   │
   ↓
Parking Space
   ↓
IoT Device
   ↓
Reservation
   ↓
Payment
```

Recommended core entities:

- User
- EVVehicle
- Journey
- Route
- ChargingPlan
- ChargingStation
- Charger
- ChargerTelemetry
- ReliabilitySnapshot
- Reservation
- ParkingSpace
- ParkingReservation
- Payment
- IoTDevice
- OccupancyEvent
- TrafficSnapshot

---

# 7. `packages/` — Shared Contracts

```text
packages/
│
├── shared-types/
│   ├── user.ts
│   ├── vehicle.ts
│   ├── journey.ts
│   ├── station.ts
│   ├── reservation.ts
│   ├── payment.ts
│   └── iot.ts
│
├── validation/
│   ├── auth.schemas.ts
│   ├── journey.schemas.ts
│   ├── reservation.schemas.ts
│   └── payment.schemas.ts
│
└── config/
    ├── eslint/
    ├── typescript/
    └── prettier/
```

Purpose:

> Keep frontend and backend aligned to the same data contracts and validation rules.

---

# 8. `tests/` — Quality + Reliability

```text
tests/
│
├── unit/
├── integration/
├── e2e/
│   └── golden-path/
├── hardware/
│   ├── occupancy/
│   ├── servo/
│   └── mqtt/
└── performance/
```

## Golden-path test

```text
EV INPUT
 ↓
ROUTE
 ↓
ENERGY
 ↓
BEST CHARGER
 ↓
RESERVE
 ↓
PAY
 ↓
MQTT
 ↓
UNLOCK
 ↓
OCCUPANCY
 ↓
SESSION COMPLETE
```

Resilience tests:

- Charger fault.
- MQTT disconnect.
- NodeMCU offline.
- Map API failure.
- Reservation conflict.
- Payment failure.
- Stale charger data.
- Simulator fallback.

---

# 9. `infrastructure/` — Deployment + DevOps

```text
infrastructure/
│
├── docker/
│   ├── Dockerfile.web
│   ├── Dockerfile.api
│   └── Dockerfile.iot
│
├── mqtt/
│   └── mosquitto.conf
│
├── nginx/
│   └── nginx.conf
│
├── github/
│   └── workflows/
│
└── deployment/
    ├── development/
    ├── staging/
    └── production/
```

For SIH, prefer **modular monolith + Docker + MQTT** over unnecessary distributed-system complexity.

---

# 10. `mock-data/` — Demo Fallback / Offline Resilience

```text
mock-data/
│
├── stations/
├── vehicles/
├── journeys/
└── iot/
```

Fallback pattern:

```text
Charging API unavailable
→ Demo station data

Routing unavailable
→ Predefined routes

IoT hardware unavailable
→ Device simulator

Internet unavailable
→ Local demo dataset
```

All non-real data must be visibly labeled `DEMO` or `SIMULATOR`.

---

# 11. `scripts/` — Development + Utilities

```text
scripts/
├── setup.sh
├── dev.sh
├── test.sh
├── seed.sh
├── demo.sh
└── cleanup.sh
```

Recommended additions:

```text
reset-demo.sh
smoke-test.sh
start-local-stack.sh
```

---

# 12. `docs/` — Documentation Hub

```text
docs/
│
├── 00-overview/              # PRD & Overview
├── 01-requirements/          # Requirements
├── 02-research/              # Research
├── 03-architecture/          # Architecture
├── 04-intelligence/          # Algorithms
├── 05-database/              # Database
├── 06-api/                   # API
├── 07-workflows/             # Workflows
├── 08-frontend/              # Frontend
├── 09-iot/                   # IoT
├── 10-security/              # Security
├── 11-testing/               # Testing
├── 12-deployment/            # Deployment
├── 13-business/              # Business
├── 14-hackathon/             # Hackathon
├── 15-project-management/    # Project Management
└── 16-decisions/             # ADRs
```

Highest-priority documents:

```text
PROJECT_CONTEXT.md
PRD.md
SYSTEM_ARCHITECTURE.md
ENERGY_MODEL.md
STATION_RANKING.md
DATABASE_DESIGN.md
API_OVERVIEW.md
IOT_ARCHITECTURE.md
MQTT_PROTOCOL.md
FRONTEND_HANDOFF.md
TEST_PLAN.md
DEMO_SCRIPT.md
GOLDEN_PATH.md
DEMO_FALLBACK.md
JUDGE_QA.md
```

---

# 13. Complete System Flow

```text
USER
 ↓
WEB / MOBILE
 ↓
BACKEND API
 ↓
INTELLIGENCE ENGINE
 ↓
POSTGRESQL + EXTERNAL APIs
 ↓
MQTT
 ↓
ESP8266 / ESP32
 ↓
SMART PARKING / CHARGING INFRASTRUCTURE
```

Product workflow:

```text
PLAN
 ⚡
CHARGE
 ⚡
PARK
 ⚡
PAY
 ⚡
UNLOCK
 ⚡
CHARGE
 ⚡
ANALYZE
```

---

# 14. Framework Stack

| Layer | Technology |
|---|---|
| Web Frontend | React + Vite + TypeScript |
| Styling | Existing CSS Design System; Tailwind later if desired |
| Routing UI | React Router |
| Maps | Leaflet + OpenStreetMap |
| Charts | Recharts |
| Main Backend | Node.js + Express + TypeScript |
| Validation | Zod |
| ORM | Prisma |
| Database | PostgreSQL |
| Real-Time UI | Socket.IO / WebSocket |
| IoT | MQTT.js + Eclipse Mosquitto |
| Firmware | PlatformIO + Arduino C++ |
| Controller | ESP8266 / ESP32 |
| AI/ML Later | Python + FastAPI + Pandas + NumPy + Scikit-learn |
| Deployment | Docker Compose |
| CI/CD | GitHub Actions |
| API Testing | Postman / Supertest |
| Frontend Testing | Vitest / Testing Library |
| E2E | Playwright |

---

# 15. Repository Ownership

```text
apps/
→ Frontend Team

backend/
→ Backend Team

intelligence/
→ EV / AI / Optimization Team

iot/
→ Hardware / IoT Team

database/
→ Backend + Database Owner

packages/
→ Shared Ownership / Tech Lead

tests/
→ All Teams

infrastructure/
→ Integration / DevOps

mock-data/
→ Demo + Integration Team

scripts/
→ Integration / DevOps

docs/
→ Module Owners + Lead
```

---

# 16. SIH MVP Build Priority

## Priority 1

```text
apps/web
backend/api
intelligence/energy-engine
intelligence/route-engine
intelligence/station-ranking
database
mock-data
```

## Priority 2

```text
iot/firmware
iot/mqtt
tests/e2e
operator dashboard
```

## Priority 3

```text
reservation
payment
smart parking access
advanced analytics
future-ai
```

The core end-to-end recommendation demo must work before optional modules are polished.

---

# 17. Final Architecture Rule

```text
                EV MOBILITY PLATFORM
                         │
       ┌─────────────────┼─────────────────┐
       │                 │                 │
       ▼                 ▼                 ▼
 USER APPLICATIONS   INTELLIGENCE      PHYSICAL LAYER
       │                 │                 │
   Web/Mobile       Energy / Route      IoT / MQTT
                     Ranking / AI        ESP / Sensors
       │                 │                 │
       └─────────────────┼─────────────────┘
                         ▼
                    BACKEND API
                         │
               ┌─────────┼─────────┐
               ▼         ▼         ▼
          PostgreSQL   Payments   External APIs
```

This is the repository architecture to use for the **EV Mobility Platform — SIH 2026 MVP**.
