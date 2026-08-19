# EV Mobility Platform — Analytics API

**Module:** `06-api`  
**File:** `analytics.md`  
**Version:** `1.0`  
**Status:** API Contract Baseline

---

## 1. Purpose

The Analytics API provides authorized users and operators with aggregated platform metrics.

Analytics data may include:

- Charging utilization
- Charging sessions
- Energy consumption
- Revenue
- Parking utilization
- Reservation statistics
- Operational performance

Analytics endpoints must return aggregated information rather than unnecessary raw personal data.

---

## 2. Base Path

```text
/api/v1/analytics
