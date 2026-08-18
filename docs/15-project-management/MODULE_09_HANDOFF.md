# Module 09 handoff — Reservation, Payment, Parking & Access

## Status

P0 demo reservation, conflict prevention, optional payment simulation, optional parking assignment, access-command simulation, and occupancy event are implemented.

## API path

1. Obtain a `READY` recommendation from `POST /api/v1/recommendations/evaluate` or the `recommendation` field of `/journeys/evaluate`.
2. Create a reservation through `POST /api/v1/reservations` using its `recommendationId`.
3. If requested, approve/decline the demo payment.
4. During the access window, issue the simulated unlock command.
5. Record simulated occupancy to move the reservation to `ACTIVE`.

## Persistence boundary

The Prisma schema already has `Booking`, `Payment`, `ParkingSlot`, `OccupancyEvent`, and `DeviceCommand`, but `Booking` does not currently persist the Module 8 recommendation ID or charger ID required by this P0 contract. No schema semantics were changed casually. Module 9 uses repository interfaces with an in-memory implementation until a reviewed schema migration and Prisma adapter are added.

## Safety and honesty

- All records are `DEMO` or `SIMULATOR` and `isSimulated: true`.
- No card data is accepted or stored.
- No money moves.
- No live charger, parking network, physical barrier, mains circuit, or high-voltage equipment is controlled.
- Driver identity is a demo identifier until authentication ownership is wired.

## Remaining P1

- Authenticated driver ownership.
- Prisma persistence and migration.
- Reservation expiry/cancellation.
- Payment sandbox and signed webhooks.
- One-time access tokens and authenticated MQTT acknowledgement.
- Parking and charging session completion.
