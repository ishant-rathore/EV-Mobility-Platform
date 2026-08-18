
---

# 5. `IOT_ARCHITECTURE.md`

```md
# ⚡ EV Mobility Platform — IoT Architecture

**Version:** 1.0  
**Status:** SIH 2026 MVP

---

# 1. Purpose

The IoT architecture connects digital reservations with physical parking infrastructure.

---

# 2. Architecture

```text
                 CLOUD / SERVER
                       │
                       ▼
                 IoT Service
                       │
                       ▼
                  MQTT Broker
                       │
                 ┌─────┴─────┐
                 ▼           ▼
              ESP32 #1    ESP32 #2
                 │
          ┌──────┴───────┐
          ▼              ▼
      Occupancy        Servo
       Sensor           Lock
