# Administration

Module 12 owns process-local, presentation-safe demo controls.

Endpoints under `/api/v1/admin/demo` can change traffic scenarios, inject explicitly
simulated charger state, run a vehicle-request batch, freeze dashboard updates, select
the requested data mode, and reset mutable demo stores. Reset requires the literal
`RESET_DEMO` confirmation and never deletes PostgreSQL data.

`REAL` is a requested mode only until a verified live provider is configured. The API
reports `effectiveMode: DEMO` and a warning instead of falsely labelling fallback data live.
