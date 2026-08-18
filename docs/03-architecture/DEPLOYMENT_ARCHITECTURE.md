
---

# 3. `DEPLOYMENT_ARCHITECTURE.md`

```md
# ⚡ EV Mobility Platform — Deployment Architecture

**Version:** 1.0  
**Status:** SIH 2026 MVP

---

# 1. Deployment Overview

The platform can be deployed as a containerized web application with separate application, database and IoT infrastructure.

---

# 2. Deployment Architecture

```text
                    INTERNET
                       │
                       ▼
                ┌─────────────┐
                │ Web Client  │
                │ React/Vite  │
                └──────┬──────┘
                       │ HTTPS
                       ▼
                ┌─────────────┐
                │ API Server  │
                │ Node/Express│
                └──────┬──────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
     PostgreSQL      MQTT       External APIs
          │          Broker
          │            │
          │            ▼
          │          ESP32
          │         ┌──┴───┐
          │         ▼      ▼
          │      Sensor   Lock
          │
          ▼
       Persistent
         Data
