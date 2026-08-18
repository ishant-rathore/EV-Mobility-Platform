<<<<<<< HEAD
# Traffic Diversification

**Documentation area:** 04-intelligence

Energy estimation, EV routing, traffic intelligence, station ranking, charger reliability, backup selection, and optimization.

## Purpose
Define the canonical project guidance for this topic.

## Status
Scaffold / team-owned document.
=======
# Route diversification

Module 04 prevents the platform from recommending the same apparently fastest corridor to every
simulated request. It is an advisory recommendation engine only; it does not control roads or
override the driver's choice.

## Inputs and Module 01–03 handoff

The integrated journey endpoint passes each Module 02 route to Module 04 with:

- Traffic corridor ID, current load, predicted load, capacity and demo/real provenance from Module 03.
- Vehicle class from the authoritative Module 01 EV profile.
- Traffic-adjusted ETA and estimated energy from Module 02.
- Vehicle eligibility from the Module 03 corridor model.

Ineligible corridors are excluded before ranking. This prevents a truck or commercial vehicle from
being recommended on a road that does not permit that class.

## Scoring

Eligible routes receive an explainable score with these default weights:

| Component | Weight | Meaning |
|---|---:|---|
| Time | 35 | ETA relative to the fastest eligible route |
| Congestion | 25 | Projected utilization after the request |
| Energy | 20 | kWh relative to the lowest-energy eligible route |
| Capacity risk | 20 | Cubic utilization penalty as the road fills |

The default capacity threshold is 85%. Crossing it adds a configurable overload penalty of 100
plus a proportional excess-utilization penalty. The engine therefore considers time and energy as
well as load; it does not blindly select the emptiest route.

Every candidate returns its rank, projected load before and after a hypothetical assignment,
utilization, threshold state and the full score breakdown. Ineligible candidates return an
explicit exclusion reason instead of a score.

## Projected-demand state

`TrafficDiversificationEngine` stores additional projected demand by `simulationId` and traffic
corridor. After choosing a route, it increments that corridor before evaluating the next request.
The driver flow uses `driver-demo` by default and assigns one projected demand unit per journey.
Callers can supply their own `diversificationSimulationId` and `projectedDemandUnits`.

The state is in-memory and resets on process restart, which keeps the hackathon demo offline-safe.
It can also be reset through `POST /api/v1/traffic/reset-demo` with an optional `simulationId`.

## APIs

### Preview a ranking

`POST /api/v1/traffic/diversify` accepts traffic routes, a supported vehicle class and optional
existing projected demand. It returns `decision` plus `routes` for compatibility with the original
prototype endpoint.

### Run the before/after demo

`POST /api/v1/traffic/diversify/simulate`

```json
{
  "requestCount": 20,
  "demandUnitsPerRequest": 20,
  "vehicleClasses": ["CAR", "BIKE", "TRUCK", "COMMERCIAL"]
}
```

The response compares baseline shortest-time assignments with diversified assignments, including
initial/final projected load, assignment count, final utilization and overloaded-route count. The
default demo lowers threshold-overloaded routes by shifting eligible demand across alternatives.

### Inspect state

`GET /api/v1/traffic/diversify/state/:simulationId` returns the added projected demand currently
held for that simulation.

## Integrated driver response

`POST /api/v1/journeys/evaluate` runs Module 04 after EV-aware route and traffic evaluation. Its
response adds `diversification`, containing the recommended route ID, advisory explanation,
capacity threshold and candidate score breakdowns. The route result UI highlights the selected
advisory route and shows rank, score, projected utilization and vehicle-class exclusions.
>>>>>>> junior/main
