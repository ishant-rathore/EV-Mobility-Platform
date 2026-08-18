
---

# 2. `DATA_FLOW.md`

```md
# ⚡ EV Mobility Platform — Data Flow

**Version:** 1.0  
**Status:** SIH 2026 MVP

---

# 1. Overview

Data flows from the user interface through backend services and databases, while IoT events flow between physical devices and the platform.

---

# 2. Main Application Flow

```text
User
 ↓
React Frontend
 ↓ HTTPS/REST
Node.js API
 ↓
Business Services
 ↓
Prisma
 ↓
PostgreSQL
