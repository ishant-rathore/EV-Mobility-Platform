# Pay&Park — Product Requirements Document (PRD)

**Product:** Pay&Park — Intelligent EV Mobility, Charging & Smart Parking Platform  
**SIH Alignment:** Smart India Hackathon 2026 — Problem Statement #08: EV Mobility Platform  
**Document Version:** 1.0  
**Date:** August 2026  
**Status:** Product baseline / SIH MVP definition  
**Primary Platform:** Web-first responsive application; mobile app follows using the same backend  
**Target MVP:** End-to-end EV journey planning → charging recommendation → reservation/payment → smart parking/IoT demonstration

---

## 1. Executive Summary

Pay&Park is an intelligent EV mobility platform designed to reduce range anxiety and the friction between route planning, energy requirements, charging-station selection, charging reservation, parking reservation, and physical access.

The product's core differentiator is **battery-aware journey planning**. Instead of simply displaying charging stations, Pay&Park uses a driver's origin, destination, EV profile, state of charge (SOC), estimated vehicle efficiency, route characteristics, and available charging options to determine whether charging is required and which charging station provides the best overall journey outcome.

The platform then connects that digital recommendation to a transactional workflow: compare stations, reserve charging and an associated parking bay, pay, navigate to the location, and use the IoT layer to manage parking access and occupancy.

The existing Pay&Park project already contains substantial parking-marketplace, booking, payment, ESP32, MQTT, sensor, and smart-flap-lock work. Under the updated SIH PS #08 direction, those capabilities become the **physical mobility layer**, while EV routing, energy estimation, charging intelligence, and station ranking become the product's primary intelligence layer.

The documented P0 scope includes an EV profile, route planning with SOC/energy estimation, charging-station discovery and ranking, charging/parking reservation, payment, ESP32/MQTT smart parking, and basic analytics. fileciteturn6file2

### Product promise

> **Plan. Charge. Park. Go.**

### One-line value proposition

> **Pay&Park plans the EV journey around the vehicle's battery, recommends the best charging stop using transparent energy/cost/wait/detour factors, and connects charging with reservable smart parking and IoT access.**

---

# 2. Product Context and Baseline

## 2.1 Existing Pay&Park foundation

The original Pay&Park product was centered on a private parking marketplace with booking, digital payment, real-time occupancy, and IoT smart parking access. The project already defines a modular architecture around React/TypeScript, Node.js/Express, PostgreSQL/Prisma, MQTT, ESP32, sensors, servo control, and Docker-oriented deployment.

Existing parking research identifies discovery, navigation, live availability, reservation, payment, booking history, notifications, owner/admin dashboards, and analytics as common industry capabilities. It also identifies private parking, IoT smart locks, real-time occupancy, and EV charging reservation as differentiation opportunities. fileciteturn6file6 fileciteturn6file17

## 2.2 Updated product direction

The product is now explicitly aligned to EV mobility.

### Old framing

`Search → Book → Pay → Unlock → Park`

### New framing

`Plan → Route → Calculate Energy → Find Charging → Optimize → Reserve → Pay → Park → Charge → Monitor → Analyze`

The EV Mobility Platform strategy explicitly defines this new direction and recommends keeping AI demand prediction, dynamic pricing, predictive maintenance, fleet optimization, and full Smart City capabilities outside the SIH MVP. fileciteturn6file0

## 2.3 Implementation-status rule

This PRD separates:

- **Implemented / Prototype:** capabilities already evidenced by the existing Pay&Park project.
- **P0 MVP:** functionality that must be implemented for the EV-aligned SIH demonstration.
- **P1:** valuable extensions if time permits.
- **P2 / Future:** capabilities requiring additional data, integrations, or production maturity.

No capability should be described as "working" merely because it appears in a roadmap or architecture document.

---

# 3. Problem Statement

## 3.1 Primary problem

EV drivers currently face fragmented mobility decisions:

1. Where can I go with my current battery?
2. Will I need to charge before reaching the destination?
3. Which charging station is best for this trip?
4. Will the charger be available when I arrive?
5. What will charging cost?
6. How much time will charging add?
7. Is there a parking bay available with the charger?
8. Can I reserve both?
9. Can I access the reserved bay without manual intervention?

A typical charger finder solves only a subset of this chain.

## 3.2 User pain points

### EV drivers

- Range anxiety.
- Uncertainty about energy consumption.
- Poor comparison of charging alternatives.
- Stale or incomplete station information.
- Unknown waiting time.
- Charging and parking handled separately.
- Uncertainty about total trip time and cost.

### Charging/parking operators

- Uneven utilization.
- Limited visibility into demand.
- Queue uncertainty.
- Poor coordination between charger and parking-bay availability.
- Limited operational analytics.

### Cities and infrastructure planners

- Fragmented utilization data.
- Limited visibility into charger demand.
- Difficulty identifying where additional infrastructure is needed.

The project strategy identifies range anxiety, charge-park coordination, station-data gaps, and operational blind spots as the central problems Pay&Park should address. fileciteturn6file2turn6file3

---

# 4. Product Vision

> **Make every EV journey predictable by connecting battery intelligence, route planning, charging decisions, parking reservations, payments, and physical infrastructure into one mobility workflow.**

## 4.1 Mission

Build an affordable, modular EV mobility platform that:

- Reduces range anxiety.
- Reduces unnecessary charging detours.
- Makes charging decisions explainable.
- Improves charging/parking utilization.
- Enables reservation before arrival.
- Connects digital bookings to physical IoT infrastructure.

---

# 5. Goals and Non-Goals

## 5.1 Product goals

### G1 — Battery-aware planning
Given an EV, SOC, origin, and destination, estimate energy requirements and identify charging needs.

### G2 — Intelligent station selection
Rank candidate stations using transparent factors including:

- Route detour.
- Estimated charging cost.
- Waiting time.
- Availability.
- Distance.
- Charger compatibility.

### G3 — Integrated reservation
Allow users to reserve a charging session and associated parking bay where supported.

### G4 — Physical infrastructure integration
Demonstrate that a confirmed reservation can control a smart parking lock and update occupancy using ESP32 + MQTT.

### G5 — Operational visibility
Provide basic analytics for station/parking utilization.

### G6 — SIH-ready demonstrability
Create one reliable end-to-end flow that can be demonstrated live.

## 5.2 Non-goals for SIH MVP

The following are explicitly excluded from P0:

- ANPR.
- CCTV/computer vision.
- Full fleet management.
- Public-transport integration.
- Digital twins.
- Kubernetes/multi-region infrastructure.
- Nationwide deployment.
- Advanced dynamic pricing.
- Predictive maintenance.
- Production-grade ML forecasting.
- V2G/grid optimization.

These are future capabilities rather than MVP deliverables. fileciteturn6file5

---

# 6. Target Users and Stakeholders

## 6.1 EV Driver — Primary user

Needs to plan and execute a trip with confidence.

Key needs:

- Store EV profile.
- Enter SOC.
- Set destination.
- See route energy requirement.
- Know whether charging is required.
- Compare charging stations.
- Reserve charging/parking.
- Pay.
- Navigate.
- Access the reserved bay.
- Monitor the active session.

## 6.2 Charging Station Operator

Needs:

- Station registration.
- Charger inventory.
- Availability updates.
- Reservation visibility.
- Session statistics.
- Utilization analytics.

## 6.3 Parking/Charging Site Operator

Needs:

- Parking-bay availability.
- Reservation management.
- IoT device status.
- Occupancy monitoring.
- Access control.

## 6.4 Admin

Needs:

- User management.
- Station management.
- Parking management.
- Booking/payment monitoring.
- Device monitoring.
- Basic system analytics.

## 6.5 Future stakeholders

- Fleet managers.
- Municipalities.
- EV manufacturers.
- Energy providers.
- Charging-network operators.

---

# 7. Product Scope

## P0 — SIH MVP

| Capability | Priority | Acceptance target |
|---|---|---|
| User authentication | P0 | Register/login works reliably |
| EV profile | P0 | Vehicle + battery + efficiency stored |
| SOC input | P0 | User can enter current battery % |
| Origin/destination | P0 | Coordinates or map locations accepted |
| Route calculation | P0 | Route and distance returned |
| Energy estimation | P0 | Estimated kWh and arrival SOC shown |
| Charging requirement | P0 | System determines whether charging is required |
| Station discovery | P0 | Candidate stations displayed |
| Station ranking | P0 | Stations ranked by transparent score |
| Charging cost estimate | P0 | Estimated charging cost shown |
| Availability | P0 | Station/charger status displayed from available data |
| Charging reservation | P0 | User can reserve a charger/session |
| Parking reservation | P0 | Associated bay can be reserved where supported |
| Payment | P0 | Test payment flow completes |
| Smart parking IoT | P0 | ESP32 receives authorized command |
| Occupancy detection | P0 | Sensor changes bay status |
| Basic analytics | P0 | Sessions/utilization displayed |
| End-to-end demo | P0 | Plan → reserve → pay → IoT → occupancy |

The project's EV platform document defines this P0 set explicitly. fileciteturn6file16

## P1

- Live traffic.
- Weather-aware energy adjustments.
- Better energy model.
- Dynamic wait-time updates.
- SOC-based charging guidance.
- Charging-session tracking.
- Operator dashboard.
- Advanced parking integration.
- Push notifications.

## P2

- ML demand forecasting.
- Queue prediction.
- Dynamic pricing.
- Fleet optimization.
- Predictive maintenance.
- Smart City integration.
- Grid/V2G intelligence.
- Large-scale station-placement optimization.

---

# 8. Core User Journey

## 8.1 Hero journey

```text
Open Pay&Park
      ↓
Select / Load EV Profile
      ↓
Enter Current SOC
      ↓
Enter Origin + Destination
      ↓
PLAN JOURNEY
      ↓
Calculate Route
      ↓
Estimate Energy Consumption
      ↓
Determine Charging Need
      ↓
Find Candidate Stations
      ↓
Rank Stations
      ↓
Compare Cost + Wait + Detour + Availability
      ↓
Select Station
      ↓
Reserve Charger + Parking Bay
      ↓
Payment
      ↓
Booking Confirmed
      ↓
Navigate
      ↓
Arrive
      ↓
IoT Authorization
      ↓
ESP32 / MQTT
      ↓
Smart Flap Unlock
      ↓
Occupancy Sensor
      ↓
Charging / Parking Session
      ↓
Session Completion
      ↓
Analytics
```

---

# 9. Functional Requirements

## FR-001 — User Registration

**Description:** Users can create an account.

**Inputs:**
- Name.
- Email.
- Password.
- Optional phone number.

**Acceptance criteria:**
- Valid registration creates a user.
- Duplicate email is rejected.
- Password is securely hashed.
- Validation errors are clear.

## FR-002 — Authentication

**Description:** Users can log in and receive authenticated access.

**Acceptance criteria:**
- Correct credentials produce a valid session/token.
- Invalid credentials are rejected.
- Protected APIs require authentication.
- Refresh/logout behavior is implemented according to the final auth design.

## FR-003 — EV Profile

User can store:

- Vehicle make/model.
- Battery capacity.
- Usable battery capacity, where known.
- Energy-efficiency estimate.
- Charger compatibility.
- Current SOC.

**Acceptance criteria:**
- Vehicle profile is retrievable.
- SOC is validated from 0–100%.
- Vehicle data is associated with the authenticated user.

## FR-004 — Journey Planning

User enters:

- Origin.
- Destination.
- EV profile.
- Current SOC.

System returns:

- Route.
- Distance.
- Estimated duration.
- Estimated energy consumption.
- Estimated arrival SOC.
- Charging requirement.

## FR-005 — Energy Estimation

The MVP uses a transparent engineering model rather than claiming AI.

A simplified segment model may consider:

- Distance.
- Vehicle efficiency.
- Elevation/slope.
- Rolling resistance.
- Aerodynamic effects.
- Auxiliary loads.

The project's EV platform design explicitly proposes a physics-based energy model incorporating rolling resistance, aerodynamic drag, slope/elevation, and auxiliary loads. fileciteturn6file16

### Product rule

If a factor is unavailable, the system must:

1. Use a documented fallback assumption.
2. Show/record the assumption where useful.
3. Avoid presenting the estimate as exact.

## FR-006 — Charging Requirement

The engine evaluates:

`Estimated required energy <= usable battery energy`

and determines whether charging is required along the route.

The system should maintain a configurable safety reserve to avoid planning a route that relies on reaching 0% SOC.

## FR-007 — Station Discovery

The system retrieves candidate stations:

- Along route.
- Near route.
- Near destination when appropriate.

Each candidate should include, where data exists:

- Station name.
- Coordinates.
- Charger type.
- Power rating.
- Availability.
- Price.
- Estimated wait.
- Distance.
- Detour.

## FR-008 — Station Ranking

The system must rank candidates rather than simply list them.

### Transparent baseline score

A normalized score may be:

`Score = wA*Availability + wC*Cost + wW*Wait + wD*Detour + wP*Power`

The weights must be configurable.

The UI should explain why a station was recommended.

Example:

> **Recommended because it has low detour, lower estimated cost, and an available fast charger.**

The project strategy explicitly recommends transparent weighted optimization for the MVP and ML only after sufficient historical data exists. fileciteturn6file13

## FR-009 — Charging Cost Estimate

The system estimates cost using:

- Required kWh.
- Station tariff.
- Any known session/booking fee.

The estimate must clearly distinguish:

- Estimated.
- Confirmed.
- Operator-provided.

## FR-010 — Reservation

User can reserve:

- Charger.
- Time window/session.
- Associated parking bay where available.

Reservation must prevent conflicting bookings.

## FR-011 — Payment

The MVP uses the project's planned payment integration in test mode.

Payment states:

- Pending.
- Authorized/processing.
- Successful.
- Failed.
- Refunded where applicable.

Booking must not become fully confirmed solely because a payment screen was opened.

## FR-012 — Parking Bay Reservation

For sites supporting integrated parking:

- Assign bay.
- Record reservation window.
- Link bay to charging reservation.
- Expose bay identifier to the user.

## FR-013 — IoT Access

After a valid confirmed reservation and when the access policy allows:

1. Backend authorizes access.
2. Backend publishes an MQTT command.
3. ESP32 receives command.
4. Servo operates the smart flap lock.
5. Access event is logged.

## FR-014 — Occupancy Detection

ESP32 publishes occupancy status.

Backend updates:

- Bay state.
- Parking session.
- Device heartbeat/status.

The existing Pay&Park prototype already defines the MQTT/ESP32/sensor/servo workflow. fileciteturn6file4

## FR-015 — Active Session

The user sees:

- Station.
- Bay.
- Reservation.
- Session state.
- Charging/parking time where supported.
- Current occupancy state.

## FR-016 — Session Completion

On exit:

- Session becomes completed.
- Occupancy returns to available after validated exit logic.
- Reservation/session history is updated.
- Analytics are updated.

## FR-017 — Notifications

P0 may use basic in-app status messaging.

P1 can add:

- Reservation reminder.
- Arrival reminder.
- Payment confirmation.
- Session completion.
- Low SOC alert.

## FR-018 — Operator Analytics

Basic dashboard:

- Number of sessions.
- Reservations.
- Utilization.
- Peak usage.
- Revenue/transaction value where applicable.
- Device status.

---

# 10. User Stories

## EV Driver

### US-001
As an EV driver, I want to save my vehicle details so that Pay&Park can estimate my energy needs.

**Acceptance:** Vehicle profile stores battery capacity and efficiency data.

### US-002
As an EV driver, I want to enter my current SOC so that the route planner knows my available energy.

### US-003
As an EV driver, I want to enter a destination so that the system can plan my journey.

### US-004
As an EV driver, I want to know whether I need to charge before reaching my destination.

### US-005
As an EV driver, I want charging stations ranked by cost, wait, availability, and detour.

### US-006
As an EV driver, I want to understand why a station was recommended.

### US-007
As an EV driver, I want to reserve a charging session.

### US-008
As an EV driver, I want to reserve a parking bay with my charging session.

### US-009
As an EV driver, I want to pay digitally.

### US-010
As an EV driver, I want to unlock the reserved parking bay without staff intervention.

### US-011
As an EV driver, I want to see whether my bay is occupied/available.

### US-012
As an EV driver, I want to view my completed charging and parking sessions.

## Operator

### US-020
As an operator, I want to register chargers and bays.

### US-021
As an operator, I want to view current availability.

### US-022
As an operator, I want to see utilization analytics.

### US-023
As an operator, I want to know when an IoT device is offline.

## Admin

### US-030
As an administrator, I want to manage users, stations, reservations, and devices.

---

# 11. Non-Functional Requirements

## NFR-001 — Performance

Targets for the SIH prototype:

- Common API requests should normally return within a responsive interactive threshold.
- Route/optimization requests should provide progress/loading feedback.
- UI must never appear frozen during external API calls.

The exact performance number should be measured during testing rather than claimed prematurely.

## NFR-002 — Availability

The system should:

- Detect IoT device loss.
- Recover MQTT connections.
- Avoid silently confirming unavailable reservations.
- Fail safely when external data is unavailable.

## NFR-003 — Security

- Password hashing.
- JWT/secure authentication.
- Role-based authorization.
- HTTPS in deployed environments.
- Input validation.
- Protected payment webhooks.
- MQTT authentication and topic authorization.
- No secrets committed to Git.

## NFR-004 — Data integrity

Booking creation and payment confirmation must be transactionally consistent.

No two users should receive the same exclusive charger/bay reservation for overlapping windows.

## NFR-005 — Explainability

Every recommendation must have understandable factors.

The MVP should not present a black-box "AI score" without explanation.

## NFR-006 — Maintainability

Use modular services/modules and TypeScript.

Existing project architecture already favors React/TypeScript, Node.js/Express, PostgreSQL/Prisma, MQTT, ESP32, and Docker. fileciteturn5file14

## NFR-007 — Scalability

Architecture should allow:

- More stations.
- More parking bays.
- More IoT devices.
- More users.
- Additional cities.

Horizontal backend scaling and MQTT topic isolation remain appropriate future production strategies.

---

# 12. Recommendation Engine

## 12.1 Inputs

- Station distance.
- Route detour.
- Charger compatibility.
- Charger power.
- Availability.
- Price.
- Estimated wait.
- Required charging energy.
- User preferences.

## 12.2 Hard filters

Before scoring, eliminate stations that:

- Cannot serve the vehicle.
- Cannot be reached with current energy and safety reserve.
- Have no suitable charger.
- Are unavailable for the requested time.
- Have no bookable bay when parking is mandatory.

## 12.3 Ranking

Normalize factors to a common range.

Example:

`FinalScore = 0.25*Availability + 0.20*Cost + 0.20*Wait + 0.20*Detour + 0.15*Power`

Weights are product configuration, not immutable constants.

## 12.4 Recommendation explanation

The result should state:

- Best overall.
- Cheapest.
- Fastest.
- Lowest detour.

This makes the engine useful even when users disagree with the default recommendation.

---

# 13. Data Model

Core entities:

```text
User
 ├── EVProfile
 ├── Booking
 ├── Payment
 └── Notification

EVProfile
 └── Vehicle

Journey
 ├── Route
 ├── EnergyEstimate
 └── ChargingPlan

ChargingStation
 ├── Charger
 ├── StationAvailability
 └── StationTariff

ParkingSite
 └── ParkingBay
       └── IoTDevice

Booking
 ├── ChargingReservation
 ├── ParkingReservation
 ├── Payment
 └── ParkingSession

IoTDevice
 ├── DeviceHeartbeat
 ├── OccupancyEvent
 └── AccessEvent
```

## Recommended additional fields

### EVProfile

- id
- userId
- vehicleModel
- batteryCapacityKWh
- usableBatteryCapacityKWh
- efficiencyWhPerKm
- chargerTypes
- currentSoc
- createdAt
- updatedAt

### Journey

- id
- userId
- origin
- destination
- requestedAt
- routeDistanceKm
- estimatedDurationMin
- estimatedEnergyKWh
- arrivalSoc
- status

### ChargingStation

- id
- provider
- name
- latitude
- longitude
- address
- status
- dataSource
- lastSyncedAt

### Charger

- id
- stationId
- connectorType
- powerKW
- status
- pricePerKWh

### ParkingBay

- id
- siteId
- bayNumber
- status
- chargerId nullable
- iotDeviceId nullable

### Reservation

- id
- userId
- stationId
- chargerId
- parkingBayId nullable
- startTime
- endTime
- status
- totalAmount

---

# 14. API Requirements

Use versioned REST APIs.

## Authentication

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
```

## EV Profile

```http
GET    /api/v1/ev/profile
POST   /api/v1/ev/profile
PUT    /api/v1/ev/profile
```

## Journey

```http
POST /api/v1/journeys/plan
GET  /api/v1/journeys/:id
```

### Example request

```json
{
  "origin": {"lat": 18.5204, "lng": 73.8567},
  "destination": {"lat": 19.0760, "lng": 72.8777},
  "socPercent": 38,
  "vehicleProfileId": "..."
}
```

### Example response

```json
{
  "journeyId": "...",
  "distanceKm": 152.4,
  "estimatedEnergyKWh": 31.8,
  "estimatedArrivalSoc": 11.2,
  "chargingRequired": true,
  "recommendedStops": [
    {
      "stationId": "...",
      "score": 0.87,
      "reason": [
        "Low route detour",
        "Suitable DC charger",
        "Good availability"
      ]
    }
  ]
}
```

## Stations

```http
GET /api/v1/stations
GET /api/v1/stations/:id
GET /api/v1/stations/:id/availability
```

## Reservations

```http
POST /api/v1/reservations
GET  /api/v1/reservations
GET  /api/v1/reservations/:id
DELETE /api/v1/reservations/:id
```

## Payments

```http
POST /api/v1/payment/create
POST /api/v1/payment/webhook
GET  /api/v1/payment/history
```

## IoT

```http
POST /api/v1/iot/open
POST /api/v1/iot/update
GET  /api/v1/iot/status
GET  /api/v1/iot/device/:id
```

The original Pay&Park documentation already defines a compact MVP API around authentication, parking, booking, payment, IoT, user, and admin modules. The EV PRD extends that contract with EV profile, journey, station, charger, and reservation concepts. fileciteturn6file4

---

# 15. MQTT Requirements

Recommended topic structure:

```text
paypark/{siteId}/{bayId}/command
paypark/{siteId}/{bayId}/status
paypark/{siteId}/{bayId}/occupancy
paypark/{siteId}/{bayId}/heartbeat
```

## Command example

```json
{
  "commandId": "uuid",
  "action": "UNLOCK",
  "reservationId": "uuid",
  "expiresAt": "timestamp"
}
```

## Status example

```json
{
  "deviceId": "ESP32-001",
  "bayId": "BAY-01",
  "locked": false,
  "occupied": true,
  "timestamp": "..."
}
```

## Safety rules

- Commands must be authorized.
- Commands should expire.
- Duplicate commands should be safely handled.
- Every access event should be logged.
- Device heartbeat timeout should mark a device offline.

The project strategy already defines MQTT/ESP32 as the physical infrastructure layer and includes heartbeat/offline handling. fileciteturn6file7

---

# 16. UX / Screen Requirements

## Driver P0 screens

1. Landing/Home.
2. Login/Register.
3. EV Profile.
4. Journey Planner.
5. Route Result.
6. Charging Station List.
7. Station Details.
8. Station Comparison.
9. Reservation.
10. Payment.
11. Booking Confirmation.
12. Navigation/Arrival.
13. Smart Parking Access.
14. Active Charging/Parking Session.
15. History/Profile.

## Hero screen

```text
┌─────────────────────────────────────┐
│ Where are you going?                │
│ [ Pune → Mumbai                  ]  │
│                                     │
│ EV: Tata Nexon EV                   │
│ Battery: 38%                        │
│                                     │
│ Estimated energy: 31.8 kWh          │
│ Charging required: YES              │
│                                     │
│ Recommended Station                 │
│ ───────────────────────────────     │
│ DC Fast • 4/6 available             │
│ ₹X/kWh • ~8 min wait                │
│ 3.2 km detour                       │
│                                     │
│ [ RESERVE CHARGING + PARKING ]      │
└─────────────────────────────────────┘
```

The project EV document already identifies this journey-result screen as the hero UI concept. fileciteturn6file11

---

# 17. Booking State Machine

```text
DRAFT
  ↓
PENDING_PAYMENT
  ↓
PAYMENT_VERIFIED
  ↓
CONFIRMED
  ↓
ARRIVING
  ↓
ACCESS_AUTHORIZED
  ↓
ACTIVE
  ↓
COMPLETED
```

Failure paths:

```text
PENDING_PAYMENT → PAYMENT_FAILED
CONFIRMED → CANCELLED
CONFIRMED → EXPIRED
ACTIVE → ERROR_REVIEW
```

## Rules

- A reservation cannot become ACTIVE without valid confirmation.
- IoT unlock requires an authorized reservation.
- A device being offline must not silently create a false "unlocked" state.
- Availability is released after cancellation/expiration/completion according to booking policy.

---

# 18. Error Handling

| Scenario | Response |
|---|---|
| Invalid SOC | Reject with validation message |
| Vehicle incompatible | Explain incompatible charger |
| Insufficient range | Recommend reachable charging stop |
| Station data stale | Show stale-data indicator |
| No stations found | Suggest destination/route alternatives |
| Reservation conflict | Recalculate availability |
| Payment failure | Keep reservation pending or release according to timeout |
| MQTT unavailable | Mark device unavailable; provide manual fallback if configured |
| Sensor offline | Mark bay/device state uncertain |
| Route API failure | Show retry/fallback state |
| Database failure | Do not confirm transaction |

---

# 19. External Data Strategy

Charging-station data is a major dependency.

The system should support a provider abstraction:

```text
StationProvider
 ├── Public API Provider
 ├── Operator API Provider
 └── Demo/Mock Provider
```

Every station record should carry:

- `source`
- `lastSyncedAt`
- `confidence/status`

## Demo mode

Because real-time operator APIs may not be available during SIH, the system must support a controlled demo dataset.

**Important:** Demo data must be clearly identified as simulated or test data.

The project research explicitly calls out station-data unreliability and recommends multiple sources plus validation and "dirty data" warnings. fileciteturn6file9

---

# 20. Analytics Requirements

## Driver analytics

- Trips planned.
- Energy consumed/estimated.
- Charging sessions.
- Charging cost.
- Journey efficiency.
- Time spent charging.

## Operator analytics

- Station utilization.
- Charger utilization.
- Parking-bay utilization.
- Sessions per day.
- Peak hours.
- Average charging duration.
- Average wait.
- Revenue/transaction value.
- Device downtime.

The existing EV platform document defines these analytics categories. fileciteturn6file5

---

# 21. Security Requirements

## Application

- HTTPS.
- Secure authentication.
- Password hashing.
- JWT with expiry/refresh policy.
- RBAC.
- Input validation.
- Rate limiting for sensitive endpoints.

## Payments

- Server-side payment verification.
- Webhook signature verification.
- Never trust client-side payment success alone.

## IoT

- Unique device identity.
- Authenticated MQTT connection.
- Topic-level authorization.
- Expiring commands.
- Access logs.
- Device heartbeat.
- Manual emergency override where required.

## Data

- No secrets in source control.
- Environment variables.
- Database access restrictions.
- Audit logs for sensitive actions.

---

# 22. Hardware Requirements

## Prototype

- ESP32.
- Ultrasonic occupancy sensor.
- Servo motor.
- Smart parking flap lock.
- Power supply.
- Wi-Fi connectivity.

## Functional behavior

```text
Confirmed Reservation
       ↓
Authorized Unlock
       ↓
MQTT Command
       ↓
ESP32
       ↓
Servo
       ↓
Flap Opens
       ↓
Vehicle Enters
       ↓
Sensor Detects Vehicle
       ↓
MQTT Occupancy
       ↓
Backend
       ↓
Parking Bay = OCCUPIED
```

This preserves the strongest existing Pay&Park hardware capability while repositioning it as EV charging/parking infrastructure.

---

# 23. Technology Requirements

## Frontend

The current project direction supports:

- React + TypeScript for web-first development.
- React Native + Expo for later mobile delivery.

## Backend

- Node.js.
- Express.js.
- TypeScript.
- Prisma.

## Database

- PostgreSQL.

## IoT

- ESP32.
- MQTT.
- Ultrasonic sensor.
- Servo motor.

## Payments

- Razorpay test mode for MVP where supported.

## Maps

- Google Maps or a compatible routing/maps provider.

## DevOps

- Git/GitHub.
- Docker.
- GitHub Actions as time permits.

The documented Pay&Park stack recommends TypeScript, React Native/Expo, Node.js/Express, Prisma, PostgreSQL, MQTT, ESP32, JWT, Razorpay, Docker, and GitHub. fileciteturn5file14

---

# 24. Architecture Requirements

```text
                 ┌──────────────────────┐
                 │ Web / Mobile Client  │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │ Node.js / Express    │
                 └──────────┬───────────┘
                            │
       ┌────────────────────┼────────────────────┐
       ▼                    ▼                    ▼
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│ EV Mobility │     │ Booking /    │     │ Auth / User  │
│ Engine      │     │ Payment      │     │ Services     │
└──────┬──────┘     └──────┬───────┘     └──────────────┘
       │                   │
       ▼                   ▼
┌─────────────┐     ┌──────────────┐
│ Station /   │     │ PostgreSQL   │
│ Charging    │     └──────────────┘
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ MQTT Broker │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ ESP32       │
└─────┬───────┘
      ├──────────────► Occupancy Sensor
      └──────────────► Servo / Flap Lock
```

The architecture should remain modular, but **do not split into microservices for the SIH MVP**. Logical modules inside one Node.js backend are sufficient.

---

# 25. Implementation Strategy

## Sprint 1 — Foundation

- Freeze requirements.
- Database schema.
- EV profile.
- Authentication.
- Repository setup.

## Sprint 2 — EV Intelligence

- Journey planning.
- Route integration.
- Energy estimation.
- Charging requirement.
- Station discovery.
- Station ranking.

## Sprint 3 — Transaction Layer

- Station details.
- Reservation.
- Parking reservation.
- Payment.
- Booking state machine.

## Sprint 4 — IoT Integration

- MQTT broker.
- ESP32 connection.
- Unlock command.
- Occupancy sensor.
- Device heartbeat.
- Backend synchronization.

## Sprint 5 — Integration

- Full journey.
- Analytics.
- Error states.
- Security tests.
- Demo data.
- UI polish.

The existing EV platform strategy uses a 20-day plan with EV routing/station ranking first, backend and frontend next, then MQTT/ESP32, followed by integration, QA, and demo preparation. fileciteturn6file7

---

# 26. Acceptance Criteria

## AC-001 — Journey planning

Given:

- Valid EV profile.
- Valid origin.
- Valid destination.
- Valid SOC.

When the user plans a trip,

Then the system returns:

- Route.
- Distance.
- Estimated energy.
- Estimated arrival SOC.
- Charging requirement.

## AC-002 — Charging recommendation

Given multiple reachable stations,

Then the system ranks them using configured factors and explains the recommendation.

## AC-003 — Reservation

Given an available charger and bay,

Then the system creates a unique reservation and prevents conflicting bookings.

## AC-004 — Payment

Given a valid test payment,

Then payment is verified server-side and reservation becomes confirmed.

## AC-005 — IoT access

Given a confirmed reservation and authorized arrival,

Then the backend issues an MQTT command and the ESP32 operates the lock.

## AC-006 — Occupancy

Given a vehicle enters the bay,

Then the sensor publishes occupancy and the backend updates the bay state.

## AC-007 — Device failure

Given an ESP32 misses the configured heartbeat threshold,

Then the device is marked offline and the UI reflects uncertainty/unavailability.

## AC-008 — Data quality

Given stale station data,

Then the station is marked with a data freshness indicator instead of being presented as guaranteed real-time.

## AC-009 — Explainability

Every recommendation exposes the major factors influencing its rank.

---

# 27. Success Metrics

The MVP should be evaluated using measured results.

## Product

- % of planned journeys producing a valid route.
- % of journeys correctly identifying charging need in test scenarios.
- Station ranking consistency.
- Reservation success rate.
- Payment success rate.
- IoT unlock success rate.
- Occupancy detection accuracy.
- Device heartbeat reliability.

## User experience

- Time to plan journey.
- Time from station selection to reservation.
- Number of screens required to complete a booking.
- Task completion rate.

## Operational

- Station data freshness.
- Average reservation conflict rate.
- Average IoT command latency.
- Device offline detection time.

The project source proposes sample targets such as route-energy error below 10%, payment success ≥98%, occupancy detection ≥95%, and end-to-end reservation completion under 10 seconds. These should be treated as **test targets to validate**, not existing achievements. fileciteturn6file8

---

# 28. Testing Strategy

## Unit tests

- Energy calculations.
- SOC calculations.
- Station scoring.
- Cost calculation.
- Booking validation.

## Integration tests

- Journey → station ranking.
- Booking → payment.
- Payment → reservation confirmation.
- Backend → MQTT.
- MQTT → ESP32.
- Sensor → backend.

## API tests

- Authentication.
- EV profile.
- Journey.
- Station.
- Reservation.
- Payment.
- IoT.

## Hardware tests

- Wi-Fi.
- MQTT connect/reconnect.
- Servo movement.
- Sensor detection.
- Heartbeat.
- Command authorization.

## End-to-end test

```text
Login
 ↓
Load EV
 ↓
SOC
 ↓
Destination
 ↓
Plan
 ↓
Energy
 ↓
Station recommendation
 ↓
Reserve
 ↓
Pay
 ↓
Navigate
 ↓
Unlock
 ↓
Occupancy
 ↓
Session complete
```

---

# 29. Risk Register

| Risk | Severity | Mitigation |
|---|---|---|
| Station data unavailable | High | Demo provider + provider abstraction |
| Energy estimate inaccurate | High | Transparent model + validation scenarios |
| Route API failure | Medium | Retry/fallback |
| Payment failure | High | Test mode + webhook verification |
| IoT failure | High | Heartbeat + retry + manual fallback |
| Sensor false positive | Medium | Calibration + validation |
| Scope creep | Critical | Freeze P0 |
| Insufficient time | Critical | Build hero journey first |
| Security flaw | High | Auth, validation, TLS, MQTT auth |
| External API rate limits | Medium | Caching + controlled demo dataset |

---

# 30. Product Roadmap

## Phase 0 — SIH MVP

Core:

- EV profile.
- SOC.
- Route.
- Energy estimation.
- Charging need.
- Station discovery/ranking.
- Reservation.
- Payment.
- Parking reservation.
- IoT.
- Basic analytics.

## Phase 1 — Post-MVP

- Live traffic.
- Weather.
- Better energy model.
- Queue/wait-time integration.
- Charging-session tracking.
- Operator dashboard.
- Push notifications.

## Phase 2 — Intelligence

- Demand forecasting.
- Queue prediction.
- Dynamic pricing.
- Predictive maintenance.
- Personalized recommendations.
- Fleet optimization.

## Phase 3 — Ecosystem

- Smart City APIs.
- EV manufacturer integrations.
- Grid-aware charging.
- V2G readiness.
- Multi-city deployment.
- Enterprise/fleet solutions.

The project strategy explicitly recommends this P0/P1/P2 separation. fileciteturn6file0

---

# 31. Business Model

## P0

- Charging/parking booking commission.
- Transaction fee.

## P1

- Operator subscription.
- Premium analytics.
- Hardware sales.
- Installation/maintenance.

## P2

- Enterprise SaaS.
- Fleet management.
- Smart City APIs.
- Advanced analytics.
- EV ecosystem partnerships.

The project's EV platform document proposes transaction fees, operator subscriptions, hardware sales, and value-added partnerships. fileciteturn6file12

---

# 32. Competitive Positioning

Existing parking platforms commonly solve:

`Discover → Navigate → Reserve → Pay`

Pay&Park's updated differentiation is:

`Battery → Energy → Route → Charging Need → Station Ranking → Cost → Wait → Reservation → Parking → IoT → Analytics`

The project's research confirms that basic parking discovery, navigation, booking, and payments are already widespread, so Pay&Park should compete on the intelligence and infrastructure layer rather than treating those basics as the innovation. fileciteturn6file6

---

# 33. AI Strategy

## MVP — no fake AI

Use deterministic, explainable optimization.

```text
Vehicle + SOC
     ↓
Energy Model
     ↓
Route
     ↓
Charging Need
     ↓
Hard Constraints
     ↓
Weighted Station Ranking
```

## Future ML

Only after sufficient historical data:

```text
Historical Sessions
       ↓
Feature Engineering
       ↓
ML Model
       ↓
Demand Forecast
       ↓
Queue Forecast
       ↓
Availability Forecast
       ↓
Better Recommendations
```

This is technically credible and aligns with the project's strategy of treating AI demand prediction as future scope. fileciteturn6file11

---

# 34. Demo Script

The SIH demo should focus on one scenario.

### Scenario

> An EV driver starts with 38% SOC and wants to travel from Origin A to Destination B.

### Demo

1. Login.
2. Select EV.
3. Enter 38% SOC.
4. Enter destination.
5. Click **Plan Journey**.
6. Show energy requirement.
7. Show charging required.
8. Show 3–5 candidate stations.
9. Explain recommendation.
10. Select station.
11. Reserve charging + parking.
12. Complete test payment.
13. Show confirmed booking.
14. Navigate/arrival state.
15. Press **Unlock**.
16. Show ESP32 receiving MQTT command.
17. Servo opens flap.
18. Place vehicle/object in bay.
19. Sensor detects occupancy.
20. Backend updates status.
21. Show dashboard/session.
22. Complete session.

### Judge takeaway

> **The system did not just locate a charger. It planned the journey around the battery, selected a charging option, reserved infrastructure, processed the transaction, and connected the digital reservation to physical infrastructure.**

---

# 35. Definition of Done

A P0 feature is considered done only when:

- Requirement is documented.
- UI exists where needed.
- API exists where needed.
- Database model is implemented.
- Validation exists.
- Error states exist.
- Unit/integration test exists where practical.
- Security implications are addressed.
- Feature works in the integrated environment.
- Documentation is updated.
- Feature can be demonstrated.

---

# 36. MVP Release Gate

Pay&Park should **not** be called SIH-ready until the following flow works without manual database manipulation:

```text
EV Profile
    ↓
SOC
    ↓
Origin/Destination
    ↓
Route
    ↓
Energy Estimate
    ↓
Charging Required
    ↓
Station Ranking
    ↓
Reservation
    ↓
Payment
    ↓
Confirmed Booking
    ↓
IoT Authorization
    ↓
MQTT
    ↓
ESP32
    ↓
Unlock
    ↓
Occupancy
    ↓
Session
    ↓
Analytics
```

This is the single most important release criterion.

---

# 37. Documentation Mapping

Recommended documentation updates:

```text
docs/
├── 01-project/
│   ├── Project_Proposal.md
│   ├── Problem_Statement.md
│   ├── Vision_and_Objectives.md
│   ├── Scope.md
│   └── Project_Roadmap.md
│
├── 02-research/
│   ├── SIH_Problem_Analysis.md
│   ├── EV_Mobility_Research.md
│   ├── Charging_Infrastructure_Research.md
│   └── Competitor_Analysis.md
│
├── 03-requirements/
│   ├── PRD.md
│   ├── SRS.md
│   ├── Functional_Requirements.md
│   ├── Non_Functional_Requirements.md
│   ├── User_Stories.md
│   └── Acceptance_Criteria.md
│
├── 04-architecture/
│   ├── System_Architecture.md
│   ├── EV_Mobility_Architecture.md
│   ├── Energy_Model.md
│   ├── Charging_Architecture.md
│   ├── IoT_Architecture.md
│   └── Security_Architecture.md
│
├── 05-database/
├── 06-api/
│   ├── Journey_API.md
│   ├── EV_API.md
│   ├── Charging_API.md
│   ├── Reservation_API.md
│   └── IoT_API.md
│
├── 07-workflows/
│   ├── Journey_Workflow.md
│   ├── Charging_Workflow.md
│   ├── Reservation_Workflow.md
│   └── IoT_Workflow.md
│
├── 08-ui-ux/
├── 09-hardware/
├── 10-testing/
├── 11-deployment/
└── 13-business/
```

The existing documentation structure already separates project, research, requirements, architecture, database, API, workflow, UI/UX, hardware, testing, deployment, security, and business documentation, so the EV PRD should extend that structure rather than create a parallel documentation system. fileciteturn6file18

---

# 38. Final Product Definition

## Pay&Park is NOT:

- Just a parking app.
- Just a charger map.
- Just a booking platform.
- Just an IoT lock.

## Pay&Park IS:

> **An EV mobility intelligence platform that connects battery-aware journey planning with charging-station optimization, charging/parking reservation, payments, and IoT-enabled physical infrastructure.**

### Product architecture in one sentence

**Intelligence decides where/when to charge; the transaction layer reserves it; the IoT layer connects the reservation to the physical bay.**

### Product flow

```text
             PLAN
               ↓
             ROUTE
               ↓
           ENERGY
               ↓
          CHARGING NEED
               ↓
        STATION RANKING
               ↓
       CHARGING + PARKING
           RESERVATION
               ↓
             PAY
               ↓
            ARRIVE
               ↓
            UNLOCK
               ↓
          CHARGE + PARK
               ↓
           MONITOR
               ↓
           COMPLETE
               ↓
           ANALYTICS
```

**This is the frozen PRD baseline for the EV-aligned Pay&Park SIH MVP.**
