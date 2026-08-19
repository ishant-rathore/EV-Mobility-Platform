# ⚡ EV Mobility Platform

> **Plan. Charge. Park. Go.**

An intelligent EV mobility platform that connects **battery-aware journey planning, energy estimation, charging-station intelligence, charging reservation, smart parking, digital payments, IoT access control, occupancy monitoring, and mobility analytics** into one connected EV journey.

---

## 🚀 Project Overview

EV Mobility Platform addresses the fragmented EV travel experience.

Instead of using separate systems for:

- 🗺️ Route planning
- 🔋 Battery and energy planning
- ⚡ Charging discovery
- 🧠 Charging recommendations
- 📅 Charging reservation
- 🅿️ Parking reservation
- 💳 Payment
- 🔐 Smart parking access
- 📡 IoT monitoring

the platform brings these capabilities together into one workflow.

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
CHARGING + PARKING RESERVATION
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
SMART LOCK + OCCUPANCY
    ↓
CHARGING / PARKING SESSION
    ↓
ANALYTICS


---

🎯 Problem

EV drivers often manage battery, charging, parking, reservations and payments across fragmented systems.

This creates:

Range anxiety

Charging uncertainty

Parking uncertainty

Unnecessary detours

Waiting time

Fragmented payments

Manual physical access


Core Problem

> EV drivers lack a unified system that connects battery-aware journey planning, charging, parking, payment and physical infrastructure into one journey.




---

💡 Solution

EV Mobility Platform acts as a connected EV journey orchestration layer.

Battery Intelligence
        +
Journey Planning
        +
Charging Intelligence
        +
Charging Reservation
        +
Parking Reservation
        +
Payment
        +
IoT Access
        ↓
ONE CONNECTED EV JOURNEY


---

⭐ Key Features

🚗 EV Profile

User profile

EV profile

Battery capacity

Current SOC

Energy consumption

Connector type

EV preferences



---

🗺️ Journey Planning

Origin and destination

Route calculation

Distance estimation

Travel-time estimation

EV-aware route planning

Charging requirement detection



---

🔋 Energy Intelligence

The MVP uses a transparent energy model:

Energy Required
=
Distance × Consumption Rate

The platform evaluates:

Current SOC
     ↓
Available Energy
     ↓
Energy Required
     ↓
Expected Arrival SOC
     ↓
Charging Required?


---

⚡ Charging Intelligence

The platform discovers and ranks suitable charging stations using factors such as:

Distance

Detour

Cost

Waiting time

Availability

Connector compatibility

Charging power

Parking availability


Recommendations are designed to be explainable.


---

📅 Charging Reservation

Drivers can:

Select a charger

Select a time

Check availability

Reserve charging

View reservation status

Cancel reservations



---

🅿️ Smart Parking

Drivers can:

Discover parking locations

View parking availability

Select parking bays

Reserve parking

Monitor parking sessions

Access authorized parking infrastructure



---

💳 Digital Payment

The platform supports payment as part of the reservation workflow.

Reservation
    ↓
Payment
    ↓
Server-side Verification
    ↓
Confirmation


---

📡 IoT Smart Parking

The platform connects digital reservations to physical parking infrastructure.

Backend
   ↓
MQTT Broker
   ↓
ESP32
 ┌─┴──────────┐
 ▼            ▼
Sensor      Smart Lock

The ESP32 can:

Receive authorized commands

Control the lock/servo

Detect occupancy

Publish device status

Communicate through MQTT



---

📍 Occupancy Detection

Parking occupancy can be detected using sensors such as:

Ultrasonic Sensor
        or
IR Sensor

Vehicle
   ↓
Sensor
   ↓
ESP32
   ↓
MQTT
   ↓
Backend
   ↓
Parking Status


---

📊 Analytics

Basic analytics provide visibility into:

Charging sessions

Parking sessions

Station usage

Peak usage

Charger utilization

Parking utilization

Revenue



---

👥 User Roles

Role	Primary Responsibilities

🚗 Driver	EV profile, journeys, charging, parking, payments and sessions
⚡ Charging Operator	Stations, chargers, reservations, sessions, pricing and utilization
🅿️ Parking Operator	Parking locations, bays, occupancy, reservations and IoT
🛡️ Admin	Platform-wide users, resources, configuration and analytics



---

🏗️ Architecture

The MVP uses a Modular Monolith + IoT Event Layer.

EV MOBILITY PLATFORM
                                  │
              ┌───────────────────┴───────────────────┐
              ▼                                       ▼
       React Frontend                            Operators
              │
              ▼
          REST API
              │
              ▼
      Node.js + Express
              │
       ┌──────┼──────┐
       ▼      ▼      ▼
 Intelligence Transactions IoT
       │      │      │
       └──────┼──────┘
              ▼
         Prisma ORM
              ▼
      Neon PostgreSQL

IoT:
Backend → MQTT → ESP32 → Sensors / Lock


---

🛠️ Technology Stack

Layer	Technology

Frontend	React + TypeScript + Vite
UI	Tailwind CSS + shadcn/ui
State	Zustand + TanStack Query
Forms	React Hook Form + Zod
Backend	Node.js + Express + TypeScript
API	REST + JSON
Database	Neon PostgreSQL
ORM	Prisma
Authentication	Neon Auth
IoT	MQTT + ESP32
Maps	Maps / Routing Provider
Payment	Payment Gateway / Test Mode
Testing	Unit + Integration + E2E
Version Control	Git + GitHub



---

🔐 Security

The platform follows:

Authentication
      ↓
RBAC
      ↓
Resource Ownership
      ↓
Business Rules
      ↓
Authorized Action

Security principles

Backend-enforced authorization

Resource ownership validation

Server-side payment verification

No secrets in frontend

No direct frontend-to-database access

No direct frontend-to-MQTT access

Isolated IoT device credentials/topics

Validated API requests



---

📁 Repository Structure

EV-Mobility-Platform/
│
├── docs/
│   ├── 00-overview/
│   ├── 01-requirements/
│   ├── 02-research/
│   ├── 03-architecture/
│   ├── 04-intelligence/
│   ├── 05-database/
│   ├── 06-api/
│   ├── 07-workflows/
│   ├── 08-frontend/
│   ├── 09-iot/
│   ├── 10-security/
│   ├── 11-testing/
│   ├── 12-deployment/
│   ├── 13-business/
│   ├── 14-hackathon/
│   ├── 15-project-management/
│   └── 16-decisions/
│
├── frontend/
├── backend/
├── prisma/
├── iot/
├── tests/
├── .env.example
└── README.md


---

🎯 MVP Scope

P0 — Core MVP

✓ EV Profile
✓ SOC & Energy Estimation
✓ Journey Planning
✓ Station Discovery
✓ Station Ranking
✓ Charging Reservation
✓ Parking Reservation
✓ Payment
✓ IoT Access
✓ MQTT + ESP32
✓ Occupancy Detection
✓ Session Tracking
✓ Basic Analytics

Future Scope

Advanced ML
Predictive Demand
Dynamic Pricing
Vehicle Telemetry
Fleet Optimization
V2G
Smart-City Integration
Advanced Mobility Analytics


---

🧪 MVP Demonstration Flow

The primary hackathon demonstration follows:

LOGIN
  ↓
EV PROFILE
  ↓
PLAN JOURNEY
  ↓
ENERGY ESTIMATION
  ↓
CHARGING RECOMMENDATION
  ↓
CHARGING + PARKING RESERVATION
  ↓
PAYMENT
  ↓
CONFIRMATION
  ↓
IoT AUTHORIZATION
  ↓
SMART LOCK
  ↓
OCCUPANCY DETECTION
  ↓
CHARGING / PARKING SESSION
  ↓
COMPLETION
  ↓
ANALYTICS


---

⚠️ Known Limitations

The MVP is a prototype and does not claim:

Perfect energy prediction

Guaranteed live charger availability

Universal charging-network access

Production-certified IoT hardware

Nationwide infrastructure coverage

Advanced ML prediction

Production-scale smart-city integration


External APIs, network connectivity, payment systems and prototype IoT hardware may require fallback mechanisms.


---

🧭 Engineering Principles

MVP-FIRST
MODULAR
SECURE
TESTABLE
EXPLAINABLE
DOCUMENTED
OWNER-AWARE

Architecture Rule

> Frontend presents. Backend decides. Database persists. IoT executes. Sensors report.




---

🚀 Getting Started

1. Clone the repository

git clone <repository-url>
cd EV-Mobility-Platform

2. Install dependencies

npm install

Install frontend/backend dependencies according to their respective package configurations.

3. Configure environment variables

Create the required environment configuration from:

.env.example

Never commit production secrets.

4. Configure database

The project uses:

Neon PostgreSQL
+
Prisma ORM

Apply migrations using the project's Prisma workflow.

5. Start development

npm run dev

> Exact commands may differ depending on the final repository workspace configuration.




---

📚 Documentation

Project documentation is organized under:

docs/

Important starting documents:

docs/00-overview/PROJECT_OVERVIEW.md
docs/00-overview/PROBLEM_STATEMENT.md
docs/00-overview/KEY_FEATURES.md
docs/00-overview/ENGINEERING_RULES.md
docs/00-overview/GLOSSARY.md
docs/00-overview/KNOWN_LIMITATIONS.md


---

🏆 Hackathon Objective

The SIH MVP focuses on demonstrating a complete, believable EV journey rather than building every possible EV feature.

The goal:

PLAN
  ↓
CHARGE
  ↓
PARK
  ↓
PAY
  ↓
ACCESS
  ↓
GO

The strongest demonstration is the connection between:

Digital Mobility
       +
EV Intelligence
       +
Physical IoT Infrastructure


---

🔮 Future Vision

The platform can evolve toward a broader mobility ecosystem supporting:

Connected vehicles

Multi-operator charging networks

Smart-city parking

Fleet management

Predictive charging demand

Dynamic pricing

Advanced mobility analytics

Vehicle-to-grid integration

Energy-aware urban mobility


The MVP establishes the foundation for these future capabilities without over-engineering the initial system.


---

📌 Project Status

Current Stage: SIH 2026 MVP Development

Architecture: Modular Monolith + IoT Event Layer

Core Product Flow:

> Plan → Charge → Park → Go




---

⚡ EV Mobility Platform

> One platform. One connected EV journey.

Plan. Charge. Park. Go.
