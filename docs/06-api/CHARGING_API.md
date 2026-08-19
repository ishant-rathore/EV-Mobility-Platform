# Analytics API

**Module:** `06-api`  
**File:** `ANALYTICS_API.md`  
**Version:** `1.0`

---

## 1. Purpose

The Analytics API provides authorized users with aggregated EV mobility
operational and usage metrics.

Supported analytics domains include:

- Charging
- Energy
- Reservations
- Parking
- Revenue
- Station utilization

Analytics must respect RBAC and resource ownership.

---

## 2. Base Path

```text
/api/v1/analytics
