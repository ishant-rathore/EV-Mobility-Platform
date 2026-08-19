
### `05-database/er_diagram.md`

```md
# EV Mobility Platform — ER Diagram

**Module:** `05-database`  
**File:** `er_diagram.md`  
**Version:** `1.0`  
**Status:** Database Relationship Baseline

---

## 1. Purpose

This document describes the conceptual relationships between the primary EV Mobility Platform database entities.

The diagram represents the proposed database baseline and should be synchronized with the final database migrations.

---

## 2. High-Level ER Structure

```text
                              ┌──────────────┐
                              │    USERS     │
                              └──────┬───────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
              ▼                      ▼                      ▼
        ┌───────────┐         ┌────────────┐        ┌─────────────┐
        │  VEHICLES │         │ USER_ROLES │        │  JOURNEYS   │
        └─────┬─────┘         └──────┬─────┘        └──────┬──────┘
              │                      │                     │
              │                      ▼                     ▼
              │                 ┌──────────┐          ┌─────────┐
              │                 │  ROLES   │          │ ROUTES  │
              │                 └──────────┘          └─────────┘
              │
              ├──────────────────────────────┐
              │                              │
              ▼                              ▼
   ┌─────────────────────┐          ┌─────────────────────┐
   │ CHARGING_RESERVATION│          │ PARKING_RESERVATION │
   └──────────┬──────────┘          └──────────┬──────────┘
              │                                │
              ▼                                ▼
   ┌─────────────────────┐          ┌─────────────────────┐
   │ CHARGING_SESSIONS   │          │   PARKING_SLOTS     │
   └──────────┬──────────┘          └──────────┬──────────┘
              │                                │
              ▼                                ▼
   ┌─────────────────────┐          ┌─────────────────────┐
   │      CHARGERS       │          │ PARKING_LOCATIONS   │
   └──────────┬──────────┘          └─────────────────────┘
              │
              ▼
   ┌─────────────────────┐
   │ CHARGING_STATIONS   │
   └─────────────────────┘
