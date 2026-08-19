---

## 20. `DEMO_CONTROL.md`

```md
# 🎬 Demo Control API

**Base:** `/api/v1/demo`

> Demo-control endpoints must be disabled in production.

## POST /reset

Reset demo state.

## POST /seed

Load demo data.

## POST /simulate/charger

Simulate charger status.

```json
{
  "chargerId": "charger_123",
  "status": "AVAILABLE"
}
