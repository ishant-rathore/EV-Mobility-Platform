# EV Mobility Platform — Acceptance Criteria

**Project:** EV Mobility Platform  
**Product:** Pay&Park — Intelligent EV Mobility, Charging & Smart Parking Platform  
**Version:** 1.0  
**Status:** SIH 2026 MVP  
**Priority:** P0 / MVP

---

## 1. Purpose

This document defines the acceptance criteria for the core EV Mobility Platform MVP.

A feature is accepted only when its expected behavior is demonstrated successfully through the application, API, or IoT prototype.

---

## 2. Authentication

### AC-01 — User Registration
- User can create an account using valid information.
- Invalid information must be rejected.
- Duplicate accounts must not be created.

### AC-02 — User Login
- Registered users can log in.
- Invalid credentials must return an error.
- Successful login creates an authenticated session/token.

### AC-03 — Protected Access
- Protected APIs require authentication.
- Users cannot access another user's private data.

---

## 3. EV Profile

### AC-04 — Create EV Profile
User can save:
- EV model
- Battery capacity
- Current SOC
- Efficiency/consumption

### AC-05 — Update EV Profile
User can update EV information.

### AC-06 — SOC Validation
SOC must be between `0%` and `100%`.

---

## 4. Journey Planning

### AC-07 — Origin and Destination
User can enter:
- Origin
- Destination

### AC-08 — Route Calculation
System calculates a route between origin and destination.

### AC-09 — Route Information
System displays:
- Distance
- Estimated travel time
- Route
- Estimated energy requirement

### AC-10 — Energy Calculation
System estimates energy using vehicle efficiency and route distance.

Baseline model:

`Energy Required = Distance × Consumption Rate`

A safety margin may be added.

---

## 5. Battery-Aware Routing

### AC-11 — SOC Calculation
System calculates estimated battery SOC during the journey.

### AC-12 — Charging Requirement
System determines whether charging is required.

### AC-13 — Charging Stop
If current battery is insufficient, the system recommends a charging stop.

### AC-14 — Destination Safety
Recommended charging must leave sufficient battery reserve for the destination.

---

## 6. Charging Station Discovery

### AC-15 — Station Search
System displays charging stations relevant to the journey.

### AC-16 — Station Information
Each station should display, where data is available:
- Station name
- Distance
- Charger type
- Available chargers
- Price
- Estimated waiting time
- Parking availability

### AC-17 — Station Compatibility
System should identify whether the selected station is compatible with the EV.

---

## 7. Station Ranking

### AC-18 — Recommendation
System ranks charging stations using transparent factors.

Possible factors:
- Detour
- Waiting time
- Charging cost
- Distance
- Charger availability
- Compatibility
- Parking availability

### AC-19 — Recommendation Explanation
The system should explain why a station is recommended.

Example:

> Recommended because it has low waiting time, acceptable cost and parking availability.

---

## 8. Charging Reservation

### AC-20 — Select Station
User can select a charging station.

### AC-21 — Select Charging Time
User can select an available charging slot/time.

### AC-22 — Charge Amount
System calculates recommended charging percentage/energy.

### AC-23 — Reservation Confirmation
Successful reservation generates a unique booking ID.

---

## 9. Parking Reservation

### AC-24 — Parking Availability
System displays available parking bays associated with the charging location.

### AC-25 — Reserve Parking
User can reserve an available parking bay.

### AC-26 — Combined Reservation
Charging and parking reservations can be connected to the same journey/booking.

---

## 10. Payment

### AC-27 — Payment Summary
User sees:
- Charging estimate
- Parking cost
- Total amount

### AC-28 — Payment
User can complete the configured MVP payment flow.

### AC-29 — Payment Failure
Failed payments must not create a confirmed reservation.

### AC-30 — Receipt
Successful payment generates a transaction/receipt record.

---

## 11. IoT Parking Access

### AC-31 — Authorized Access
Only an authorized reservation can request parking access.

### AC-32 — Unlock Command
Backend sends the unlock command through MQTT.

### AC-33 — ESP Device
ESP32/ESP8266 receives the MQTT command.

### AC-34 — Smart Lock
Servo/electronic lock changes to the authorized state.

### AC-35 — Occupancy Detection
Sensor detects vehicle presence.

### AC-36 — Occupancy Update
Device publishes occupancy state to the backend.

---

## 12. Charging Session

### AC-37 — Session Start
A valid arrival/occupancy event can start a charging/parking session.

### AC-38 — Session Monitoring
System records session state.

### AC-39 — Session Completion
When the vehicle leaves, the parking bay becomes available.

---

## 13. Analytics

### AC-40 — Operator Analytics
Operator can view basic:
- Station utilization
- Charging sessions
- Parking occupancy
- Reservations
- Revenue/transaction information

### AC-41 — Real-Time Status
IoT status should be reflected in the platform when available.

---

## 14. Error Handling

### AC-42 — Device Offline
System must show an appropriate device-offline state.

### AC-43 — Station Unavailable
Unavailable stations must not be reservable.

### AC-44 — Booking Conflict
A slot/bay already reserved by another user cannot be double-booked.

### AC-45 — API Failure
Frontend displays a user-friendly error.

---

## 15. MVP Golden Path

The following complete flow must work for the SIH demonstration:

`Login`
→ `EV Profile`
→ `Origin/Destination`
→ `Route`
→ `Energy Calculation`
→ `Charging Recommendation`
→ `Station Selection`
→ `Charging Reservation`
→ `Parking Reservation`
→ `Payment`
→ `Booking Confirmation`
→ `IoT Unlock`
→ `Occupancy Detection`
→ `Session`
→ `Completion`
→ `Analytics`

---

## 16. Definition of Done

A P0 feature is considered complete when:

- [ ] Frontend implementation exists
- [ ] Backend/API implementation exists where required
- [ ] Validation exists
- [ ] Error handling exists
- [ ] Database persistence exists where required
- [ ] Test coverage exists for critical logic
- [ ] Feature works in the MVP demo
- [ ] Documentation is updated
