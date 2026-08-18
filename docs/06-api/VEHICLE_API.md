<<<<<<< HEAD
# Vehicle Api

**Documentation area:** 06-api

REST/WebSocket API contracts for every major platform module.

## Purpose
Define the canonical project guidance for this topic.

## Status
Scaffold / team-owned document.
=======
# EV Profile & Battery API

Module 1. All routes are under `/api/v1/ev`. See [BATTERY_MODEL.md](../04-intelligence/BATTERY_MODEL.md) for the maths.

## `GET /ev/vehicles`

Lists saved vehicles for the demo driver. Returns `EvProfileSummary[]` (shape below).

## `GET /ev/vehicles/:id`

One vehicle plus its computed battery block. `404 EV_VEHICLE_NOT_FOUND` if the id does not exist.

### Response

```json
{
  "vehicleId": "vehicle-nexon-demo",
  "name": "Tata Nexon EV Max",
  "vehicleClass": "CAR",
  "connectorTypes": ["CCS2"],
  "batteryCapacityKwh": 40.5,
  "batteryHealthPercent": 100,
  "efficiencyWhPerKm": 150,
  "currentSocPercent": 38,
  "reserveSocPercent": 10,
  "isDefault": true,
  "sourceMode": "DEMO",
  "updatedAt": "2026-08-18T10:00:00.000Z",
  "usableCapacityKwh": 40.5,
  "availableEnergyKwh": 15.39,
  "reserveEnergyKwh": 4.05,
  "usableAboveReserveKwh": 11.34,
  "estimatedRangeKm": 102,
  "rangeToReserveKm": 75
}
```

`sourceMode` is `REAL` when the vehicle is stored in PostgreSQL and `DEMO` when served from the in-memory fallback (`EV_USE_DATABASE=false`, the hackathon default — see Demo Rules §16).

## `POST /ev/vehicles`

Body: the profile fields above (no `vehicleId`/`sourceMode`/`updatedAt`/battery block — those are computed or assigned). Returns `201` with the same shape as `GET /ev/vehicles/:id`.

## `PATCH /ev/vehicles/:id/soc`

Body: `{ "currentSocPercent": 42 }`. The only mutable field post-creation in Module 1 P0. Returns the updated summary.

## `POST /ev/profiles/preview`

Stateless — same request body as create, nothing persisted, same response shape minus `vehicleId`/`isDefault`/`sourceMode`/`updatedAt`. Used by the journey planner before a vehicle is saved.

## Errors

| Code | Status | Meaning |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Zod rejected the body (includes SOC/reserve/capacity/efficiency out of range) |
| `EV_SOC_OUT_OF_RANGE` | 400 | State of charge outside 0–100 (engine-level guard, defense in depth behind Zod) |
| `EV_EFFICIENCY_INVALID` / `EV_CAPACITY_INVALID` / `EV_HEALTH_INVALID` | 400 | Non-positive physical quantity reached the engine |
| `EV_VEHICLE_NOT_FOUND` | 404 | No vehicle with that id |

## Handoff to Module 2 (Routing & Energy)

Module 2 must not re-derive energy from raw SOC. It consumes exactly:

```ts
{ vehicleId, vehicleClass, connectorTypes, batteryCapacityKwh, usableCapacityKwh,
  efficiencyWhPerKm, currentSocPercent, reserveSocPercent, availableEnergyKwh,
  reserveEnergyKwh, usableAboveReserveKwh, rangeToReserveKm }
```

`rangeToReserveKm` is the reachability number — it already has the safety reserve subtracted. `estimatedRangeKm` is display-only and must never gate a routing decision.

`backend/api/src/modules/ev/ev.service.ts` exports `toEnergyContext(summary)` that produces this object directly from an `EvProfileSummary`.

The shared repository in `backend/api/src/modules/ev/ev.store.ts` is consumed by both the EV routes and
`POST /api/v1/journeys/evaluate`, so downstream modules cannot accidentally use a separate demo
vehicle state.
>>>>>>> junior/main
