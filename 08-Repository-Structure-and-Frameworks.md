# VoltTwin AI / Pay&Park — Professional Repository Structure & Framework Stack

**Project Type:** EV Mobility Intelligence + Traffic Digital Twin + Charger IoT + Smart Parking  
**Primary SIH Problem:** PS-08 — EV Mobility Platform  
**Supporting Capability:** PS-05 — AI Traffic Prediction / Lightweight Digital Twin  
**Current Codebase Foundation:** Pay&Park TypeScript monorepo  
**Recommended Strategy:** **Extend the existing repository; do not rewrite the working backend before the hackathon.**

---

# 1. Architecture Decision

The existing repository already has a strong working foundation:

- TypeScript monorepo
- React/Vite web app
- Expo/React Native mobile app
- Node.js + Express backend
- Prisma
- PostgreSQL
- MQTT package
- ESP firmware
- Docker Compose
- GitHub Actions
- Existing booking, payment, parking, IoT, occupancy, analytics and admin modules

Because of that, the professional approach is:

> **Keep the current Node.js/Express/Prisma/PostgreSQL core and add EV, traffic, charger-intelligence and recommendation modules around it.**

Do **not** rewrite the entire backend to FastAPI for a one-day hackathon.

If Python ML becomes necessary later, add it as a dedicated optional AI service without replacing the main API.

---

# 2. Recommended Repository Structure

```text
Pay-and-Park/
│
├── backend/                         # Main application/API backend
│   ├── src/
│   │   ├── app.ts
│   │   ├── server.ts
│   │   │
│   │   ├── config/                  # Environment/configuration
│   │   │   ├── env.ts
│   │   │   ├── constants.ts
│   │   │   └── feature-flags.ts
│   │   │
│   │   ├── modules/                 # Domain modules
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   │
│   │   │   ├── ev/                  # NEW — EV profile + battery
│   │   │   │   ├── ev.routes.ts
│   │   │   │   ├── ev.schemas.ts
│   │   │   │   ├── ev.service.ts
│   │   │   │   ├── ev.repository.ts
│   │   │   │   └── ev.service.test.ts
│   │   │   │
│   │   │   ├── journey/             # NEW — journey orchestration
│   │   │   │   ├── journey.routes.ts
│   │   │   │   ├── journey.schemas.ts
│   │   │   │   ├── journey.service.ts
│   │   │   │   └── journey.service.test.ts
│   │   │   │
│   │   │   ├── routing/             # NEW — route + energy calculation
│   │   │   │   ├── routing.service.ts
│   │   │   │   ├── energy.service.ts
│   │   │   │   ├── routing.types.ts
│   │   │   │   └── routing.service.test.ts
│   │   │   │
│   │   │   ├── traffic/             # NEW — PS-05 lightweight digital twin
│   │   │   │   ├── traffic.routes.ts
│   │   │   │   ├── traffic.schemas.ts
│   │   │   │   ├── traffic-prediction.service.ts
│   │   │   │   ├── diversification.service.ts
│   │   │   │   └── traffic.service.test.ts
│   │   │   │
│   │   │   ├── charging/            # NEW — station/charger intelligence
│   │   │   │   ├── charging.routes.ts
│   │   │   │   ├── charging.schemas.ts
│   │   │   │   ├── charging.service.ts
│   │   │   │   ├── station-ranking.service.ts
│   │   │   │   └── charging.service.test.ts
│   │   │   │
│   │   │   ├── reliability/         # NEW — charger reliability score
│   │   │   │   ├── reliability.service.ts
│   │   │   │   ├── reliability.types.ts
│   │   │   │   └── reliability.service.test.ts
│   │   │   │
│   │   │   ├── recommendation/      # NEW — final route + charger decision
│   │   │   │   ├── recommendation.routes.ts
│   │   │   │   ├── recommendation.schemas.ts
│   │   │   │   ├── recommendation.service.ts
│   │   │   │   └── recommendation.service.test.ts
│   │   │   │
│   │   │   ├── telemetry/           # NEW — normalized charger telemetry
│   │   │   │   ├── telemetry.service.ts
│   │   │   │   ├── telemetry.schemas.ts
│   │   │   │   └── telemetry.types.ts
│   │   │   │
│   │   │   ├── parking/             # EXISTING — keep
│   │   │   ├── booking/             # EXISTING — keep
│   │   │   ├── payment/             # EXISTING — keep
│   │   │   ├── iot/                 # EXISTING — smart access commands
│   │   │   ├── occupancy/           # EXISTING — parking occupancy
│   │   │   ├── device/              # EXISTING — IoT device lifecycle
│   │   │   ├── notification/        # EXISTING
│   │   │   ├── analytics/           # EXISTING — extend for EV/traffic
│   │   │   ├── admin/               # EXISTING
│   │   │   ├── owner/               # EXISTING
│   │   │   ├── review/              # EXISTING / optional
│   │   │   └── audit/               # EXISTING
│   │   │
│   │   ├── integrations/            # External systems
│   │   │   ├── maps/
│   │   │   │   ├── routing.provider.ts
│   │   │   │   ├── osrm.provider.ts
│   │   │   │   └── demo-routing.provider.ts
│   │   │   ├── charging-providers/
│   │   │   │   ├── station.provider.ts
│   │   │   │   ├── demo-station.provider.ts
│   │   │   │   └── ocpp.provider.ts
│   │   │   ├── mqtt/
│   │   │   │   ├── mqtt.client.ts
│   │   │   │   ├── mqtt.topics.ts
│   │   │   │   └── mqtt.handlers.ts
│   │   │   └── payments/
│   │   │
│   │   ├── realtime/
│   │   │   ├── websocket.server.ts
│   │   │   ├── websocket.events.ts
│   │   │   └── websocket.types.ts
│   │   │
│   │   ├── shared/
│   │   │   ├── errors.ts
│   │   │   ├── auth-context.ts
│   │   │   ├── geo.ts
│   │   │   ├── enums.ts
│   │   │   ├── scoring.ts
│   │   │   └── time.ts
│   │   │
│   │   └── lib/
│   │       └── prisma.ts
│   │
│   ├── tests/
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── apps/
│   │   ├── web/                      # Main SIH application
│   │   │   ├── src/
│   │   │   │   ├── app/
│   │   │   │   ├── api/
│   │   │   │   ├── pages/
│   │   │   │   │   ├── driver/
│   │   │   │   │   │   ├── JourneyPlanner.tsx
│   │   │   │   │   │   ├── JourneyResult.tsx
│   │   │   │   │   │   ├── ChargerDetails.tsx
│   │   │   │   │   │   └── LiveJourney.tsx
│   │   │   │   │   │
│   │   │   │   │   ├── operator/
│   │   │   │   │   │   ├── DigitalTwin.tsx
│   │   │   │   │   │   ├── ChargerMonitor.tsx
│   │   │   │   │   │   └── Analytics.tsx
│   │   │   │   │   │
│   │   │   │   │   └── admin/
│   │   │   │   │       └── DemoControls.tsx
│   │   │   │   │
│   │   │   │   ├── components/
│   │   │   │   │   ├── map/
│   │   │   │   │   ├── journey/
│   │   │   │   │   ├── chargers/
│   │   │   │   │   ├── traffic/
│   │   │   │   │   ├── analytics/
│   │   │   │   │   └── common/
│   │   │   │   │
│   │   │   │   ├── hooks/
│   │   │   │   ├── store/
│   │   │   │   ├── types/
│   │   │   │   ├── utils/
│   │   │   │   └── styles/
│   │   │   │
│   │   │   ├── package.json
│   │   │   └── vite.config.ts
│   │   │
│   │   └── mobile/                   # Existing Expo app / post-MVP
│   │
│   └── shared/
│       ├── components/
│       ├── types/
│       ├── hooks/
│       ├── constants/
│       └── utils/
│
├── ai-service/                       # OPTIONAL — only when real Python ML is used
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   ├── models/
│   │   ├── services/
│   │   │   ├── traffic_model.py
│   │   │   ├── wait_time_model.py
│   │   │   └── demand_model.py
│   │   ├── schemas/
│   │   └── config.py
│   ├── data/
│   │   ├── raw/
│   │   ├── processed/
│   │   └── demo/
│   ├── notebooks/
│   ├── tests/
│   ├── requirements.txt
│   └── README.md
│
├── database/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── scripts/
│   └── ER-Diagram.png
│
├── firmware/
│   ├── esp8266/                      # NEW — current prototype hardware
│   │   ├── include/
│   │   ├── lib/
│   │   ├── src/
│   │   │   ├── main.cpp
│   │   │   ├── mqtt_client.cpp
│   │   │   ├── telemetry.cpp
│   │   │   ├── sensors.cpp
│   │   │   └── status_led.cpp
│   │   ├── test/
│   │   ├── platformio.ini
│   │   └── README.md
│   │
│   ├── esp32/                        # Keep existing implementation
│   └── shared/
│
├── simulator/                        # Software backup for IoT + traffic
│   ├── charger/
│   │   ├── scenarios/
│   │   └── charger-simulator.ts
│   ├── traffic/
│   │   ├── scenarios/
│   │   └── traffic-simulator.ts
│   └── README.md
│
├── infrastructure/
│   ├── docker/
│   ├── mqtt/
│   │   ├── mosquitto.conf
│   │   └── acl.example
│   ├── nginx/
│   ├── github-actions/
│   └── scripts/
│
├── docs/
│   ├── 01-product/
│   │   ├── PRD.md
│   │   ├── Scope.md
│   │   ├── User_Roles.md
│   │   └── Roadmap.md
│   ├── 02-requirements/
│   ├── 03-architecture/
│   │   ├── System_Architecture.md
│   │   ├── EV_Architecture.md
│   │   ├── Traffic_Twin_Architecture.md
│   │   ├── IoT_Architecture.md
│   │   └── Data_Flow.md
│   ├── 04-ev-intelligence/
│   │   ├── Energy_Model.md
│   │   ├── Station_Ranking.md
│   │   ├── Reliability_Score.md
│   │   └── Recommendation_Engine.md
│   ├── 05-traffic-twin/
│   │   ├── Traffic_Prediction.md
│   │   ├── Diversification.md
│   │   └── Simulation.md
│   ├── 06-charging-iot/
│   │   ├── Telemetry.md
│   │   ├── MQTT_Topics.md
│   │   ├── ESP8266.md
│   │   └── Backup_Modes.md
│   ├── 07-api/
│   ├── 08-database/
│   ├── 09-ui-ux/
│   ├── 10-safety-security/
│   ├── 11-testing/
│   ├── 12-deployment/
│   ├── 13-demo/
│   │   ├── Golden_Path.md
│   │   ├── Demo_Checklist.md
│   │   └── Judge_QA.md
│   └── archive/
│       └── pay-and-park-v1/
│
├── prototype/
│   ├── bom/
│   ├── circuit/
│   ├── cad/
│   ├── images/
│   ├── videos/
│   └── demo/
│
├── postman/
│   ├── VoltTwin.postman_collection.json
│   └── VoltTwin.postman_environment.json
│
├── scripts/
│   ├── dev.sh
│   ├── seed-demo.ts
│   ├── reset-demo.ts
│   └── smoke-test.sh
│
├── .github/
│   ├── workflows/
│   │   ├── backend-ci.yml
│   │   ├── web-ci.yml
│   │   ├── firmware-ci.yml
│   │   └── release.yml
│   ├── CODEOWNERS
│   └── PULL_REQUEST_TEMPLATE.md
│
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
├── README.md
├── CONTRIBUTING.md
├── SECURITY.md
└── LICENSE
```

---

# 3. Recommended Frameworks

## 3.1 Web Frontend

### Keep

| Technology | Role |
|---|---|
| React 19 | Main UI |
| Vite | Development/build tool |
| TypeScript | Type safety |
| React Router | Navigation |

### Add

| Technology | Role | Priority |
|---|---|---:|
| Tailwind CSS | Professional responsive styling | P0 |
| React Leaflet | Interactive maps | P0 |
| Leaflet | Map engine | P0 |
| OpenStreetMap | Map tiles/data | P0 |
| Recharts | Traffic/charger analytics | P0 |
| TanStack Query | API cache/server state | P1 |
| Zustand | Small local state store | Optional |
| Lucide React | Consistent icons | P1 |

### Recommended approach

Do not use Redux for the hackathon unless it is already needed.

---

# 3.2 Backend

The current backend already uses the correct stack for rapid extension.

| Technology | Role |
|---|---|
| Node.js | Runtime |
| Express.js | REST API |
| TypeScript | Backend language |
| Zod | Request/domain validation |
| Prisma | ORM |
| PostgreSQL | Main database |
| MQTT.js | MQTT integration |
| Helmet | HTTP security headers |
| CORS | Cross-origin configuration |

### Add

| Technology | Role | Priority |
|---|---|---:|
| Socket.IO or `ws` | Live frontend events | P0 |
| Pino | Structured logging | P1 |
| Supertest | API integration tests | P1 |

### Recommendation

Use **Socket.IO** if the team wants fast reconnecting real-time functionality.

Use plain `ws` only if the team wants a smaller dependency and is comfortable implementing reconnect/event handling.

---

# 3.3 AI / ML

## P0 — Do not create unnecessary microservice complexity

Keep these algorithms directly in the TypeScript backend:

- Energy estimation.
- Route scoring.
- Charger filtering.
- Charger reliability score.
- Station ranking.
- Traffic diversification.
- Rule-based waiting-time estimate.

These are deterministic domain algorithms and do not require Python.

## P1 — Python AI service only when actual ML is added

Frameworks:

| Technology | Role |
|---|---|
| Python 3.12+ | ML runtime |
| FastAPI | ML prediction API |
| Pydantic | Request validation |
| Pandas | Dataset processing |
| NumPy | Numerical calculations |
| Scikit-learn | Traffic/wait/demand models |
| Joblib | Saved model loading |

Possible future endpoints:

```text
POST /predict/traffic
POST /predict/wait-time
POST /predict/availability
POST /predict/demand
```

Do **not** move normal CRUD, booking, payment, IoT or authentication into this service.

---

# 3.4 Maps and Routing

## Hackathon

- Leaflet.
- OpenStreetMap.
- Predefined route alternatives as guaranteed fallback.

## Optional live routing

- OSRM.

Suggested abstraction:

```text
RoutingProvider
├── DemoRoutingProvider
└── OSRMRoutingProvider
```

This lets the demo work when internet/routing services fail.

---

# 3.5 Database

The current project already uses PostgreSQL + Prisma.

**Keep it.**

Do not downgrade the existing project to SQLite unless you are creating a completely isolated prototype.

### Current

- PostgreSQL.
- Prisma.

### Future

- PostgreSQL.
- PostGIS for spatial queries.

Recommended new tables/entities:

```text
EVVehicle
Journey
Route
TrafficSnapshot
ChargingStation
Charger
ChargerTelemetry
ReliabilitySnapshot
Recommendation
ChargingSession
```

Keep existing:

```text
User
ParkingLocation
ParkingSlot
Booking
Payment
IoTDevice
SlotOccupancy
OccupancyEvent
DeviceCommand
Notification
Review
AuditLog
```

---

# 3.6 IoT

## Prototype controller

- NodeMCU ESP8266.

## Firmware

- PlatformIO.
- Arduino framework / C++.

## Communication

- Wi-Fi.
- MQTT.
- Eclipse Mosquitto.

## Safe sensors

- DS18B20 temperature sensor.
- Low-voltage demo buttons/switches.
- LEDs.
- Optional OLED.
- Optional parking occupancy sensor.

## Electrical telemetry

Use PZEM/energy meters only when the exact electrical application is safe and correctly rated.

Never connect hobby GPIO/breadboards directly to energized EV-charging power conductors.

---

# 3.7 Real-Time Architecture

```text
NodeMCU / Simulator
        ↓
      MQTT
        ↓
Express IoT Ingestion
        ↓
PostgreSQL / Runtime State
        ↓
Recommendation Recalculation
        ↓
Socket.IO / WebSocket
        ↓
React Dashboard
```

This is the core live-demo pipeline.

---

# 3.8 Testing

Recommended stack:

| Layer | Tool |
|---|---|
| Backend unit tests | Existing Node test runner |
| API integration | Supertest |
| Frontend unit/component | Vitest + Testing Library |
| E2E | Playwright |
| Firmware | PlatformIO test |
| API manual testing | Postman |
| Load testing | k6 later |

For the hackathon, prioritize:

1. Energy calculation.
2. Traffic prediction.
3. Route diversification.
4. Reliability calculation.
5. Station ranking.
6. Fault → backup recommendation.
7. MQTT ingestion.
8. E2E smoke test.

---

# 3.9 DevOps

Keep the repository's existing:

- Docker Compose.
- GitHub Actions.
- `.github/CODEOWNERS`.
- Pull request templates.
- Release workflow.

Add:

- Web CI.
- Full smoke-test workflow.
- Local demo startup script.

Recommended local stack:

```text
docker compose up
        ↓
PostgreSQL
Mosquitto
Backend
Optional simulator
```

Run React separately with Vite for fast development.

---

# 4. Core Domain Dependency Direction

```text
EV Profile
    ↓
Journey
    ↓
Routing + Energy
    ↓
Traffic Prediction
    ↓
Diversification
    ↓
Charging Discovery
    ↓
Reliability
    ↓
Station Ranking
    ↓
Recommendation
    ↓
Reservation / Navigation
    ↓
Live Monitoring
    ↓
Backup / Re-route
```

IoT feeds charger intelligence asynchronously:

```text
ESP8266
  ↓
MQTT
  ↓
Telemetry
  ↓
Charger State
  ↓
Reliability
  ↓
Recommendation
```

---

# 5. Recommended API Groups

```text
/api/v1/auth
/api/v1/users
/api/v1/ev
/api/v1/journeys
/api/v1/routes
/api/v1/traffic
/api/v1/chargers
/api/v1/stations
/api/v1/recommendations
/api/v1/telemetry
/api/v1/iot
/api/v1/reservations
/api/v1/payments
/api/v1/parking
/api/v1/analytics
/api/v1/admin
```

---

# 6. Recommended MQTT Topics

```text
volttwin/chargers/{chargerId}/telemetry
volttwin/chargers/{chargerId}/status
volttwin/chargers/{chargerId}/heartbeat

volttwin/sites/{siteId}/bays/{bayId}/command
volttwin/sites/{siteId}/bays/{bayId}/status
volttwin/sites/{siteId}/bays/{bayId}/occupancy
volttwin/sites/{siteId}/bays/{bayId}/heartbeat
```

---

# 7. One-Day Development Priority

Do not try to implement the entire target structure today.

## Build first

```text
backend/src/modules/
├── ev/
├── journey/
├── routing/
├── traffic/
├── charging/
├── reliability/
├── recommendation/
└── telemetry/
```

Frontend:

```text
frontend/apps/web/src/pages/
├── driver/
│   ├── JourneyPlanner.tsx
│   ├── JourneyResult.tsx
│   └── LiveJourney.tsx
└── operator/
    └── DigitalTwin.tsx
```

IoT:

```text
firmware/esp8266/
simulator/
```

Everything else can reuse the current Pay&Park implementation.

---

# 8. What Should Not Be Refactored Before the Hackathon

The existing repository already has working module patterns such as:

```text
routes
schemas
service
repository
memory repository
Prisma repository
tests
```

Keep that pattern.

Do not:

- Rename every existing folder.
- Move the full repository into a new monorepo framework.
- Replace Express with FastAPI.
- Replace PostgreSQL with SQLite.
- Replace Prisma.
- Rewrite booking/payment.
- Rewrite the mobile app.
- Introduce Kubernetes.
- Introduce Kafka.
- Split everything into microservices.

Add the EV intelligence modules beside the existing architecture.

---

# 9. Important Repository Cleanup

The uploaded repository archive contains items that should not be part of a clean shared source archive.

## `.env`

The archive includes `.env` files.

Professional rule:

```text
.env
backend/.env
```

must be ignored.

Only commit:

```text
.env.example
```

If any committed `.env` contained real secrets, rotate those secrets.

## `.git`

Do not include the `.git/` internal object database when sending/exporting the project as a ZIP.

## Build output

Do not commit/share generated output unless deployment specifically needs it:

```text
backend/dist/
frontend/**/dist/
```

## Dependencies

Do not include:

```text
node_modules/
```

Use lockfiles instead.

---

# 10. Recommended Root `.gitignore`

```gitignore
# Environment
.env
.env.*
!.env.example

# Node
node_modules/
dist/
build/
coverage/

# Vite
.vite/

# Python / AI
__pycache__/
*.pyc
.venv/
venv/
.pytest_cache/
.ipynb_checkpoints/

# Database/local
*.db
*.sqlite
*.sqlite3

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Firmware
.pio/
firmware/**/.pio/

# Temporary
tmp/
temp/
```

---

# 11. Professional Final Stack

```text
┌─────────────────────────────────────────────────────────┐
│                     VOLTTWIN AI                         │
├─────────────────────────────────────────────────────────┤
│ Frontend                                                │
│ React 19 + Vite + TypeScript + Tailwind + Leaflet       │
│ Recharts + React Router                                 │
├─────────────────────────────────────────────────────────┤
│ Main Backend                                            │
│ Node.js + Express + TypeScript + Zod                    │
│ Prisma + PostgreSQL                                     │
├─────────────────────────────────────────────────────────┤
│ Intelligence                                            │
│ TypeScript scoring/rules for MVP                        │
│ Optional Python + FastAPI + Scikit-learn for real ML    │
├─────────────────────────────────────────────────────────┤
│ Real-Time                                               │
│ MQTT + Mosquitto + Socket.IO/WebSocket                  │
├─────────────────────────────────────────────────────────┤
│ IoT                                                     │
│ NodeMCU ESP8266 + PlatformIO + safe sensors             │
├─────────────────────────────────────────────────────────┤
│ Maps                                                    │
│ OpenStreetMap + Leaflet + optional OSRM                 │
├─────────────────────────────────────────────────────────┤
│ DevOps                                                  │
│ Docker Compose + GitHub Actions                         │
├─────────────────────────────────────────────────────────┤
│ Testing                                                 │
│ Node Test + Supertest + Vitest + Playwright + Postman   │
└─────────────────────────────────────────────────────────┘
```

---

# 12. Final Recommendation

For this existing repository, the best engineering decision is:

> **Evolve Pay&Park into VoltTwin AI instead of rebuilding it.**

Keep the proven parking/booking/payment/IoT foundation, then add:

```text
EV Profile
+ Energy Engine
+ Traffic Twin
+ Diversification
+ Charger Intelligence
+ Reliability
+ Recommendation Engine
+ Real-Time Fault Re-Routing
```

That gives the project a professional architecture while preserving the work already completed.
