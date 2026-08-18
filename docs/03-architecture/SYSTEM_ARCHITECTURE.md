
---

# 12. `SYSTEM_ARCHITECTURE.md`

```md
# ⚡ EV Mobility Platform — System Architecture

**Version:** 1.0  
**Status:** SIH 2026 MVP

---

# 1. System Overview

EV Mobility Platform is a connected software and IoT system that manages EV journeys, charging, parking, payments and smart infrastructure.

---

# 2. Complete Architecture

```text
                         USERS
                           │
              ┌────────────┴────────────┐
              │                         │
           DRIVER                  OPERATOR/ADMIN
              │                         │
              └────────────┬────────────┘
                           ▼
                  ┌─────────────────┐
                  │ React Frontend  │
                  └────────┬────────┘
                           │ HTTPS
                           ▼
                  ┌─────────────────┐
                  │ Express API     │
                  │ Node + TS       │
                  └────────┬────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   EV/ENERGY          CHARGING           PARKING
   ENGINE             SERVICE             SERVICE
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                    RESERVATION
                           │
                    ┌──────┴──────┐
                    ▼             ▼
                 PAYMENT         IoT
                    │             │
                    │             ▼
                    │        MQTT Broker
                    │             │
                    │           ESP32
                    │          ┌──┴──┐
                    │          ▼     ▼
                    │       Sensor  Lock
                    │
                    └──────┬───────┘
                           ▼
                    PostgreSQL
