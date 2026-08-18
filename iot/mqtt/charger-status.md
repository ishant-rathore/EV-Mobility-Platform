# Charger Status

Canonical prototype states are `AVAILABLE`, `CONNECTED_NOT_CHARGING`, `CHARGING`,
`FAULT`, and `OFFLINE`. Legacy `CONNECTED`, `OCCUPIED`, and `FAULTED` inputs are
normalized at the API boundary. State transitions are advisory prototype behavior and
must retain their source mode and observation time.
