
# ⚡ EV Mobility Platform

> **Plan. Charge. Park. Go.**

An intelligent EV mobility platform that connects **battery-aware journey planning, energy estimation, charging-station intelligence, charging reservation, smart parking, digital payments, IoT access control, and mobility analytics** into one continuous EV journey.

---

## 🚀 Project Overview

EV Mobility Platform is designed to solve the fragmented EV travel experience.

Instead of forcing drivers to use separate applications for:

- 🗺️ Route planning
- 🔋 Battery and energy planning
- ⚡ Charging discovery
- 🔌 Charger availability
- 📅 Charging reservation
- 🅿️ Parking reservation
- 💳 Payment
- 🔐 Smart parking access
- 📡 IoT monitoring

The platform combines these capabilities into a single workflow.

### Core Experience

```text
EV PROFILE
     ↓
CURRENT SOC
     ↓
ORIGIN + DESTINATION
     ↓
ROUTE PLANNING
     ↓
ENERGY ESTIMATION
     ↓
CHARGING REQUIRED?
     ↓
STATION DISCOVERY
     ↓
STATION RANKING
     ↓
CHARGING RESERVATION
     +
PARKING RESERVATION
     ↓
PAYMENT
     ↓
NAVIGATION
     ↓
IoT AUTHORIZATION
     ↓
MQTT
     ↓
ESP32
     ↓
SMART LOCK
     ↓
OCCUPANCY DETECTION
     ↓
CHARGING + PARKING SESSION
     ↓
SESSION COMPLETION
     ↓
ANALYTICS

The project's product direction is centered around this end-to-end workflow.


---

🎯 Problem Statement

EV drivers often face uncertainty during a journey:

Can the vehicle reach the destination?

How much energy will be required?

Where should the vehicle charge?

Is the charger compatible?

Is the charger available?

How long will the driver wait?

What will charging cost?

Is parking available?

Can charging and parking be reserved together?

How will the physical parking bay be accessed?


Existing solutions often solve only one part of the problem.

EV Mobility Platform combines these decisions into one intelligent mobility workflow.


---

💡 Solution

The platform acts as an EV journey orchestration layer.

EV MOBILITY PLATFORM
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
    INTELLIGENCE      TRANSACTIONS         IoT
        │                 │                 │
   Route + Energy    Booking + Payment   ESP32 + MQTT
        │                 │                 │
   Charging Rank      Parking Reserve    Sensors + Lock
        │                 │                 │
        └─────────────────┼─────────────────┘
                          ▼
                    ONE EV JOURNEY

Product Promise

> We don't just tell EV drivers where to charge — we help decide where they should charge, reserve charging and parking, process payment, and connect the reservation to the physical parking infrastructure.




---

⭐ Key Features

🚗 EV Driver

User registration and authentication

EV profile management

Battery/SOC management

Journey planning

Route calculation

Energy estimation

Charging requirement calculation

Charging station discovery

Intelligent station ranking

Explainable recommendations

Charging reservation

Parking reservation

Payment

Booking confirmation

Smart parking access

Live charging/parking session

Booking history

Notifications



---

🔋 EV Intelligence

The MVP uses a transparent and explainable energy model.

Energy Formula

Energy Required =
Distance × Consumption Rate

Example

Distance = 200 km
Consumption = 0.15 kWh/km

Energy Required = 30 kWh

The platform can additionally apply a configurable safety reserve.

Energy Decision Flow

Current SOC
     ↓
Energy Required
     ↓
Expected Arrival SOC
     ↓
Charging Required?
     ↓
Recommended Charging Target

The MVP intentionally prioritizes deterministic, explainable logic instead of unnecessary AI/ML complexity.


---

⚡ Intelligent Charging Recommendation

Stations are evaluated using factors such as:

Charger compatibility

Availability

Distance

Detour

Waiting time

Charging cost

Charger power

Parking availability


Recommendation Flow

Available Stations
       ↓
Compatibility Filter
       ↓
Availability Filter
       ↓
Calculate Factors
       ↓
Weighted Ranking
       ↓
Recommended Station
       ↓
"Why this station?"

Recommendations should be explainable, not presented as unexplained "AI magic."


---

🅿️ Smart Parking

The platform connects digital reservations with physical parking infrastructure.

Parking Access Flow

Parking Reservation
       ↓
Authorization
       ↓
MQTT
       ↓
ESP32
       ↓
Smart Lock
       ↓
Parking Bay

Occupancy Detection

Vehicle
   ↓
Ultrasonic / IR Sensor
   ↓
ESP32
   ↓
MQTT
   ↓
Backend
   ↓
Parking Status

This allows the digital platform and physical parking infrastructure to operate as one system.


---

📡 IoT Architecture

BACKEND
                       │
                       ▼
                  MQTT BROKER
                       │
                       ▼
                     ESP32
                  ┌────┴────┐
                  ▼         ▼
               SENSOR      LOCK
                  │         │
                  ▼         ▼
             OCCUPANCY   ACCESS

IoT Responsibilities

ESP32

Wi-Fi connectivity

MQTT communication

Occupancy sensing

Lock/servo control

Device status reporting


Backend

Device authentication

Authorization

MQTT commands

Device state

Event processing


> The frontend must never directly communicate with MQTT or ESP32 devices.




---

🏗️ Architecture

EV Mobility Platform uses a modular monolith + IoT event layer for the MVP.

EV MOBILITY PLATFORM
                                  │
                 ┌────────────────┴────────────────┐
                 │                                 │
             DRIVER UI                       OPERATOR UI
                 │                                 │
                 └────────────────┬────────────────┘
                                  ▼
                       React + TypeScript
                       Vite + Tailwind
                       shadcn/ui
                                  │
                              HTTPS/REST
                                  │
                                  ▼
                       Node.js + Express
                           + TypeScript
                                  │
       ┌──────────────┬───────────┼───────────┬──────────────┐
       ▼              ▼           ▼           ▼              ▼
   EV Engine      Charging     Booking     Payment          IoT
       │           Engine       Engine      Service        Service
       │              │           │           │              │
       └──────────────┴───────────┴───────────┘              │
                                  │                          │
                                  ▼                          ▼
                         Prisma ORM                    MQTT Broker
                                  │                          │
                                  ▼                          ▼
                       PostgreSQL / Neon                 ESP32
                                                       ┌────┴────┐
                                                       ▼         ▼
                                                    Sensor     Lock

The project intentionally avoids unnecessary microservices and infrastructure complexity for the MVP.


---

🧰 Technology Stack

Layer	Technology

Frontend	React + TypeScript
Build Tool	Vite
Styling	Tailwind CSS
UI Components	shadcn/ui
Client State	Zustand
Server State	TanStack Query
Forms	React Hook Form
Validation	Zod
Routing	React Router
Backend	Node.js + Express + TypeScript
API	REST + JSON
Database	PostgreSQL
Database Provider	Neon PostgreSQL
ORM	Prisma
Authentication	JWT
Password Security	Argon2 / bcrypt
Maps	Google Maps / compatible provider
Payment	Razorpay Test Mode
IoT Protocol	MQTT
MQTT Broker	Mosquitto / EMQX
Hardware	ESP32 / ESP8266
Occupancy Sensor	Ultrasonic / IR
Actuator	Servo / Electronic Lock
Testing	Vitest/Jest + Supertest + Playwright
Containers	Docker
CI/CD	GitHub Actions
API Documentation	OpenAPI / Swagger



---

📁 Repository Structure

EV-Mobility-Platform/
│
├── apps/
│   └── web/
│
├── backend/
│   ├── api/
│   └── workers/
│
├── intelligence/
│   ├── energy-engine/
│   ├── route-engine/
│   ├── station-ranking/
│   └── charging-optimizer/
│
├── iot/
│   ├── firmware/
│   ├── mqtt/
│   ├── hardware/
│   └── simulators/
│
├── database/
│   ├── prisma/
│   ├── migrations/
│   └── seeds/
│
├── packages/
│   ├── shared-types/
│   ├── validation/
│   └── config/
│
├── mock-data/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── hardware/
│
├── infrastructure/
│   ├── docker/
│   ├── mqtt/
│   ├── github/
│   └── deployment/
│
├── scripts/
│
├── docs/
│
├── docker-compose.yml
├── .env.example
├── .gitignore
├── LICENSE
├── CONTRIBUTING.md
├── SECURITY.md
└── README.md


---

👥 User Roles

The MVP defines four primary roles:

Role	Responsibility

🚗 DRIVER	Use EV mobility services
⚡ OPERATOR	Manage charging stations and chargers
🅿️ PARKING_OPERATOR	Manage parking infrastructure and IoT
🛡️ ADMIN	Manage the complete platform


Authorization Flow

Authentication
      ↓
JWT
      ↓
RBAC
      ↓
Resource Ownership
      ↓
Business Rules
      ↓
Authorized Action

> Frontend route protection is for UX; backend authorization is the actual security boundary.




---

🔐 Security Principles

The project follows these core rules:

Never expose secrets in source code.

Validate every API endpoint.

Authorize every API endpoint.

Enforce resource ownership.

Never let the frontend access the database directly.

Never let the frontend access MQTT directly.

Verify payments server-side.

Isolate IoT device credentials/topics.

Require authorization for physical actions.

Use database transactions for critical operations.

Never trust client-supplied roles or ownership claims.



---

🎨 UI/UX Direction

Design System

Minimal Mobility Glass

70–80% Minimalism
       +
20–30% Subtle Glassmorphism
       +
Electric Accents

Primary Palette

Token	HEX

Midnight	#0B1120
Surface	#111827
Card	#1E293B
Electric Green	#22C55E
Deep Green	#16A34A
Electric Cyan	#06B6D4
Smart Purple	#8B5CF6
Warning	#F59E0B
Error	#EF4444
Primary Text	#F8FAFC
Muted Text	#94A3B8
Border	#334155


Driver Experience

Mobile-first + map-centric

Operator Experience

Desktop-first + dashboard-centric

The design baseline is Minimal Mobility Glass with dark-first support and restrained glassmorphism.


---

🧪 Testing Strategy

Testing is divided into four levels.

Unit Tests
    ↓
Integration Tests
    ↓
API Tests
    ↓
End-to-End Tests

Unit Tests

Test:

Energy calculations

SOC calculations

Station ranking

Validation

Utility functions


Integration Tests

Test:

Database operations

Reservation workflows

Payment workflows

IoT services


API Tests

Test:

Authentication

Authorization

CRUD endpoints

Error handling

Business rules


E2E Tests

Test the complete golden path:

Login
 ↓
EV Profile
 ↓
Plan Journey
 ↓
Energy Calculation
 ↓
Station Recommendation
 ↓
Reserve
 ↓
Payment
 ↓
Parking Access
 ↓
Session
 ↓
Completion


---

📊 MVP Success Criteria

Product

P0 functionality works end-to-end.

Driver can plan a journey.

Charging need is calculated.

Suitable charging station is recommended.

Charging + parking can be reserved.

Payment can be completed.

IoT parking access can be demonstrated.


Performance

Target:

Page/API response ≈ <1s

Reliability

Target:

Reservation success ≥ 95%
Payment success ≥ 95%
IoT action reliability ≥ 95%

UX

Target:

> Find and reserve a suitable charging option in under 2 minutes.




---

🚧 MVP Scope

P0 — Must Have

✅ Authentication

✅ EV Profile

✅ Journey Planning

✅ Route Calculation

✅ Energy Estimation

✅ Charging Recommendation

✅ Station Availability

✅ Charging Reservation

✅ Parking Reservation

✅ Payment

✅ IoT Authorization

✅ MQTT Communication

✅ ESP32 Integration

✅ Occupancy Detection

✅ Smart Lock

✅ Session Tracking


P1 — Should Have

🟡 Notifications

🟡 Operator Analytics

🟡 Revenue Analytics

🟡 Advanced station filtering

🟡 Enhanced session monitoring


P2 — Future

🔵 Predictive demand

🔵 Dynamic pricing

🔵 Fleet optimization

🔵 Predictive maintenance

🔵 Advanced ML

🔵 Smart-city analytics


The project explicitly keeps advanced capabilities outside the MVP to prevent scope creep.


---

🚫 What We Are NOT Building for MVP

❌ ANPR

❌ CCTV system

❌ Full fleet-management platform

❌ Kubernetes cluster

❌ Multi-region infrastructure

❌ Full smart-city platform

❌ Advanced computer vision

❌ Dynamic pricing engine

❌ Predictive maintenance

❌ Complex ML infrastructure

❌ Unnecessary microservices

❌ Kafka

❌ Redis without a real requirement

❌ GraphQL without a real requirement


> MVP discipline > architecture hype.




---

🗺️ Development Roadmap

PHASE 0
Project Foundation
      ↓
PHASE 1
Design System
      ↓
PHASE 2
Authentication + RBAC
      ↓
PHASE 3
EV Profile + Vehicle
      ↓
PHASE 4
Journey + Route Engine
      ↓
PHASE 5
Energy Intelligence
      ↓
PHASE 6
Charging + Station Ranking
      ↓
PHASE 7
Reservation + Parking
      ↓
PHASE 8
Payment
      ↓
PHASE 9
IoT + MQTT + ESP32
      ↓
PHASE 10
Sessions + Analytics
      ↓
PHASE 11
Testing + Security
      ↓
PHASE 12
Demo Polish + Deployment


---

🧭 Engineering Philosophy

The project follows a simple architecture rule:

Frontend presents.
        ↓
Backend decides.
        ↓
Database persists.
        ↓
IoT executes.
        ↓
Sensors report.

Never violate this boundary

React → PostgreSQL    ❌
React → MQTT          ❌
React → ESP32         ❌
React → Payment DB    ❌

React → REST API      ✅

Backend → PostgreSQL  ✅
Backend → Payment     ✅
Backend → MQTT        ✅
MQTT → ESP32          ✅
ESP32 → Sensor        ✅
ESP32 → Lock          ✅


---

📚 Documentation

The project documentation is organized into major engineering domains:

docs/
│
├── 00-project/
├── 01-requirements/
├── 02-research/
├── 03-architecture/
├── 04-api/
├── 05-backend/
├── 06-frontend/
├── 07-database/
├── 08-security/
├── 09-iot/
├── 10-testing/
├── 11-deployment/
└── 12-roadmap/

Important Documents

Product Requirements Document (PRD)

Technical Requirements Document (TRD)

Framework Document

Technology Stack Document

API Specification

Backend Specification

Frontend Specification

Database Specification

RBAC Specification

Resource Ownership Specification

Engineering Rules

UI/UX Design Specification

Project Roadmap

Frontend Roadmap

Backend Roadmap



---

🛠️ Getting Started

Prerequisites

Install:

Node.js

npm

Git

PostgreSQL / Neon account

Docker (recommended)

MQTT broker for IoT development



---

Clone Repository

git clone <repository-url>
cd EV-Mobility-Platform


---

Environment Configuration

Copy the example environment file:

cp .env.example .env

Configure the required variables:

DATABASE_URL=

JWT_SECRET=

MAPS_API_KEY=

PAYMENT_KEY=
PAYMENT_SECRET=

MQTT_BROKER_URL=
MQTT_USERNAME=
MQTT_PASSWORD=

> Never commit real credentials.




---

📦 Install Dependencies

Depending on the final workspace configuration:

npm install

Web Application

cd apps/web
npm install

Backend

cd backend/api
npm install


---

🗄️ Database Setup

Generate Prisma Client:

npx prisma generate

Run database migrations:

npx prisma migrate dev

Seed development data:

npx prisma db seed

Open Prisma Studio:

npx prisma studio


---

▶️ Run Development Environment

Frontend

npm run dev

Backend

npm run dev

Docker

docker compose up --build


---

🧪 Testing

Unit Tests

npm test

API / Integration Tests

npm run test:integration

E2E Tests

npm run test:e2e


---

🔌 IoT Development

For physical hardware development:

Backend
   ↓
MQTT Broker
   ↓
ESP32
   ├── Occupancy Sensor
   └── Smart Lock

A simulator should also be available so the core platform can be tested without physical hardware:

Backend
   ↓
MQTT Broker
   ↓
IoT Simulator

This provides a fallback for development and hackathon demonstrations.


---

🤝 Team Development Rules

Before changing code:

1. Read the relevant documentation.


2. Check existing API contracts.


3. Check the database schema.


4. Check ownership/RBAC rules.


5. Follow module boundaries.


6. Add tests for major functionality.


7. Update documentation for architecture changes.


8. Do not introduce new infrastructure without justification.


9. Keep the MVP golden path working.



Golden Rule

> Build the golden path before polishing edge features.




---

🌿 Git Workflow

Recommended branch structure:

main
 │
 ├── develop
 │
 ├── feature/frontend-*
 ├── feature/backend-*
 ├── feature/iot-*
 ├── feature/database-*
 └── fix/*

Commit Convention

feat: add journey planning
feat: add station ranking
feat: add parking reservation

fix: resolve booking validation
fix: handle mqtt reconnect

docs: update api documentation

test: add energy engine tests

refactor: simplify reservation service


---

📈 Future Vision

After the MVP is stable, the platform can evolve toward:

EV MOBILITY PLATFORM
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
       DRIVERS            OPERATORS           CITIES
          │                  │                  │
          ▼                  ▼                  ▼
    Smart Routing       Infrastructure     Demand Planning
    Smart Charging      Analytics          EV Insights
    Smart Parking       Revenue            Optimization
          │                  │                  │
          └──────────────────┼──────────────────┘
                             ▼
                    MOBILITY INTELLIGENCE

Potential Future Capabilities

Predictive charging demand

Dynamic pricing

Fleet optimization

Predictive maintenance

Advanced recommendation models

Smart-city infrastructure analytics

Multi-network charging integration


These remain future roadmap items, not MVP commitments.


---

🏆 Project Identity

Name

EV Mobility Platform

Working Product

Pay&Park

Core Experience

> Plan → Charge → Park → Go



Core Technology

> React + Node.js + PostgreSQL + Prisma + MQTT + ESP32



Core Architecture

> Modular Monolith + IoT Event Layer



Core Philosophy

> Intelligence in software. Execution through infrastructure.




---

⚡ One-Line Pitch

> EV Mobility Platform is an intelligent EV journey orchestration platform that connects route planning, energy estimation, charging optimization, parking reservation, payment, and IoT-enabled access into one seamless journey.




---

📜 License

Add the project's selected license here.

Example:

MIT License


---

👨‍💻 Team VisionX

EV Mobility Platform — SIH 2026

Built for Smart India Hackathon 2026.


---

⚡ Plan. Charge. Park. Go.

