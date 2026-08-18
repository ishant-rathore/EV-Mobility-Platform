# EV Mobility Platform — MVP Scope

**Version:** 1.0  
**Status:** Frozen SIH 2026 MVP

---

## 1. MVP Objective

Build a working end-to-end EV mobility journey that connects:

**EV Profile → Route → Energy → Charging → Reservation → Payment → Parking → IoT → Analytics**

The MVP must demonstrate the complete user journey rather than implementing every possible future feature.

---

# 2. P0 — Must Have

## Driver

- User registration/login
- EV profile
- Battery/SOC
- Origin
- Destination
- Journey planning
- Route display
- Energy estimation
- Charging requirement detection
- Charging station discovery
- Station ranking
- Station recommendation
- Charging cost estimate
- Charging reservation
- Parking reservation
- Payment flow
- Booking confirmation
- Trip/session status

## Smart Parking / IoT

- Parking bay
- Occupancy sensor
- ESP32/ESP8266
- MQTT communication
- Smart lock/servo
- Authorized unlock
- Occupancy update
- Device status

## Operator

- Station dashboard
- Parking status
- Reservation overview
- Basic analytics

## Backend

- REST API
- Authentication
- PostgreSQL
- Prisma
- EV services
- Routing services
- Charging services
- Reservation services
- Payment services
- Parking services
- IoT services

---

# 3. P0 Demo Flow

```text
LOGIN
 ↓
EV PROFILE
 ↓
BATTERY/SOC
 ↓
ORIGIN + DESTINATION
 ↓
ROUTE
 ↓
ENERGY ESTIMATION
 ↓
CHARGING REQUIRED?
 ↓
STATION RANKING
 ↓
RECOMMENDED STATION
 ↓
RESERVE CHARGING
 ↓
RESERVE PARKING
 ↓
PAYMENT
 ↓
CONFIRMATION
 ↓
ARRIVAL
 ↓
MQTT
 ↓
ESP32
 ↓
SMART LOCK
 ↓
OCCUPANCY
 ↓
SESSION
 ↓
COMPLETE
