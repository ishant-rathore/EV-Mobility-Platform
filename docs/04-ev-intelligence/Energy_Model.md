# Routing and energy engine

Module 02 evaluates multiple candidate routes against an EV's current energy state. The default
mode is deterministic and offline-safe; live OSRM routing is optional and falls back to the demo
provider when `AUTO` mode cannot reach OSRM.

## Energy calculation

```text
base_energy_kWh = distance_km × efficiency_Wh_per_km ÷ 1000

required_energy_kWh =
  base_energy_kWh
  × traffic_factor
  × environment_factor
  + auxiliary_load_kWh
```

The reserve is protected separately:

```text
available_energy_kWh = battery_capacity_kWh × current_SOC ÷ 100
reserve_energy_kWh   = battery_capacity_kWh × reserve_SOC ÷ 100
usable_energy_kWh    = max(0, available_energy_kWh - reserve_energy_kWh)

charging_required = required_energy_kWh > usable_energy_kWh
```

When Module 01 supplies `usableBatteryCapacityKwh`, the engine uses that health-adjusted capacity
for available energy, reserve energy, and arrival SOC. Otherwise it falls back to nominal
`batteryCapacityKwh` for backward compatibility.

The integrated journey endpoint also passes Module 01's already computed `availableEnergyKwh`,
`reserveEnergyKwh`, and `usableAboveReserveKwh` directly. Module 02 uses those authoritative values
instead of independently rebuilding the selected vehicle's battery budget from client data.

Arrival SOC is clamped to zero for display. `energyDeficitKwh` and
`canReachDestinationWithoutCharging` distinguish a route that merely crosses the reserve from a
route that cannot be completed without charging.

All values shown to users are labeled as estimates. The model is deterministic and is not
presented as a validated vehicle-specific consumption model.

## Environment adjustment

Clients may provide either a manual `environmentFactor` or estimated conditions:

- Weather: `CLEAR`, `RAIN`, `HOT`, or `COLD`.
- Ambient temperature: `-40–60 °C`.
- Elevation gain: `0–10,000 m`.

The service returns the weather, temperature, elevation, and combined factors plus a `sourceMode`
of `ESTIMATED` or `MANUAL`. The factors are transparent deterministic prototype adjustments, not a
live weather feed or a vehicle-certified elevation model.

## Route segments and charging stops

Each route geometry is split into segments. Distance and estimated energy are allocated
proportionally across those segments. Charger IDs supplied by the route provider are resolved into
station summaries; when charging is required, the first ranked valid candidate is exposed as
`recommendedChargingStop` for downstream recommendation logic.

## Route providers

- `DEMO`: returns three stable alternatives with different distance, base ETA, traffic multiplier,
  geometry, and charger candidates. It requires no internet connection.
- `OSRM`: requests live driving alternatives and full GeoJSON geometry from OSRM.
- `AUTO`: tries OSRM for up to five seconds, then returns the three demo alternatives with a
  `fallbackReason` when live routing fails.

The default provider is `DEMO` so the hackathon flow remains reliable offline.

## Validation limits

- SOC and reserve SOC: `0–100`.
- Distance: greater than `0`, maximum `5,000 km`.
- Battery capacity: greater than `0`, maximum `500 kWh`.
- Efficiency: greater than `0`, maximum `2,000 Wh/km`.
- Traffic factor: `0.5–3.0`.
- Environment factor: `0.5–2.0`.
- Auxiliary load: `0–100 kWh`.
- Latitude: `-90–90`; longitude: `-180–180`.

## Acceptance coverage

- Three offline candidate routes are returned.
- Each route includes distance, base and traffic-adjusted ETA, estimated kWh, estimated arrival
  SOC, charging-required state, environment breakdown, segment estimates, geometry, charger
  candidates, and an optional recommended charging stop.
- Integrated demo routes include Module 03 current/predicted load, congestion classes, provenance,
  vehicle eligibility, and the exact multiplier used by ETA and energy calculations.
- Invalid SOC is rejected with `VALIDATION_ERROR`.
- The single-distance endpoint remains available for recommendation-module compatibility.
- Automated tests cover factor application, reserve boundaries, energy deficit, API validation,
  and the complete three-route response.
