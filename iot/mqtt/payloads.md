# MQTT Payloads

Payloads are strict UTF-8 JSON. P0 charger telemetry requires `chargerId`, `status`,
and `sourceMode`; `recordedAt` may be omitted so the backend supplies its receive time.
Unknown fields and invalid values are rejected before ingestion.

```json
{
  "chargerId": "charger-demo-1-ccs2",
  "status": "CHARGING",
  "powerKw": 32.4,
  "temperatureCelsius": 41.2,
  "sourceMode": "SIMULATOR",
  "isSimulated": true
}
```

Optional measurements must be omitted when unavailable; zero is a real reading, not a
placeholder. See `docs/09-iot/TELEMETRY_PAYLOADS.md` for the full contract.
