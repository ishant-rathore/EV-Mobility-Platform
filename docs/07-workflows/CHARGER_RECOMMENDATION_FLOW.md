# ⚡ EV Mobility Platform — Charger Recommendation Flow

**Module:** 07-workflows  
**Flow:** Charger Recommendation  
**Version:** 1.0  
**Status:** Frozen MVP Workflow

---

## 1. Purpose

This workflow determines the most suitable charging station for an EV journey.

The recommendation must consider:

- Current battery SOC
- Vehicle battery capacity
- Vehicle efficiency
- Route distance
- Energy requirement
- Charger availability
- Charging power
- Charging price
- Estimated waiting time
- Station detour
- Station distance

---

## 2. Flow

```text
Journey
   ↓
Current SOC
   ↓
Estimate Energy Required
   ↓
Charging Required?
   │
   ├── NO → Continue Journey
   │
   └── YES
        ↓
Discover Stations
        ↓
Filter Available Chargers
        ↓
Calculate Station Score
        ↓
Rank Stations
        ↓
Recommend Best Station
