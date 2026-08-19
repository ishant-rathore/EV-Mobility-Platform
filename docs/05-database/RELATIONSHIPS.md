
### `05-RELATIONSHIPS.md`

```md
# EV Mobility Platform — Database Relationships

**Module:** `05-database`  
**File:** `RELATIONSHIPS.md`  
**Version:** `1.0`

---

## 1. Purpose

This document defines the logical relationships between the primary database entities.

---

## 2. Identity Relationships

```text
USERS
  │
  └──< USER_ROLES >── ROLES
