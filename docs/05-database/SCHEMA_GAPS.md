# Schema Gaps

No Prisma semantics were changed during repository normalization. The current schema already covers users, EV vehicles, journeys, routes/segments, traffic snapshots, stations/chargers, telemetry, reliability snapshots, recommendations, bookings, parking, payments, charging sessions, notifications, devices, occupancy events, reviews, and audit logs.

Known naming/coverage decisions to review before a future migration:

- `Booking` currently represents the reservation concept; renaming it would be an API/data migration, not structural cleanup.
- `ParkingSlot`/`ParkingBooking` map to the target parking-space/reservation concepts.
- Operator ownership is not yet represented as a dedicated `Operator` model.
- Charger status uses `AVAILABLE`, `OCCUPIED`, `OFFLINE`, and `FAULTED`; the IoT protocol also distinguishes `CONNECTED`, `CHARGING`, and `FAULT`. Aligning these requires a documented state-transition migration.
- `Recommendation` is broader than the proposed `ChargingRecommendation` name.

Any accepted change requires a Prisma migration, updated seed data, API compatibility review, and tests.
