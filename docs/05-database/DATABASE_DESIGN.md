# Database Design

## Purpose
Canonical persistence design for the EV Mobility Platform.

## Primary entities
1. User
2. Vehicle
3. Journey
4. Station
5. Charger
6. StationStatus
7. Reservation
8. ParkingSpace
9. ParkingReservation
10. Payment
11. IoTDevice
12. OccupancyEvent
13. Notification

## Core relationship flow
User → Vehicle → Journey → Reservation → Payment
Station → Charger → StationStatus
Station → ParkingSpace → ParkingReservation
ParkingSpace → OccupancyEvent
IoTDevice → device telemetry/status → platform

## Database principles
- PostgreSQL is the source of truth for transactional platform data.
- Foreign keys enforce relationships.
- Transactions protect booking/payment state transitions.
- Time-series telemetry should be retained and rolled up according to retention policy.
- Secrets and payment credentials are never stored as plain text.

## Booking integrity
Reservation creation must validate user, vehicle, station, charger compatibility, requested time, and conflicting reservations before committing.

## MVP
Use PostgreSQL + Prisma. Keep schema changes migration-based and reproducible.
