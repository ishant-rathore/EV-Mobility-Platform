# ⚡ EV Mobility Platform — Component Architecture

**Version:** 1.0  
**Status:** SIH 2026 MVP  
**Architecture Style:** Modular Monorepo

---

## 1. Purpose

This document defines the major software and hardware components of the EV Mobility Platform.

---

# 2. High-Level Components

```text
EV MOBILITY PLATFORM
│
├── Frontend
│   ├── Driver Application
│   └── Operator/Admin Dashboard
│
├── Backend
│   ├── Authentication
│   ├── EV Management
│   ├── Journey Planning
│   ├── Energy Engine
│   ├── Charging
│   ├── Reservation
│   ├── Parking
│   ├── Payment
│   ├── IoT
│   └── Analytics
│
├── Data Layer
│   ├── PostgreSQL
│   └── Prisma ORM
│
├── External Services
│   ├── Maps/Routing
│   └── Payment Gateway
│
└── IoT Layer
    ├── MQTT Broker
    ├── ESP32/ESP8266
    ├── Occupancy Sensor
    └── Smart Lock
