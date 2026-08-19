

# ⚡ EV Mobility Platform — Known Limitations

**Project:** EV Mobility Platform  
**Working Product:** Pay&Park  
**Document:** Known Limitations & Constraints  
**Version:** 1.0  
**Status:** Frozen MVP Limitation Baseline  
**Architecture:** Modular Monolith + IoT Event Layer  
**Primary Principle:** **Be transparent about what the MVP can and cannot guarantee.**

---

# 1. Purpose

This document records the known limitations, constraints, assumptions and boundaries of the EV Mobility Platform MVP.

The purpose is to:

- Prevent overclaiming product capabilities.
- Make technical limitations explicit.
- Guide development decisions.
- Define appropriate fallbacks.
- Prepare the team for hackathon judging.
- Separate MVP functionality from future capabilities.

> **A limitation is not necessarily a failure. It becomes a problem when the system hides or misrepresents it.**

---

# 2. MVP Scope Limitation

The current platform is an **SIH 2026 MVP/prototype**, not a production-scale nationwide EV infrastructure platform.

The MVP prioritizes:

```text
EV PROFILE
    ↓
ROUTE
    ↓
ENERGY
    ↓
CHARGING RECOMMENDATION
    ↓
RESERVATION
    ↓
PAYMENT
    ↓
IoT ACCESS
    ↓
OCCUPANCY
    ↓
SESSION
    ↓
ANALYTICS

Advanced capabilities are intentionally deferred.


---

3. 🔋 Energy Estimation Accuracy

Limitation

EV energy consumption cannot be predicted perfectly using a simple model.

Real-world consumption depends on factors such as:

Vehicle efficiency

Speed

Acceleration

Traffic

Elevation

Road conditions

Temperature

Weather

HVAC usage

Vehicle load

Driving style

Battery condition


The MVP uses a transparent engineering model and may use simplified assumptions when detailed data is unavailable. The project documentation explicitly requires assumptions/fallbacks rather than presenting estimates as exact. 

Current approach

Distance
    +
Vehicle Efficiency
    +
Available Factors
    ↓
Energy Estimate

Limitation

The result is an estimate, not a guaranteed prediction.

Mitigation

Maintain a configurable safety reserve.

Clearly label estimated values.

Record assumptions where appropriate.

Improve the model in future versions.



---

4. 🔋 Charging Curve Simplification

Limitation

The MVP may simplify the actual charging curve of an EV.

Real charging speed can vary according to:

Battery SOC

Battery temperature

Charger power

Vehicle charging limits

Battery management system

Charger availability

Charging curve characteristics


Therefore:

Charging Power × Time

should not automatically be treated as an exact real-world charging result.

Future improvement

Support vehicle-specific charging curves and more accurate charging-time estimation.


---

5. ⚡ Real-Time Charging Availability

Limitation

Charging-station availability may not always be perfectly real-time.

External station data can be:

Delayed

Missing

Incorrect

Temporarily unavailable

Inconsistent between providers


The project explicitly identifies stale/incomplete station data as a risk. 

Example

The platform may show:

Charger: AVAILABLE

while another user has just started using it.

Mitigation

Re-check availability before reservation.

Perform server-side availability validation.

Reject conflicting reservations.

Show timestamps/source information where useful.

Provide fallback/mock data for the controlled hackathon demo.



---

6. 🗺️ External Maps & Routing Dependency

Limitation

Route planning depends on an external maps/routing provider.

If the provider experiences:

API Failure
Rate Limit
Network Failure
Invalid Response
Service Outage

the journey-planning experience may be affected.

Mitigation

External Routing API
       ↓
Success?
   /       \
 YES        NO
 │           │
Route      Fallback
 │        / Cached Data
 ▼
Energy Engine

The system should not silently present unavailable external data as live data.


---

7. 📍 Station Data Dependency

Limitation

The platform does not inherently own all charging-station infrastructure.

Station information may depend on:

External APIs

Operator integrations

Seeded/demo data

Manually maintained information


Therefore the platform cannot guarantee that every listed station represents a verified live physical state.

MVP approach

Use:

Real/External Data
        +
Controlled Demo Data
        +
Fallback Data

where required.


---

8. ⏱️ Waiting-Time Accuracy

Limitation

Estimated charging wait time can change rapidly.

A ranking calculated at:

10:00:00

may become different by:

10:02:00

because another vehicle arrives or a charger becomes unavailable.

Mitigation

Refresh availability.

Recalculate before reservation.

Treat waiting time as an estimate.

Avoid presenting it as a guaranteed value.



---

9. 🧠 Station Recommendation Limitation

Limitation

The MVP recommendation engine is designed to be deterministic and explainable, not a fully trained machine-learning system.

The baseline uses factors such as:

Availability
Cost
Wait
Detour
Distance
Compatibility
Charging Power
Parking Availability

The project explicitly favors transparent weighted optimization for the MVP, with ML-based demand/queue prediction reserved for future scope. 

Therefore

The system should not claim:

> "Our AI perfectly predicts the best charger."



Instead:

> "Our optimization engine ranks eligible charging options using configurable journey-relevant factors."




---

10. 🤖 Advanced AI/ML Limitation

Limitation

The MVP does not require:

Predictive demand ML

Queue prediction ML

Complex route optimization ML

Predictive maintenance

Large-scale machine-learning infrastructure


These are future capabilities.

Current approach

EV Data
   ↓
Deterministic Energy Model
   ↓
Hard Constraints
   ↓
Weighted Ranking
   ↓
Explainable Recommendation

Future

Historical Data
   ↓
Feature Engineering
   ↓
ML Models
   ↓
Demand / Queue Prediction
   ↓
Advanced Recommendations

The project explicitly places predictive demand, dynamic pricing and complex ML capabilities in future scope. 


---

11. 💳 Payment Limitation

Limitation

The hackathon implementation uses a payment integration/test environment rather than a complete production financial infrastructure.

Therefore:

Production payment settlement is outside the MVP scope.

Real financial transactions may not be used during demonstrations.

Payment provider availability can affect the workflow.

Payment status must be verified server-side.


MVP flow

Reservation
    ↓
Payment
    ↓
Test/Sandbox Gateway
    ↓
Verification
    ↓
Booking Confirmation

The project documentation identifies payment failure and sandbox fallback as required considerations. 


---

12. 💰 Pricing Accuracy

Limitation

Charging and parking prices may vary by operator, time, tariff, taxes, fees or other policies.

Therefore the platform may initially provide:

Estimated Cost

rather than a guaranteed final price.

Rule

The UI must distinguish:

Estimated
vs.
Confirmed

Pricing should ultimately come from the authoritative operator/payment system.


---

13. 🅿️ Parking Occupancy Accuracy

Limitation

The prototype occupancy system uses physical sensors such as:

Ultrasonic
IR

Sensor readings can be affected by:

Sensor placement

Vehicle position

Environmental conditions

Hardware failure

Network failure

Incorrect calibration


Therefore

The platform cannot guarantee 100% occupancy accuracy from the prototype hardware.

Required behavior

If sensor data is unavailable:

AVAILABLE / OCCUPIED

must not be falsely asserted.

Instead:

UNKNOWN

or:

SENSOR OFFLINE

should be displayed.


---

14. 📡 IoT Connectivity Limitation

Limitation

The ESP32 depends on network connectivity.

Potential failures:

Wi-Fi Lost
MQTT Disconnected
Broker Offline
Device Offline
Power Loss

Expected behavior

Device Offline
      ↓
Backend detects missing heartbeat
      ↓
Device marked OFFLINE
      ↓
User/Admin notified

The existing project context includes heartbeat, reconnection and device monitoring requirements. 


---

15. 🔐 IoT Prototype Security Limitation

Limitation

The hackathon hardware prototype is not equivalent to production-grade smart-parking hardware.

Production deployment would require stronger controls such as:

Unique device credentials

MQTT over TLS

Topic ACLs

Secure credential storage

Device provisioning

Replay protection

Secure Boot

Flash encryption

Signed firmware/OTA updates


The project context explicitly identifies these as production-oriented security requirements. 

MVP principle

The prototype demonstrates the architecture and workflow.

It should not be represented as a certified production access-control system.


---

16. 🔒 Physical Access Limitation

Limitation

The prototype smart lock/servo demonstrates the concept of automated physical access.

It is not intended to represent:

Commercial parking-gate hardware

Certified access-control equipment

High-security physical infrastructure

Production safety systems


Demonstration

Authorized Reservation
        ↓
Backend Authorization
        ↓
MQTT
        ↓
ESP32
        ↓
Servo / Lock

The frontend must never directly control the ESP32. 


---

17. 🧪 Hardware Prototype Limitation

Limitation

The physical prototype is intentionally small and simplified.

It demonstrates:

Parking Bay
   ↓
ESP32
   ├── Sensor
   └── Servo / Lock

It does not represent the engineering complexity of a commercial deployment.

Future production requirements

Industrial-grade sensors

Weather-resistant hardware

Reliable power systems

Physical safety mechanisms

Certified locking mechanisms

Hardware redundancy

Remote device management

Secure firmware updates



---

18. 🌐 Network Dependency

Limitation

The full integrated journey depends on network connectivity.

Affected services may include:

Maps
Charging Data
Payment
Backend
MQTT
IoT

A network interruption can therefore affect real-time functionality.

Mitigation

The project defines controlled fallbacks such as:

Cached data

Mock station data

Local backend

Local MQTT broker

Seed database

Test payment mode

Offline demo dataset


These are specifically recommended in the project's demo-hardening plan. 


---

19. 📡 MQTT Broker Dependency

Limitation

IoT communication depends on the MQTT broker.

If the broker becomes unavailable:

Backend
   X
MQTT Broker
   X
ESP32

real-time commands/events may fail.

Mitigation

MQTT reconnect logic

Device heartbeat

Offline status

Local MQTT broker for demonstration

Controlled manual fallback



---

20. 🔄 Real-Time Synchronization Limitation

Limitation

There may be a small delay between:

Physical Event
      ↓
ESP32
      ↓
MQTT
      ↓
Backend
      ↓
Database
      ↓
Frontend

Therefore UI state may briefly differ from physical state.

Example

Physical Bay
= OCCUPIED

Frontend
= AVAILABLE

for a short synchronization period.

Mitigation

Event timestamps

Heartbeats

Server-side state updates

Frontend refresh/invalidation

Explicit stale/unknown states



---

21. 🔐 Authentication & Authorization Boundary

Limitation

Frontend route protection does not provide security by itself.

A malicious user could attempt to call APIs directly.

Therefore:

Frontend Protection
        +
Backend Authentication
        +
RBAC
        +
Resource Ownership
        +
Business Rules

are required.

The backend remains the final authorization authority.


---

22. 📊 Analytics Limitation

Limitation

MVP analytics are based on the data available during the prototype.

Therefore:

Historical data may be limited.

Demand forecasts may be unavailable.

Long-term utilization patterns may not exist.

ML-based insights cannot be reliably produced without sufficient historical data.


MVP analytics

Sessions
Utilization
Revenue
Peak Usage
Charging Activity
Parking Activity

Advanced predictive analytics remain future scope.


---

23. 📈 Scalability Limitation

Limitation

The MVP architecture is designed for:

Modular
Monolith
+
PostgreSQL
+
MQTT
+
ESP32

It is not yet a fully distributed, multi-region production platform.

The current architecture intentionally avoids premature infrastructure such as:

Kubernetes
Kafka
Redis
Service Mesh
Complex Microservices

unless real scaling requirements justify them.

Future scaling

Potential future architecture may introduce:

Horizontally scaled backend instances

Dedicated IoT services

MQTT clustering

Caching

Queue/event infrastructure

Read replicas

Regional services



---

24. 🏙️ Geographic Coverage Limitation

Limitation

The MVP is not guaranteed to have comprehensive charging and parking coverage across every city or region.

Coverage depends on:

Available station data

Operator integrations

Map/POI providers

Partner infrastructure

Demo/seeded data


Future

Expand through:

Operator Integrations
+
Charging Networks
+
Parking Operators
+
City APIs


---

25. 🔌 Operator Integration Limitation

Limitation

The platform cannot automatically control every third-party charging station or parking facility.

Physical control requires compatible infrastructure and authorized integration.

Therefore:

Listed Station
≠
Platform-Controlled Station

This distinction must remain clear.


---

26. 🔋 Vehicle Integration Limitation

Limitation

The MVP does not necessarily have direct telemetry from the vehicle.

Current EV information may be:

User-entered
+
Profile-based
+
Estimated

rather than continuously retrieved from the vehicle.

Future

Potential integrations:

Connected-car APIs

OEM APIs

Vehicle telemetry

BMS data

Live SOC



---

27. 🚦 Traffic & Weather Limitation

Limitation

Traffic and weather-aware energy adjustments are not core P0 requirements.

They are identified as important/future improvements.

Therefore the MVP should not claim full:

Real-time Traffic-aware Energy Prediction

or:

Weather-aware Energy Prediction

unless those integrations are actually implemented.

The project documents place traffic/weather integration in P1 rather than the core P0 baseline. 


---

28. 📱 Notification Limitation

Limitation

Advanced real-time push/SMS/email notification infrastructure may not be fully implemented in the MVP.

Potential future notifications include:

Reservation reminders

Charging completion

Parking alerts

Payment failures

IoT failures


The project documentation places richer notification capabilities beyond the essential P0 path. 


---

29. 🧠 User Preference Limitation

Limitation

Advanced personalization may initially be limited.

Future recommendation preferences could include:

Lowest Cost
Fastest Journey
Lowest Detour
Fastest Charging
Preferred Operator
Preferred Connector
Preferred Parking

The MVP focuses on core journey optimization first.


---

30. 🏢 Production Operations Limitation

The MVP does not yet represent a complete enterprise operations platform.

Potential future capabilities include:

Advanced monitoring

SLA management

Automated incident response

Device fleet management

Production-grade observability

Advanced audit systems

Disaster recovery automation

Multi-region deployment



---

31. 🌍 Multi-City / Smart-City Limitation

Limitation

Smart-city integration is future scope.

The MVP does not provide a complete:

City Mobility Platform

It provides a foundation that can later integrate with:

City infrastructure

Public charging networks

Parking systems

Traffic systems

Energy systems

Smart-city APIs



---

32. 🚚 Fleet Management Limitation

Limitation

Fleet optimization is not a core MVP feature.

Future fleet capabilities may include:

Fleet Vehicles
      ↓
Route Optimization
      ↓
Charging Scheduling
      ↓
Driver Assignment
      ↓
Cost Optimization
      ↓
Fleet Analytics

This belongs to future product expansion.


---

33. 🔮 Future Intelligence Limitations

The following are intentionally outside the current MVP intelligence scope:

Predictive Demand
Queue Prediction
Dynamic Pricing
Predictive Maintenance
Advanced ML Analytics
AI Route Optimization
Grid Optimization
V2G Intelligence

The project documentation explicitly identifies these as future/P2 capabilities rather than requirements for the current MVP. 


---

34. 🧪 Prototype vs Production

The following distinction must always be maintained:

Area	MVP	Production

Energy Model	Approximation	Vehicle-specific advanced model
Station Data	External/demo data	Verified live operator integrations
Payment	Test/sandbox capable	Production payment infrastructure
IoT	Prototype hardware	Industrial hardware
MQTT	Controlled broker	Highly available secured cluster
Sensors	Prototype sensors	Calibrated industrial sensors
Lock	Servo/prototype	Certified access hardware
Vehicle SOC	User/profile input	Live vehicle telemetry
Analytics	Basic	Predictive/large-scale
Deployment	Hackathon-oriented	Production-grade infrastructure
Scale	MVP-scale	Multi-city/multi-operator



---

35. Fallback Strategy

When a dependency fails, the platform should fail gracefully, not silently.

Internet failure

Use cached/mock data where appropriate.

Payment failure

Retry
   ↓
Sandbox/Test fallback

IoT failure

Unable to unlock bay.
Retrying...

Sensor failure

Sensor Offline

External API failure

Fallback / Mock Station Data

The project explicitly defines these fallback behaviors. 


---

36. Demo Reliability Limitation

A hackathon demonstration is more controlled than a production environment.

Therefore the team should maintain:

Spare ESP32
Spare Sensor
Spare Servo
Backup Cables
Backup Power
Manual Lock Override
Local Backend
Local MQTT Broker
Seed Database
Test Payment Mode
Demo Accounts
Offline Demo Dataset

These measures are already recommended in the project master plan. 


---

37. What We Do NOT Claim

The project should not claim that the MVP provides:

❌ Perfect energy prediction
❌ Guaranteed live charger availability
❌ Universal charging-network access
❌ Production-certified IoT hardware
❌ Production-grade physical security
❌ Nationwide charging coverage
❌ Fully autonomous vehicle integration
❌ Advanced ML prediction
❌ Dynamic pricing intelligence
❌ Complete Smart City integration
❌ Enterprise fleet optimization

unless those capabilities are actually implemented, tested and verified.


---

38. What the MVP DOES Demonstrate

The MVP is intended to demonstrate:

✅ EV Profile
✅ Current SOC
✅ Journey Planning
✅ Energy Estimation
✅ Charging Requirement
✅ Station Discovery
✅ Explainable Station Ranking
✅ Charging Reservation
✅ Parking Reservation
✅ Digital Payment Flow
✅ Backend Authorization
✅ MQTT Communication
✅ ESP32 Integration
✅ Smart Lock Prototype
✅ Occupancy Detection
✅ Charging/Parking Session
✅ Basic Analytics

The documented P0 baseline centers on this end-to-end journey. 


---

39. Limitation Management Principles

Every limitation should follow this pattern:

LIMITATION
    ↓
DETECT
    ↓
COMMUNICATE
    ↓
FALLBACK
    ↓
LOG
    ↓
RECOVER

Example:

MQTT Failure
    ↓
Detect Device Offline
    ↓
Show "Device Offline"
    ↓
Retry Connection
    ↓
Log Event
    ↓
Restore Device


---

40. Future Resolution Roadmap

Limitation	Future Resolution

Energy approximation	Advanced vehicle/physics model
Stale station data	Real-time operator integrations
Wait-time uncertainty	Live queue data + prediction
Limited vehicle telemetry	OEM/connected-car APIs
Prototype IoT	Production-grade hardware
Sensor accuracy	Industrial calibrated sensors
Payment sandbox	Production payment gateway
Limited analytics	Historical data + ML
Traffic limitation	Real-time traffic integration
Weather limitation	Weather-aware energy model
Limited geographic coverage	Multi-city/operator integrations
Scaling limitation	Distributed infrastructure
Limited notifications	Push/SMS/email infrastructure
Limited fleet support	Fleet management platform
Limited smart-city support	City/energy ecosystem APIs



---

41. Limitation Review Rules

This document must be updated when:

A limitation is resolved.

A new external dependency is introduced.

A new production capability is added.

A new security limitation is discovered.

A new hardware limitation is discovered.

The MVP scope changes.

A future feature becomes part of P0/P1.


Resolved limitations should not simply be deleted.

Instead:

Known Limitation
      ↓
Resolved
      ↓
Document Resolution
      ↓
Update Status


---

42. Final Principle

> The platform should never confuse an estimate, prototype, simulation or external-data result with a guaranteed real-world outcome.



The system should clearly distinguish:

ESTIMATED
     ≠
LIVE
     ≠
CONFIRMED
     ≠
EXECUTED

Examples:

Estimated Cost
≠
Final Payment

Estimated Availability
≠
Confirmed Reservation

IoT Command Sent
≠
Physical Unlock Confirmed

Energy Estimate
≠
Actual Energy Consumption

This distinction is critical for a trustworthy EV mobility platform.


---

43. Status

Status: Frozen MVP Limitation Baseline

These limitations describe the current intended SIH 2026 MVP boundary.

They do not prevent future production development.

The objective is to build a strong, demonstrable and honest MVP first, then progressively remove these limitations through:

Better Data
+
Better Integrations
+
Better Hardware
+
Better Models
+
Better Infrastructure
+
Real-World Validation


---

> ⚡ Build honestly. Measure accurately. Improve continuously.

Prototype first → Validate → Scale → Automate → Optimize.