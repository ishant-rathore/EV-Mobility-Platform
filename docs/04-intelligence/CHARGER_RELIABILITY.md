# Charger Reliability

<<<<<<< HEAD
**Documentation area:** 04-intelligence

Energy estimation, EV routing, traffic intelligence, station ranking, charger reliability, backup selection, and optimization.

## Purpose
Define the canonical project guidance for this topic.

## Status
Scaffold / team-owned document.
=======
## Status

Module 6 P0 is implemented in `intelligence/charger-reliability` and exposed through the backend reliability API. The engine is pure and infrastructure-free; backend services own validation, in-memory demo state, and telemetry orchestration.

## Explainable factors

| Factor | Weight | Meaning |
|---|---:|---|
| Current state | 20% | `AVAILABLE`, connected/charging, active fault, or offline |
| Observed uptime | 20% | Historical operational uptime in the selected observation window |
| Successful sessions | 25% | Percentage of observed sessions that completed successfully |
| Heartbeat freshness | 15% | Freshness derived from heartbeat age or an explicit normalized value |
| Recent faults | 10% | Fault-rate input plus a transparent recent-fault penalty |
| Temperature stability | 5% | Prototype telemetry stability when a reading exists |
| Data confidence | 5% | Source mode and telemetry completeness |

All values are bounded to 0–100. The API returns every normalized factor, weight, weighted contribution, and explanation.

## Invalidation rules

- `FAULT` and legacy `FAULTED` cap the score at 15 and make the charger unusable for recommendation.
- `OFFLINE` sets the score to 0 and makes the charger unavailable.
- A telemetry heartbeat older than 15 minutes is normalized to `OFFLINE` by backend orchestration.
- Extreme prototype temperature readings invalidate the recommendation but are not presented as a certified hardware-safety diagnosis.
- Connected/occupied/charging states remain operationally healthy but are not the same as current port availability.

## Freshness and honesty

Heartbeat labels are `FRESH`, `AGING`, `STALE`, or `UNKNOWN`. Source modes are `LIVE_IOT`, `LIMITED_IOT`, `OCPP`, `HARDWARE_DEMO`, `SIMULATOR`, and `DEMO`. Demo and simulator assessments contain explicit warnings and must be labelled in UI output.

The availability level is a `PROTOTYPE_HEURISTIC`, not a guarantee or production prediction. The score must never be described as an electrical-safety certification.

## Telemetry handoff

Both REST telemetry and MQTT messages call the same `recordTelemetry` service. That service keeps the existing telemetry response unchanged and also sends the normalized signal to Module 6. A subsequent reliability read reflects fault/offline status immediately and recalculates heartbeat age at request time.

Operational history can be supplied separately through the assessment endpoint. When no history exists, the backend uses a clearly low-confidence neutral demo baseline rather than inventing a strong historical record.
>>>>>>> junior/main
