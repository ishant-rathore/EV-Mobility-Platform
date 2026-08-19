# ⚡ EV Mobility Platform — Battery-Aware Intelligence

**Module:** `04-intelligence`  
**File:** `BATTERY_AWARE.md`  
**Version:** `1.0`  
**Status:** Frozen SIH 2026 MVP Intelligence Baseline

---

## 1. Purpose

The Battery-Aware Intelligence module determines how an EV's current battery state affects its journey.

It answers:

> **Can the EV reach the destination with its current battery, and if not, where and when should it charge?**

---

## 2. Inputs

| Input | Description |
|---|---|
| `currentSoc` | Current battery state of charge (%) |
| `batteryCapacityKwh` | Usable battery capacity |
| `vehicleEfficiencyKwhPerKm` | Estimated energy consumption |
| `routeDistanceKm` | Journey distance |
| `routeEnergyKwh` | Estimated route energy requirement |
| `minimumPlanningSoc` | Minimum desired SOC reserve |

---

## 3. Core Flow

```text
EV PROFILE
    ↓
CURRENT SOC
    ↓
BATTERY CAPACITY
    ↓
VEHICLE EFFICIENCY
    ↓
ROUTE DISTANCE
    ↓
ENERGY ESTIMATION
    ↓
REACH DESTINATION?
    │
    ├── YES → Continue Journey
    │
    └── NO
          ↓
    CHARGING REQUIRED
          ↓
    FIND CHARGING STATION
