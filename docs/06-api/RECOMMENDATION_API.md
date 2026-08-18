# Recommendation API

## Authoritative Module 8 evaluation

`POST /api/v1/recommendations/evaluate`

This endpoint accepts the same validated request as `POST /api/v1/journeys/evaluate`, including a stored `vehicleId`, origin/destination, optional SOC/reserve overrides, environment, routing provider, traffic horizon, and diversification simulation values.

It returns the Module 8 recommendation object directly:

```json
{
  "recommendationId": "generated-id",
  "status": "READY",
  "sourceMode": "DEMO",
  "isSimulated": true,
  "recommendedRouteId": "demo-diversified",
  "recommendedChargerId": "charger-demo-1-ccs2",
  "backupChargerId": "charger-demo-2-ccs2",
  "estimatedArrivalSocPercent": 0,
  "estimatedWaitMinutes": 4,
  "reliabilityScore": 95,
  "reasons": ["..."],
  "warnings": ["Availability, wait, detour, cost, traffic, and range values are simulated or estimated."]
}
```

Arrival SOC and all operational values are estimates. The sample values are illustrative rather than guaranteed exact output.

Clients cannot submit trusted battery capacity, efficiency, connector type, or vehicle class to this endpoint; those values come from Module 1.

## Integrated journey response

`POST /api/v1/journeys/evaluate` includes the same object as `recommendation` alongside the detailed route, diversification, and charging intelligence evidence.

## Compatibility endpoint

`POST /api/v1/recommendations` remains available for the pre-Module-8 inline energy request. It is retained for API compatibility and should not be used by new driver flows.
