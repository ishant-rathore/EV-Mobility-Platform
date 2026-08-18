# Demo Control API

Base path: `/api/v1/admin/demo`

These Module 12 endpoints change process-local demo state only. They do not reset
PostgreSQL, send payment requests, control public traffic, or issue commands to a live
high-voltage charger.

## Read state

`GET /api/v1/admin/demo`

Returns requested/effective mode, freeze state, traffic overrides, current normalized
telemetry snapshots, and the latest vehicle-batch result. Every response is labelled
`sourceMode: DEMO` and `isSimulated: true`.

## Source mode

`POST /api/v1/admin/demo/mode`

```json
{ "mode": "REAL" }
```

Allowed values are `REAL`, `DEMO`, and `SIMULATOR`. When no verified live provider is
configured, `REAL` remains the requested mode while `effectiveMode` is `DEMO` with a
warning. This prevents fallback data being labelled live.

## Freeze or resume

`POST /api/v1/admin/demo/freeze`

```json
{ "frozen": true }
```

Freeze suppresses incoming telemetry mutations and rejects traffic, charger, and batch
scenario actions with `409 DEMO_DATA_FROZEN`. Mode selection, resume, and reset remain
available.

## Traffic scenario

`POST /api/v1/admin/demo/traffic`

```json
{ "routeId": "route-north", "level": "HIGH" }
```

P0 buttons set Route A (`route-north`) HIGH and Route B (`route-central`) MEDIUM. The
overlay is consumed by the traffic API and route/energy evaluation without changing the
pure traffic intelligence package.

## Charger scenario

`POST /api/v1/admin/demo/charger`

```json
{ "chargerId": "charger-demo-1-ccs2", "action": "FAULT" }
```

Actions are `CHARGING`, `FAULT`, and `RESTORE`. They create normalized `SIMULATOR`
telemetry, recalculate reliability, and flow through existing Socket.IO events.

## Vehicle-request batch

`POST /api/v1/admin/demo/vehicle-batch`

```json
{
  "requestCount": 20,
  "demandUnitsPerRequest": 20,
  "vehicleClasses": ["CAR", "BIKE", "TRUCK", "COMMERCIAL"]
}
```

The result is advisory simulation output and does not control real roads.

## Reset all mutable demo state

`POST /api/v1/admin/demo/reset`

```json
{ "confirm": "RESET_DEMO" }
```

The literal confirmation is required. Reset clears only in-process runtime, traffic
projection, telemetry, reliability, recommendation, reservation, simulated payment,
occupancy, and access-command stores. It never runs a Prisma reset.

## Production boundary

The P0 repository has no authentication module. Protect all `/admin/demo` mutations with
admin authentication and role authorization before any non-demo deployment.
