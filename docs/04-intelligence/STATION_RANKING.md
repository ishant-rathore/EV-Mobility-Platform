<<<<<<< HEAD
# Station Ranking

## Candidate pipeline
1. Filter by route feasibility.
2. Filter by connector compatibility.
3. Filter by minimum usable availability.
4. Calculate normalized scores.
5. Apply configurable weights.
6. Rank stations.
7. Return recommendation reasons.

## Factors
- Detour distance
- Expected wait
- Charging cost
- Travel impact
- Availability
- Charger compatibility
- Reliability
- Amenities

The ranking must remain explainable to the driver.
=======
# Station ranking

Module 5 ranks individual charger candidates only after hard eligibility filters. A candidate is excluded before scoring when its connector is incompatible with the selected Module 1 EV profile, it is below the requested power, unreachable with the Module 2 energy budget, unavailable, faulted/offline, or marked unusable by Module 6.

Eligible candidates receive an explainable prototype score using reliability, available ports, power, estimated detour, estimated wait, and cost. The score is a recommendation heuristic, not a guarantee of range, wait time, or charger availability.

Module boundaries:

- Module 2 supplies route geometry, energy deficit, route-linked station IDs, and estimated maximum reach.
- Module 4 supplies the selected diversified route.
- Module 5 owns eligibility and station/charger ranking.
- Module 6 owns operational reliability, telemetry freshness, fault invalidation, and backup selection.

Demo provider values include `sourceMode: "DEMO"` and `isSimulated: true`. Live providers must preserve equivalent provenance and freshness metadata.
>>>>>>> junior/main
