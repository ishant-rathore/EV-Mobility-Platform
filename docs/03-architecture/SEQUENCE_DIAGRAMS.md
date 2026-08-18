
---

# 10. `SEQUENCE_DIAGRAMS.md`

```md
# ⚡ EV Mobility Platform — Sequence Diagrams

**Version:** 1.0  
**Status:** SIH 2026 MVP

---

# 1. Login

```text
User → Frontend: Enter credentials
Frontend → API: POST /auth/login
API → Database: Find user
Database → API: User
API → API: Verify password
API → Frontend: JWT
Frontend → User: Login successful
