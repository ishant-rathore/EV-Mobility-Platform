# Charger telemetry payloads

Module 7 uses one strict contract for REST, MQTT, hardware-demo, simulator, limited-IoT,
and future OCPP adapters.

```json
{
  "chargerId": "charger-demo-1-ccs2",
  "status": "CHARGING",
  "powerKw": 32.4,
  "voltageV": 230.1,
  "currentA": 140.8,
  "energyKwh": 4.8,
  "temperatureCelsius": 41.2,
  "deviceUptimeSeconds": 120,
  "sequenceNumber": 24,
  "recordedAt": "2026-08-18T12:00:00.000Z",
  "sourceMode": "SIMULATOR",
  "isSimulated": true
}
```

Required fields are `chargerId` and `status`. `recordedAt` defaults to backend receipt
time, and `sourceMode` defaults to `HARDWARE_DEMO`. Measurements are optional so
limited devices do not invent values.

Canonical states are `AVAILABLE`, `CONNECTED_NOT_CHARGING`, `CHARGING`, `FAULT`, and
`OFFLINE`. Accepted source modes are `LIVE_IOT`, `LIMITED_IOT`, `OCPP`,
`HARDWARE_DEMO`, and `SIMULATOR`. Hardware-demo and simulator data is always marked
simulated. Values are prototype observations, not certified electrical metering.
