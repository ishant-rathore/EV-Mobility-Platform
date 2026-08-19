
# ⚡ EV Mobility Platform — Key Features

**Project:** EV Mobility Platform  
**Working Product:** Pay&Park  
**Document:** Key Features  
**Version:** 1.0  
**Status:** Frozen MVP Feature Baseline  
**Primary Platform:** Responsive Web Application  
**Core Experience:** **Plan → Charge → Park → Go**

---

## 1. Purpose

This document defines the key product capabilities of the EV Mobility Platform.

The platform combines:

- EV journey planning
- Battery/SOC intelligence
- Energy estimation
- Charging-station discovery
- Charging-station ranking
- Charging reservation
- Smart parking
- Parking reservation
- Digital payment
- IoT access control
- Occupancy monitoring
- Charging/parking sessions
- Operational analytics

The objective is to connect these capabilities into **one continuous EV journey** rather than treating charging and parking as separate applications.

---

# 2. Core Product Experience

```text
EV PROFILE
     ↓
CURRENT SOC
     ↓
ORIGIN + DESTINATION
     ↓
ROUTE PLANNING
     ↓
ENERGY ESTIMATION
     ↓
CHARGING REQUIRED?
     ↓
STATION DISCOVERY
     ↓
STATION RANKING
     ↓
CHARGING RESERVATION
     +
PARKING RESERVATION
     ↓
PAYMENT
     ↓
NAVIGATION
     ↓
IoT AUTHORIZATION
     ↓
MQTT
     ↓
ESP32
     ↓
SMART LOCK
     ↓
OCCUPANCY DETECTION
     ↓
CHARGING + PARKING SESSION
     ↓
SESSION COMPLETION
     ↓
ANALYTICS

This is the project's primary end-to-end product flow.


---

3. Feature Priority

Features are classified using the project's MVP priority model.

Priority	Meaning

P0	Must-have for MVP / core demo
P1	Important value-add
P2	Future enhancement


The documented P0 scope includes EV profile, route planning, station discovery/ranking, reservation/payment, smart parking IoT and basic analytics. 


---

4. 🚗 EV Profile & User Management

Priority: P0

The platform allows drivers to maintain the information required for EV-aware journey planning.

Features

User profile

EV profile

Vehicle model

Battery capacity

Current SOC

Energy consumption/efficiency

Connector type

EV preferences


Flow

USER
 ↓
EV PROFILE
 ↓
BATTERY / SOC
 ↓
JOURNEY PLANNING

The EV profile is a core input to the platform's charging and energy intelligence. 


---

5. 🗺️ Smart Journey Planning

Priority: P0

Drivers can enter:

Origin
Destination
EV
Current SOC

The platform calculates a journey and evaluates the EV's energy requirements.

Features

Origin selection

Destination selection

Route calculation

Distance estimation

Travel-time estimation

Route visualization

EV-aware route planning

Charging requirement detection


User experience

WHERE ARE YOU?
      ↓
WHERE ARE YOU GOING?
      ↓
HOW MUCH BATTERY DO YOU HAVE?
      ↓
CAN YOU REACH IT?
      ↓
WHERE SHOULD YOU CHARGE?


---

6. 🔋 Battery & Energy Intelligence

Priority: P0

The platform estimates whether the EV can complete the planned journey and whether charging is required.

MVP baseline

Energy Required
=
Distance × Consumption Rate

Example:

Distance = 200 km
Consumption = 0.15 kWh/km

Energy Required = 30 kWh

The system also considers current SOC and a configurable safety margin.

Outputs

Current SOC
     ↓
Available Energy
     ↓
Energy Required
     ↓
Expected Arrival SOC
     ↓
Charging Required?
     ↓
Charging Target

The project explicitly defines battery-aware planning and energy estimation as a core product capability. 


---

7. ⚡ Charging Station Discovery

Priority: P0

The platform discovers charging stations relevant to the planned journey.

Features

Nearby station discovery

Stations along route

Station map markers

Charger information

Connector compatibility

Charging power

Availability

Pricing

Parking availability


Flow

ROUTE
 ↓
CHARGING REQUIRED
 ↓
FIND STATIONS
 ↓
FILTER ELIGIBLE STATIONS

The documented MVP specifically includes querying charging stations along the route using public API/POI data. 


---

8. 🧠 Intelligent Station Ranking

Priority: P0

The platform does not simply show the nearest charger.

It ranks suitable charging options based on journey-relevant factors.

Ranking factors

Distance
Detour
Price
Waiting Time
Availability
Connector Compatibility
Charging Power
Parking Availability

Flow

AVAILABLE STATIONS
       ↓
COMPATIBILITY FILTER
       ↓
AVAILABILITY FILTER
       ↓
RANKING
       ↓
BEST OPTION

Explainable recommendation

Example:

⚡ Recommended Station

✓ Compatible charger
✓ Charger available
✓ Low route detour
✓ Lower estimated wait
✓ Parking available

The project identifies station ranking as a P0 feature and emphasizes transparent recommendation logic. 


---

9. 📅 Charging Reservation

Priority: P0

Drivers can reserve a compatible charger for a selected time period.

Features

Charger selection

Date/time selection

Availability validation

Reservation creation

Reservation confirmation

Reservation cancellation

Reservation status


Flow

RECOMMENDED CHARGER
       ↓
SELECT TIME
       ↓
CHECK AVAILABILITY
       ↓
RESERVE
       ↓
PAY
       ↓
CONFIRM

The backend must validate availability and prevent reservation conflicts.


---

10. 🅿️ Smart Parking

Priority: P0

The platform connects EV charging with reservable parking infrastructure.

Features

Parking location discovery

Parking bay availability

Parking bay selection

Parking reservation

Occupancy status

Smart access

Parking session tracking


Core relationship

CHARGING STATION
       +
PARKING LOCATION
       ↓
CONNECTED EV STOP

The project's P0 scope explicitly includes reservation of both a charger and parking bay. 


---

11. 🔗 Combined Charging + Parking Reservation

Priority: P0

A key differentiator is connecting charging and parking instead of treating them as independent workflows.

CHARGER
   +
PARKING BAY
   +
TIME SLOT
   ↓
ONE EV RESERVATION FLOW

User experience

Recommended Station
       ↓
Choose Charger
       ↓
Choose Parking Bay
       ↓
Select Time
       ↓
Review Cost
       ↓
Pay
       ↓
Reservation Confirmed


---

12. 💳 Digital Payment

Priority: P0

The platform supports digital payment as part of the reservation workflow.

Features

Payment initiation

Payment status

Payment confirmation

Reservation-payment association

Transaction history

Payment failure handling

Sandbox/test payment support


Secure payment flow

USER
 ↓
RESERVATION
 ↓
PAYMENT
 ↓
PAYMENT PROVIDER
 ↓
SERVER-SIDE VERIFICATION
 ↓
RESERVATION CONFIRMED

Payment confirmation must be verified by the backend before protected actions such as IoT access. 


---

13. 🔐 Secure IoT Access

Priority: P0

A paid and authorized reservation can be connected to physical parking access.

Flow

PAID RESERVATION
       ↓
AUTHORIZATION
       ↓
ONE-TIME / VALID ACCESS TOKEN
       ↓
IoT SERVICE
       ↓
MQTT
       ↓
ESP32
       ↓
SMART LOCK
       ↓
UNLOCK

The frontend must never directly control the ESP32.

The documented security model requires backend authorization before publishing an MQTT unlock command. 


---

14. 📡 MQTT Communication

Priority: P0

MQTT provides communication between the backend IoT layer and physical devices.

BACKEND
   ↓
MQTT BROKER
   ↓
ESP32

Device communication includes

Device status

Occupancy events

Lock commands

Lock status

Connectivity/heartbeat information


Example topics:

device/parking-bay-001/status
device/parking-bay-001/command


---

15. 🔌 ESP32 Smart Parking Controller

Priority: P0

The ESP32 acts as the physical controller for the smart parking prototype.

Responsibilities

Connect to network

Connect to MQTT

Receive authorized commands

Control lock/servo

Read occupancy sensor

Publish device status

Publish occupancy events


MQTT
  ↓
ESP32
 ├── Servo / Lock
 └── Occupancy Sensor

The existing project baseline identifies ESP32/ESP8266, MQTT, sensors and servo/lock control as the IoT foundation. 


---

16. 🅿️ Occupancy Detection

Priority: P0

The parking system detects whether a bay is occupied.

Possible sensors

Ultrasonic Sensor
IR Sensor

Flow

VEHICLE ARRIVES
      ↓
SENSOR DETECTS VEHICLE
      ↓
ESP32
      ↓
MQTT
      ↓
BACKEND
      ↓
BAY = OCCUPIED

When the vehicle leaves:

VEHICLE LEAVES
      ↓
SENSOR DETECTS VACANCY
      ↓
MQTT
      ↓
BACKEND
      ↓
BAY = AVAILABLE

The documented physical charging scenario uses an ultrasonic sensor to detect occupancy and publish the bay status. 


---

17. 🔋 Charging Session Tracking

Priority: P0

The platform records the actual charging session associated with the reservation.

Session information

Start Time
End Time
Vehicle
User
Charger
Energy Delivered
Duration
Cost

Flow

ARRIVE
 ↓
UNLOCK
 ↓
PARK
 ↓
CHARGE
 ↓
SESSION START
 ↓
CHARGING COMPLETE
 ↓
SESSION END
 ↓
RECEIPT / SUMMARY

The existing project scenario explicitly includes logging the charging session when charging begins and showing a final summary when charging is completed. 


---

18. 🅿️ Parking Session Tracking

Priority: P0

The platform tracks the actual use of a reserved parking bay.

Session lifecycle

RESERVED
   ↓
ARRIVED
   ↓
ACTIVE
   ↓
OCCUPIED
   ↓
VACATED
   ↓
COMPLETED

The session can be associated with the reservation, user, vehicle, parking bay and timestamps.


---

19. 🔔 Notifications

Priority: P1

Notifications can inform users about important journey and reservation events.

Examples:

Reservation Confirmed
Reservation Starting Soon
Charging Session Started
Charging Session Completed
Parking Session Started
Parking Session Completed
Low Battery
Payment Failed
IoT Access Failed

Push notifications are identified as a P1 value-add in the documented feature prioritization. 


---

20. 📊 Basic Analytics Dashboard

Priority: P0

Operators can view basic infrastructure usage data.

Metrics

Charging Sessions
Parking Sessions
Station Usage
Peak Hours
Charger Utilization
Parking Utilization
Revenue

The MVP scope explicitly includes a basic analytics dashboard showing station usage and sessions/peak hours. 


---

21. ⚡ Charging Operator Features

Priority: P0/P1

Charging station operators can manage charging infrastructure.

Features

Station Management
Charger Management
Charger Status
Availability
Reservations
Charging Sessions
Pricing
Revenue
Utilization Analytics
Alerts

The operator experience is intended to provide operational visibility over charging infrastructure.


---

22. 🅿️ Parking Operator Features

Priority: P0/P1

Parking operators can manage:

Parking Locations
Parking Bays
Occupancy
Reservations
Parking Sessions
IoT Devices
Access Events

The platform connects the operator dashboard to real-world parking infrastructure.


---

23. 🛡️ Admin Features

Priority: P1

The platform administrator can manage platform-level resources.

Features

User Management
Role Management
Station Management
Parking Management
Device Management
Reservation Monitoring
Payment Monitoring
System Analytics
Configuration
Audit Logs


---

24. 🔒 Authentication & Authorization

Priority: P0

The platform supports role-based access control.

Roles

DRIVER
OPERATOR
PARKING_OPERATOR
ADMIN

Security model

AUTHENTICATION
      ↓
RBAC
      ↓
RESOURCE OWNERSHIP
      ↓
BUSINESS RULES
      ↓
ACTION

The backend is the final authority for authorization. 


---

25. 🧩 Explainable Mobility Intelligence

Priority: P0

The platform's intelligence should be understandable to the user.

Instead of:

AI Score: 0.87

show:

Why this station?

✓ Compatible connector
✓ 1.2 km route detour
✓ Low estimated wait
✓ Competitive charging cost
✓ Parking available

This supports trust and makes the platform's recommendations demonstrable during the hackathon.


---

26. 🌐 External Service Integration

Priority: P0/P1

The platform may integrate external services for:

Maps / Routing
Charging Station Data
Payment
Weather
Traffic

For MVP, external dependencies should remain replaceable and support controlled fallback/mock data for the demo.

The project explicitly identifies external API failure and connectivity as risks requiring fallback strategies. 


---

27. 🧯 Reliability & Fallbacks

The platform must provide controlled behavior when dependencies fail.

Internet failure

Cached / Mock Data

Payment failure

Retry
+
Sandbox fallback

IoT failure

Unable to unlock bay.
Retrying...

Sensor failure

Sensor Offline

The system must not falsely report occupancy when the sensor state is unknown.

External API failure

Fallback / Mock Station Data

These fallback requirements are explicitly documented in the project PRD. 


---

28. 📈 Product Success Metrics

Key MVP outcomes include:

✓ User can plan a journey
✓ Charging need can be identified
✓ Suitable station can be recommended
✓ Charging can be reserved
✓ Parking can be reserved
✓ Payment can be completed
✓ IoT bay access can be demonstrated
✓ Charging/parking session can be tracked
✓ Operators can view basic analytics

The documented target includes enabling users to find and reserve a suitable charger in under two minutes, with reservation/payment and IoT reliability targets for the MVP. 


---

29. Feature Priority Matrix

Feature	Priority	MVP

User Profile	P0	✅
EV Profile	P0	✅
SOC Tracking	P0	✅
Journey Planning	P0	✅
Route Calculation	P0	✅
Energy Estimation	P0	✅
Charging Requirement	P0	✅
Station Discovery	P0	✅
Station Ranking	P0	✅
Charging Reservation	P0	✅
Parking Reservation	P0	✅
Digital Payment	P0	✅
Smart Parking IoT	P0	✅
MQTT	P0	✅
ESP32	P0	✅
Occupancy Detection	P0	✅
Smart Lock	P0	✅
Charging Session	P0	✅
Parking Session	P0	✅
Basic Analytics	P0	✅
Push Notifications	P1	❌
Live Traffic	P1	❌
Live Weather	P1	❌
Dynamic Pricing	P1/P2	❌
Advanced SOC Guidance	P1	❌
ML Demand Forecasting	P2	❌
Smart Charging	P2	❌
V2G	P2	❌
Fleet Optimization	P2	❌
Full Smart City Platform	P2	❌


The P0/P1/P2 classification follows the existing product baseline rather than expanding MVP scope. 


---

30. Feature Dependency Map

USER
 │
 ▼
AUTHENTICATION
 │
 ▼
EV PROFILE
 │
 ▼
JOURNEY
 │
 ├──────────────► ROUTE
 │                  │
 │                  ▼
 │              ENERGY
 │                  │
 │                  ▼
 │          CHARGING REQUIRED?
 │                  │
 │                  ▼
 │             STATIONS
 │                  │
 │                  ▼
 │             RANKING
 │                  │
 │                  ▼
 │            RECOMMENDATION
 │                  │
 └──────────────────┘
                    │
                    ▼
             RESERVATION
              ┌─────┴─────┐
              ▼           ▼
          CHARGER      PARKING
              │           │
              └─────┬─────┘
                    ▼
                 PAYMENT
                    │
                    ▼
              CONFIRMATION
                    │
                    ▼
             IoT AUTHORIZATION
                    │
                    ▼
                  MQTT
                    │
                    ▼
                 ESP32
               ┌────┴────┐
               ▼         ▼
            SENSOR      LOCK
               │         │
               └────┬────┘
                    ▼
              ACTIVE SESSION
                    │
                    ▼
                COMPLETE
                    │
                    ▼
                ANALYTICS


---

31. What Makes the Platform Different?

The platform is not simply:

❌ Charger Locator
❌ Parking App
❌ Booking App
❌ Payment App
❌ IoT Lock

It combines these capabilities into an EV journey orchestration system.

Differentiation

BATTERY-AWARE PLANNING
          +
ENERGY ESTIMATION
          +
CHARGING INTELLIGENCE
          +
CHARGING RESERVATION
          +
PARKING RESERVATION
          +
PAYMENT
          +
IoT ACCESS
          +
OCCUPANCY
          +
ANALYTICS

The product's documented core differentiator is battery-aware journey planning connected to charging/parking reservation and physical IoT infrastructure.


---

32. Feature Philosophy

The platform follows three principles:

1. Intelligence

Don't just show options.
Recommend the better option.

2. Integration

Don't separate charging and parking.
Connect them.

3. Physical execution

Don't stop at digital reservation.
Connect the reservation to the physical infrastructure.


---

33. Final Feature Definition

EV Mobility Platform provides:

🚗 EV PROFILE
        +
🗺️ JOURNEY PLANNING
        +
🔋 ENERGY INTELLIGENCE
        +
⚡ CHARGING DISCOVERY
        +
🧠 STATION RANKING
        +
📅 CHARGING RESERVATION
        +
🅿️ SMART PARKING
        +
📅 PARKING RESERVATION
        +
💳 PAYMENT
        +
🔐 IoT ACCESS
        +
📡 MQTT + ESP32
        +
📍 OCCUPANCY
        +
🔋 CHARGING SESSION
        +
🅿️ PARKING SESSION
        +
📊 ANALYTICS

Core promise

> Plan. Charge. Park. Go.



The platform turns a fragmented EV trip into one connected mobility experience.