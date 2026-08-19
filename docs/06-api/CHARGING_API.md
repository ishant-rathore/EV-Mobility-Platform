# Charging intelligence API

## Recommend compatible chargers

`POST /api/v1/chargers/recommendations`

Example request:

```json
{
  "stationIds": ["station-demo-1", "station-demo-2"],
  "connectorTypes": ["CCS2"],
  "minimumPowerKw": 20,
  "origin": { "latitude": 18.969, "longitude": 72.8194 },
  "maximumReachKm": 80
}
```

The response contains ranked eligible `candidates`, `excludedCandidates` with exclusion reasons, and reliability-enriched `primary` and `backup` selections. Demo results are explicitly marked `sourceMode: "DEMO"` and `isSimulated: true`.

Hard filters run before scoring: connector compatibility, minimum power, estimated reachability, port availability, operational state, and Module 6 usability. Detour, range, availability, and wait values remain estimates rather than guarantees.

## Integrated journey

`POST /api/v1/journeys/evaluate` is the authoritative Modules 1–6 endpoint. Its `chargingIntelligence` object applies Module 5 and Module 6 to the route selected by Module 4. If charging is not estimated to be required, `primary` and `backup` are `null`.

Telemetry posted through `POST /api/v1/telemetry` or ingested through MQTT updates Module 6. A later journey evaluation will exclude a newly faulted/offline charger and may promote the prior backup.
