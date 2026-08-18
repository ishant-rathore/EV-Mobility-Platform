# API

The implemented groups are `/ev`, `/journeys`, `/routes`, `/traffic`, `/chargers`, `/recommendations`, `/reliability`, `/telemetry`, `/reservations`, and `/parking` under `/api/v1`.

Module 5 charging recommendations are documented in [CHARGING_API.md](CHARGING_API.md). Module 6 reliability endpoints and telemetry handoffs are documented in [RELIABILITY_API.md](RELIABILITY_API.md).
Module 8 composition is documented in [RECOMMENDATION_API.md](RECOMMENDATION_API.md).
Module 9 demo transactions are documented in [RESERVATION_API.md](RESERVATION_API.md), [PAYMENT_API.md](PAYMENT_API.md), and [PARKING_API.md](PARKING_API.md).
Module 7 normalized ingestion, snapshots, and realtime events are documented in [TELEMETRY_API.md](TELEMETRY_API.md).

## Integrated Modules 01–06 + 08 journey evaluation

`POST /api/v1/journeys/evaluate` is the driver UI's primary planning endpoint. It accepts a saved
`vehicleId`, origin/destination, optional SOC/reserve planning overrides, environment inputs,
provider, and `trafficHorizon` (`CURRENT` or `PREDICTED`). The backend then:

1. Loads battery capacity, health, efficiency, connectors, and vehicle class from Module 01.
2. Passes Module 01's computed available/reserve energy budget into Module 02.
3. Applies Module 03's current or predicted traffic snapshot to ETA and energy consumption.
4. Runs Module 04 vehicle eligibility, time/congestion/energy/capacity scoring and records the
   advisory assignment in its projected-demand simulation.
5. Applies Module 05 reachability, connector, state, availability, power, detour, wait, cost, and
   reliability-aware charger ranking to the selected route.
6. Uses Module 06 telemetry-aware reliability to invalidate unsafe candidates and select a backup.
7. Uses Module 08 to compose the selected route, primary, backup, estimates, reasons, and warnings.

The response keeps the normal `routes[]` shape and adds `vehicleSnapshot`, `integration`, and a
`traffic` block on each demo route, plus `diversification`, `chargingIntelligence`, and `recommendation` decisions. The traffic block includes
current/predicted loads and classes, source provenance, selected horizon, travel-time multiplier,
and vehicle eligibility. Diversification includes the selected route, score factors, projected
utilization, threshold state and advisory explanation. Clients do not send trusted battery
capacity, efficiency, connector types, or vehicle class to this endpoint. Charging intelligence
includes eligible/excluded candidates, score breakdowns, reliability reasons, and primary/backup
choices. Its demo values are explicitly labelled as simulated estimates.

Optional Module 04 request fields are `diversificationSimulationId` (default `driver-demo`) and
`projectedDemandUnits` (default `1`).

## Module 02 — routing and energy

### Evaluate candidate routes

`POST /api/v1/routes/evaluate`

This lower-level compatibility endpoint still accepts an inline vehicle energy object. New driver
flows should use `/journeys/evaluate` so vehicle data is loaded authoritatively from Module 01.

```json
{
  "origin": {
    "label": "Mumbai Central",
    "latitude": 18.969,
    "longitude": 72.8194
  },
  "destination": {
    "label": "Pune",
    "latitude": 18.5204,
    "longitude": 73.8567
  },
  "vehicle": {
    "id": "EV_NEXON_DEMO",
    "batteryCapacityKwh": 40.5,
    "efficiencyWhPerKm": 150,
    "currentSocPercent": 55
  },
  "reserveSocPercent": 15,
  "environment": {
    "weatherCondition": "RAIN",
    "ambientTemperatureC": 27,
    "elevationGainM": 120
  },
  "auxiliaryLoadKwh": 0.4,
  "provider": "DEMO"
}
```

The response contains `routes[]`. Every route includes:

- `distanceKm`, `baseEtaMinutes`, `trafficFactor`, and `estimatedEtaMinutes`.
- `estimatedEnergyKwh`, `estimatedArrivalSocPercent`, and `chargingRequired`.
- A complete `energy` breakdown, route `geometry`, and `chargerCandidates`.
- `environmentAdjustment`, proportional `segments`, and `recommendedChargingStop` where needed.
- `sourceMode` so demo and live results remain distinguishable.

Provider values are `DEMO`, `OSRM`, and `AUTO`. `AUTO` returns `fallbackReason` when it uses the
offline provider.

### Estimate one route

`POST /api/v1/routes/energy-estimate`

This compatibility endpoint accepts a distance and vehicle energy fields, plus optional
`trafficFactor`, `environmentFactor`, and `auxiliaryLoadKwh`. It returns a generated `routeId` and
the same energy breakdown used by multi-route evaluation.
