
### `05-SCHEMA.md`

```md
# EV Mobility Platform — Database Schema

**Module:** `05-database`  
**File:** `SCHEMA.md`  
**Version:** `1.0`  
**Status:** Logical Schema Baseline

---

## 1. Purpose

This document defines the logical structure of the platform database.

It describes the major tables and their expected responsibilities.

It is not a substitute for the version-controlled database migrations.

---

## 2. Identity Schema

### `users`

| Column | Type | Purpose |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | TEXT | User name |
| `email` | TEXT | User email |
| `phone` | TEXT | User contact |
| `status` | TEXT | Account state |
| `created_at` | TIMESTAMPTZ | Creation time |
| `updated_at` | TIMESTAMPTZ | Last update |

### `roles`

| Column | Type | Purpose |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | TEXT | Role name |
| `description` | TEXT | Role description |
| `created_at` | TIMESTAMPTZ | Creation time |

### `user_roles`

| Column | Type | Purpose |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID | User reference |
| `role_id` | UUID | Role reference |
| `created_at` | TIMESTAMPTZ | Assignment time |

---

## 3. Vehicle Schema

### `vehicles`

| Column | Type | Purpose |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID | Owner |
| `manufacturer` | TEXT | Vehicle manufacturer |
| `model` | TEXT | Vehicle model |
| `registration_number` | TEXT | Vehicle registration |
| `battery_capacity_kwh` | NUMERIC | Battery capacity |
| `current_battery_percentage` | NUMERIC | Current battery state |
| `created_at` | TIMESTAMPTZ | Creation time |
| `updated_at` | TIMESTAMPTZ | Last update |

---

## 4. Charging Schema

### `charging_stations`

```text
id
operator_id
name
address
latitude
longitude
status
created_at
updated_at
