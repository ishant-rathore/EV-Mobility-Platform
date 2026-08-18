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
