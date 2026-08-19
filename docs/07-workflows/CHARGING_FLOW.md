---

## 02 — `CHARGING_FLOW.md`

```md
# ⚡ EV Mobility Platform — Charging Flow

**Module:** 07-workflows  
**Flow:** Charging  
**Version:** 1.0  
**Status:** Frozen MVP Workflow

---

## 1. Purpose

Defines the complete charging workflow from station selection to charging session completion.

---

## 2. Flow

```text
Driver
  ↓
Select Recommended Station
  ↓
Check Charger Availability
  ↓
Select Charger
  ↓
Select Charging Amount / Target SOC
  ↓
Create Charging Reservation
  ↓
Payment
  ↓
Reservation Confirmed
  ↓
Navigate to Station
  ↓
Arrive
  ↓
IoT / Charger Authorization
  ↓
Start Charging Session
  ↓
Monitor Session
  ↓
Charging Complete
  ↓
Stop Session
  ↓
Generate Session Summary
