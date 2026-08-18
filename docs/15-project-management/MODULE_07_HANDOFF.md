# Module 07 handoff — IoT telemetry and device monitoring

## Status

P0 complete for the hackathon/demo boundary.

## Delivered

- One strict telemetry schema and five canonical charger states.
- REST and MQTT ingestion with topic/payload identity validation.
- Module 6 reliability recomputation on every accepted message.
- Socket.IO telemetry, fault, and recommendation-refresh events.
- Initial REST snapshots plus realtime operator and driver updates.
- A five-state deterministic software simulator.
- Safe ESP8266 low-voltage demo firmware with optional DS18B20 and fault button.
- Explicit `LIVE`, `LIMITED`, `PROVIDER`, and `SIMULATED` provenance presentation.

## Run

Start Mosquitto and the API, then run the charger simulator from its package. Open
`/operator/chargers` to observe snapshots and realtime state changes. The firmware and
simulator both default to `charger-demo-1-ccs2` and publish the same contract.

## Boundaries and remaining work

- Telemetry is held in process memory; durable history is P1.
- OCPP is a normalized source mode/interface, not a completed gateway.
- Per-device certificates, ACL provisioning, diagnostics, and OTA are P1/P2.
- Firmware is a low-voltage prototype and must never touch energized EV/mains wiring.
- PlatformIO firmware compilation requires the local PlatformIO toolchain and hardware.
