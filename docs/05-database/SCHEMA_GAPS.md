
### `05-schema_gaps.md`

```md
# EV Mobility Platform — Schema Gaps

**Module:** `05-database`  
**File:** `schema_gaps.md`  
**Version:** `1.0`  
**Status:** Open Database Design Questions

---

## 1. Purpose

This document records database areas that require validation or further specification before being treated as finalized production schema.

---

## 2. Authentication Ownership

The project uses an authentication system, but the exact boundary between authentication-provider data and application-owned user data must remain explicit.

```text
AUTH PROVIDER
     │
     ▼
IDENTITY
     │
     ▼
APPLICATION USERS
