# Battery model

Module 1 (EV Profile & Battery Engine) turns a stored vehicle profile into the energy figures every other module relies on. Input validation and orchestration remain in [ev.service.ts](../../backend/api/src/modules/ev/ev.service.ts), while pure battery calculations live in [batteryModel.ts](../../intelligence/energy-engine/src/batteryModel.ts).

> This document covers what a vehicle currently has available. For what a specific trip consumes (traffic factor, environment factor, auxiliary load), see [Energy_Model.md](Energy_Model.md) — Module 2's routing and energy engine.

## Formulas

```text
usableCapacityKwh     = batteryCapacityKwh × batteryHealthPercent / 100
availableEnergyKwh    = usableCapacityKwh  × currentSocPercent    / 100
reserveEnergyKwh      = usableCapacityKwh  × reserveSocPercent    / 100
usableAboveReserveKwh = max(0, availableEnergyKwh − reserveEnergyKwh)
estimatedRangeKm      = floor(availableEnergyKwh    × 1000 / efficiencyWhPerKm)
rangeToReserveKm      = floor(usableAboveReserveKwh × 1000 / efficiencyWhPerKm)
```

Module 1 only computes what the vehicle currently has available — trip-specific consumption belongs to routing, not here.

## Two ranges, one safety rule

- **`estimatedRangeKm`** — display only. Ignores the safety reserve. Shown to the driver as "range remaining".
- **`rangeToReserveKm`** — the reachability number. Has the reserve already subtracted. Every downstream reachability check should use this figure, never `estimatedRangeKm`.

If the current SOC is already inside the reserve band, `usableAboveReserveKwh` and `rangeToReserveKm` are clamped to `0` rather than going negative — the vehicle still has energy, just none of it usable for further travel without violating the reserve.

## Battery health

`batteryHealthPercent` (default `100`) scales nominal capacity down before every other calculation, modelling degraded usable capacity vs. nameplate capacity without a second capacity column.

## Worked example

Tata Nexon EV Max demo vehicle: 40.5 kWh, 100% health, 150 Wh/km, 38% SOC, 10% reserve.

```text
usableCapacityKwh     = 40.5
availableEnergyKwh    = 15.39
reserveEnergyKwh      = 4.05
usableAboveReserveKwh = 11.34
estimatedRangeKm      = 102
rangeToReserveKm      = 75
```

This exact fixture is the first case in [ev.service.test.ts](../../backend/api/src/modules/ev/ev.service.test.ts) and the example in [VEHICLE_API.md](../06-api/VEHICLE_API.md).
