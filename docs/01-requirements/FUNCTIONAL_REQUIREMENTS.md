# EV Mobility Platform — Functional Requirements

**Version:** 1.0  
**Status:** SIH 2026 MVP

---

## 1. User Management

### FR-001
The system shall allow users to register.

### FR-002
The system shall allow users to log in and log out.

### FR-003
The system shall authenticate protected requests.

### FR-004
The system shall maintain user roles and permissions.

---

## 2. EV Profile

### FR-005
The system shall allow users to create an EV profile.

### FR-006
The EV profile shall contain vehicle model.

### FR-007
The EV profile shall contain battery capacity.

### FR-008
The EV profile shall contain current SOC.

### FR-009
The EV profile shall contain estimated efficiency/consumption.

---

## 3. Journey Planning

### FR-010
The system shall accept origin and destination.

### FR-011
The system shall calculate a route.

### FR-012
The system shall calculate route distance.

### FR-013
The system shall estimate travel time.

### FR-014
The system shall estimate energy consumption.

### FR-015
The system shall calculate estimated SOC along the journey.

---

## 4. Charging Intelligence

### FR-016
The system shall determine whether charging is required.

### FR-017
The system shall find charging stations along or near the route.

### FR-018
The system shall calculate station suitability.

### FR-019
The system shall rank stations.

### FR-020
The ranking system shall consider available journey factors such as:
- Cost
- Waiting time
- Detour
- Distance
- Availability
- Compatibility

### FR-021
The system shall provide a recommended station.

### FR-022
The system shall show the reason for the recommendation.

---

## 5. Charging

### FR-023
The system shall display charging station details.

### FR-024
The system shall display charger availability when data is available.

### FR-025
The system shall display charging price when available.

### FR-026
The system shall calculate recommended charging energy/SOC.

### FR-027
The system shall allow charging reservation.

---

## 6. Parking

### FR-028
The system shall display parking availability.

### FR-029
The system shall allow users to reserve a parking bay.

### FR-030
The system shall associate a parking reservation with a journey/charging reservation.

### FR-031
The system shall prevent conflicting reservations.

---

## 7. Payment

### FR-032
The system shall calculate the booking amount.

### FR-033
The system shall process the configured MVP payment flow.

### FR-034
The system shall record successful transactions.

### FR-035
The system shall handle failed payments.

---

## 8. IoT

### FR-036
The system shall authorize IoT access based on reservation status.

### FR-037
The backend shall communicate with the IoT layer using MQTT.

### FR-038
The ESP device shall receive access commands.

### FR-039
The ESP device shall control the parking lock.

### FR-040
The sensor shall detect parking occupancy.

### FR-041
The device shall publish occupancy status.

### FR-042
The backend shall update parking status from device events.

---

## 9. Session Management

### FR-043
The system shall create a charging/parking session.

### FR-044
The system shall track session status.

### FR-045
The system shall detect session completion.

### FR-046
The system shall release the parking bay after completion.

---

## 10. Analytics

### FR-047
The system shall collect booking data.

### FR-048
The system shall collect charging session data.

### FR-049
The system shall collect parking occupancy data.

### FR-050
The operator dashboard shall display basic utilization analytics.

---

## 11. Notifications

### FR-051
The system should notify users about important booking events.

### FR-052
The system should notify users about payment status.

### FR-053
The system should notify users about reservation status.

---

## 12. Administration

### FR-054
Admin users shall be able to manage users.

### FR-055
Admin users shall be able to manage stations.

### FR-056
Admin users shall be able to manage parking bays/devices.

### FR-057
Admin users shall be able to view system activity/logs.
