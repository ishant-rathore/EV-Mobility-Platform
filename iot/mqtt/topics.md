# MQTT Topics

Canonical topic templates:

- `volttwin/chargers/{chargerId}/telemetry` — implemented P0 ingestion
- `volttwin/chargers/{chargerId}/status` — reserved for P1
- `volttwin/chargers/{chargerId}/heartbeat` — reserved for P1
- `volttwin/chargers/{chargerId}/command` — reserved; no actuator command is implemented
- `volttwin/sites/{siteId}/bays/{bayId}/status`
- `volttwin/sites/{siteId}/bays/{bayId}/command`

The topic charger ID must match the payload `chargerId`. Simulator and hardware-demo
payloads use `isSimulated: true`. MQTT credentials are backend/device secrets and must
never be exposed through Vite environment variables.
