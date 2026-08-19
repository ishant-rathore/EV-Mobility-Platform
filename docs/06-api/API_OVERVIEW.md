
### `06-api/api_overview.md`

```md
# EV Mobility Platform — API Overview

**Module:** `06-api`  
**File:** `api_overview.md`  
**Version:** `1.0`  
**Status:** API Architecture Baseline

---

## 1. Purpose

The EV Mobility Platform API provides the backend interface used by:

- Web frontend
- Mobile clients
- Operator dashboards
- Administrative interfaces
- Internal platform services

---

## 2. API Architecture

```text
CLIENT
  │
  ▼
API ROUTE
  │
  ▼
AUTHENTICATION
  │
  ▼
AUTHORIZATION / RBAC
  │
  ▼
VALIDATION
  │
  ▼
SERVICE LAYER
  │
  ▼
DATA ACCESS
  │
  ▼
NEON POSTGRESQL
