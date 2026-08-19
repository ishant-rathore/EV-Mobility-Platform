
### `05-database/README.md`

```md
# EV Mobility Platform — Database

**Module:** `05-database`  
**Version:** `1.0`

---

## 1. Overview

The `05-database` module documents the persistent data layer of the EV Mobility Platform.

It defines:

- Database structure
- Entity relationships
- Schema conventions
- Indexing
- Migrations
- Data retention
- Known schema gaps

---

## 2. Documentation

| File | Purpose |
|---|---|
| `README.md` | Database documentation overview |
| `SCHEMA.md` | Logical database schema |
| `RELATIONSHIPS.md` | Entity relationships |
| `er_diagram.md` | ER diagram |
| `database_design.md` | Database design principles |
| `indexing.md` | Database indexing strategy |
| `migration.md` | Migration strategy |
| `data_retention.md` | Data lifecycle and retention |
| `schema_gaps.md` | Known unresolved schema areas |

---

## 3. Database Architecture

```text
                 APPLICATION
                      │
                      ▼
                BACKEND SERVICES
                      │
                      ▼
                 DATA ACCESS
                      │
                      ▼
              POSTGRESQL DATABASE
                      │
       ┌──────────────┼──────────────┐
       ▼              ▼              ▼
     USERS         MOBILITY       OPERATIONS
       │              │              │
       ▼              ▼              ▼
    VEHICLES      CHARGING        PARKING
       │              │              │
       └──────────────┼──────────────┘
                      ▼
                 TRANSACTIONS
