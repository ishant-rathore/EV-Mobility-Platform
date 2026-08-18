# Telemetry API

Base path: `/api/v1/telemetry`

## Submit normalized telemetry

`POST /api/v1/telemetry` validates and records one telemetry object and returns `202`.
Use the payload defined in `docs/09-iot/TELEMETRY_PAYLOADS.md`. Invalid or unknown
fields return `400` and are not ingested.

## Current snapshots

`GET /api/v1/telemetry` returns all in-process latest charger snapshots, their current
Module 6 reliability assessment, backend receipt time, source label, and disclaimer.

`GET /api/v1/telemetry/{chargerId}` returns the latest normalized message or `404`.

## Realtime events

Socket.IO emits:

- `telemetry.updated` for every accepted message;
- `charger.faulted` for `FAULT` or `OFFLINE`;
- `recommendation.updated` as a refresh hint for a fault/offline charger.

The P0 store is process-local and deliberately does not imply durable device history.
MQTT ingestion subscribes to `volttwin/chargers/+/telemetry` when `ENABLE_MQTT` is not
`false`. Frontends never connect to MQTT directly.
