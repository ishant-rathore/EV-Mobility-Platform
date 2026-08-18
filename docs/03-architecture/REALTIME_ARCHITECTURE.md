
---

# 6. `REALTIME_ARCHITECTURE.md`

```md
# ⚡ EV Mobility Platform — Real-Time Architecture

**Version:** 1.0  
**Status:** SIH 2026 MVP

---

# 1. Purpose

The real-time layer handles events that should be reflected quickly across the platform.

---

# 2. Real-Time Sources

- Parking sensors
- IoT devices
- Reservation changes
- Charger availability
- Session events
- Device status

---

# 3. Architecture

```text
Physical Device
      ↓
MQTT
      ↓
IoT Service
      ↓
Event Processing
      ↓
Database
      ↓
Frontend
