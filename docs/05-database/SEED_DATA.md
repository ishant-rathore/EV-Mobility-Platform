# EV Mobility Platform — Seed Data

**Module:** `05-database`  
**File:** `seed_data.md`  
**Version:** `1.0`  
**Status:** Database Seed Data Baseline

---

## 1. Purpose

Seed data provides controlled initial records for local development, testing, demonstrations, and development environments.

Seed data must never contain real user, payment, or production-sensitive information.

---

## 2. Seed Data Principles

1. Use deterministic development data.
2. Never use real personal information.
3. Never use real payment credentials.
4. Keep seed data reproducible.
5. Maintain valid foreign-key relationships.
6. Keep production and development seed data separate.
7. Make seed scripts safe to rerun where practical.

---

## 3. Seed Order

Foreign-key dependencies determine the seed order.

```text
ROLES
  ↓
USERS
  ↓
USER_ROLES
  ↓
VEHICLES
  ↓
CHARGING_STATIONS
  ↓
CHARGERS
  ↓
PARKING_LOCATIONS
  ↓
PARKING_SLOTS
  ↓
JOURNEYS
  ↓
ROUTES
  ↓
RESERVATIONS
  ↓
SESSIONS
  ↓
PAYMENTS
