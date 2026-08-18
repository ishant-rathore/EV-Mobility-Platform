# Reliability API

All routes are under `/api/v1/reliability`.

## Assess a charger

`POST /api/v1/reliability/assess`

```json
{
  "chargerId": "charger-demo-1",
  "status": "AVAILABLE",
  "uptimePercent": 98,
  "successfulSessionsPercent": 96,
  "heartbeatAgeSeconds": 20,
  "faultRatePercent": 2,
  "recentFaultCount": 0,
  "temperatureCelsius": 34,
  "telemetryCompletenessPercent": 100,
  "sourceMode": "HARDWARE_DEMO"
}
```

Provide either `heartbeatAgeSeconds` or `heartbeatFreshnessPercent`. Percentages are validated from 0 to 100.

The response includes `score`, `grade`, normalized `status`, `isUsable`, `recommendation`, `freshness`, `confidencePercent`, `availability`, factor breakdowns, reasons, warnings, invalidators, source mode, and calculation time.

## Read assessments

- `GET /api/v1/reliability/:chargerId` — latest assessment with heartbeat age recalculated from telemetry.
- `GET /api/v1/reliability` — all known assessments ordered by descending score.

Unknown charger IDs return `RELIABILITY_NOT_FOUND` with HTTP 404.

## Telemetry integration

`POST /api/v1/telemetry` retains its existing response and also updates Module 6. MQTT uses the same ingestion service. Supported status aliases include `CONNECTED`, `CONNECTED_NOT_CHARGING`, `OCCUPIED`, `FAULT`, and `FAULTED`; responses normalize them to the Module 6 canonical states.

Simulator payloads should send:

```json
{
  "sourceMode": "SIMULATOR",
  "isSimulated": true
}
```

The endpoint is currently an unauthenticated demo API. Authentication and durable reliability snapshots are required before shared or production deployment.
