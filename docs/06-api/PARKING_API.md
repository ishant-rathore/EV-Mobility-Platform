# Parking and access API

## Demo inventory

`GET /api/v1/parking?stationId=station-demo-1`

Returns explicitly simulated EV-enabled bays and optional demo device IDs.

## Demo access

`POST /api/v1/reservations/:id/access/unlock`

Access requires a confirmed/active reservation with an assigned bay and is accepted from 15 minutes before `startsAt` until `endsAt`. The result is an acknowledged `UNLOCK_DEMO_FLAP` simulator command. It does not control a live barrier, charger, mains circuit, or high-voltage equipment.

One-time access tokens, authenticated MQTT delivery, physical acknowledgement, and parking sessions remain P1.
