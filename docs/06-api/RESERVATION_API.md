# Reservation API

Module 9 is an explicitly simulated, process-local P0 flow. It does not reserve a charger on a live network.

## Create

`POST /api/v1/reservations`

```json
{
  "recommendationId": "server-issued-module-8-uuid",
  "driverId": "driver-demo",
  "vehicleId": "vehicle-nexon-demo",
  "startsAt": "2026-08-18T13:00:00.000Z",
  "endsAt": "2026-08-18T14:00:00.000Z",
  "assignParkingBay": true,
  "paymentRequired": true
}
```

The server loads the Module 8 decision and derives route, station, and charger IDs. Those fields are rejected if supplied by the client. A `READY` recommendation is required. Overlapping reservations for the same charger return `409 RESERVATION_CONFLICT`; parking bays are also checked for time conflicts and simulated occupancy.

Without required payment, the reservation is immediately `CONFIRMED`. With required payment, it is `PENDING_PAYMENT` until an approved simulation.

## Read

- `GET /api/v1/reservations?driverId=driver-demo`
- `GET /api/v1/reservations/:id`

Records are process-local and disappear when the API restarts.

## Occupancy

`POST /api/v1/reservations/:id/occupancy`

```json
{ "occupied": true }
```

This records a `SIMULATOR` event and moves a confirmed reservation to `ACTIVE`. It is not real sensor telemetry.
