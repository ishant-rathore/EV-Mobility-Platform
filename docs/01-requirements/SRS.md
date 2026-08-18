# EV Mobility Platform — Software Requirements Specification

**Version:** 1.0  
**Status:** SIH 2026 MVP

---

# 1. Introduction

## 1.1 Purpose

This SRS defines the software requirements for the EV Mobility Platform.

---

# 2. System Overview

The platform provides an integrated EV mobility workflow combining:

- Journey planning
- Battery-aware energy estimation
- Charging station intelligence
- Charging reservation
- Parking reservation
- Payment
- IoT parking access
- Analytics

---

# 3. System Actors

- EV Driver
- Charging Station Operator
- Parking Operator
- Admin

---

# 4. Functional Requirements

The system shall:

1. Authenticate users.
2. Store EV profiles.
3. Accept origin and destination.
4. Calculate routes.
5. Estimate energy.
6. Calculate SOC.
7. Determine charging requirements.
8. Find charging stations.
9. Rank charging stations.
10. Recommend charging stations.
11. Reserve charging.
12. Reserve parking.
13. Process payment.
14. Generate booking confirmation.
15. Authorize IoT access.
16. Communicate using MQTT.
17. Control smart parking hardware.
18. Detect occupancy.
19. Track sessions.
20. Provide basic analytics.

---

# 5. System Architecture

```text
Frontend
   ↓
REST API
   ↓
Backend Services
   ├── Auth
   ├── EV
   ├── Routing
   ├── Energy
   ├── Charging
   ├── Reservation
   ├── Payment
   ├── Parking
   ├── IoT
   └── Analytics
        ↓
 PostgreSQL
        +
 MQTT
        ↓
 ESP32
 ├── Sensor
 └── Lock
