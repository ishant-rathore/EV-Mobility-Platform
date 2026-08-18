# Health Checks

The API exposes `/health`. Add dependency-specific readiness probes only when they reflect actual runtime requirements; PostgreSQL and MQTT are optional for offline demo fallback paths.
