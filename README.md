# Pay&Park — Intelligent EV Mobility Platform

> **Plan. Charge. Park. Go.**

An intelligent EV mobility platform that connects battery-aware journey planning with charging-station optimization, charging/parking reservation, payments, and IoT-enabled physical infrastructure.

Built for **Smart India Hackathon 2026 — Problem Statement #08: EV Mobility Platform**.

---

## 🏗️ Architecture

```
┌──────────────────────┐
│ React + TypeScript    │  ← client/
│ (Vite)               │
└──────────┬───────────┘
           │ REST API
           ▼
┌──────────────────────┐
│ Node.js + Express    │  ← server/
│ TypeScript + Prisma  │
└──────────┬───────────┘
           │
    ┌──────┼──────────┐
    ▼      ▼          ▼
 PostgreSQL  MQTT    External APIs
             │       (Maps, Razorpay)
             ▼
          ESP32       ← hardware/
          ├── Sensor
          └── Servo
```

## 📁 Project Structure

```
EV-Mobility-Platform/
├── client/          # React + TypeScript frontend (Vite)
├── server/          # Node.js + Express backend
├── hardware/        # ESP32 Arduino sketches
├── docker/          # Docker config files
├── docker-compose.yml
├── package.json     # Root monorepo config
└── Ev Mobility PRD.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

### 1. Clone & Install
```bash
git clone <repo-url>
cd EV-Mobility-Platform
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your API keys
```

### 3. Start Infrastructure
```bash
docker compose up -d
```

### 4. Database Setup
```bash
npm run db:generate
npm run db:push
```

### 5. Start Development
```bash
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:4000/api/v1
- **MQTT Broker:** mqtt://localhost:1883

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Zustand |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL 15, Prisma ORM |
| IoT | ESP32, MQTT (Mosquitto) |
| Payments | Razorpay (test mode) |
| Maps | Google Maps Platform |
| DevOps | Docker, Docker Compose |

## 📋 Core Features (P0 MVP)

- ⚡ Battery-aware journey planning
- 🗺️ Route calculation with energy estimation
- 🔌 Charging station discovery & ranking
- 📊 Transparent recommendation engine
- 📅 Charging + parking reservation
- 💳 Digital payment (Razorpay)
- 🅿️ Smart parking with IoT access
- 📡 ESP32 + MQTT occupancy detection
- 📈 Basic analytics dashboard

## 📄 License

Private — SIH 2026
