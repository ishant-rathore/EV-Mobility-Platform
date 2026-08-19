
### `05-data_retention.md`

```md
# EV Mobility Platform — Data Retention

**Module:** `05-database`  
**File:** `data_retention.md`  
**Version:** `1.0`  
**Status:** Data Governance Baseline

---

## 1. Purpose

This document defines the baseline approach for storing, retaining, archiving, and deleting platform data.

Retention periods must ultimately follow the project's legal, contractual, operational, and security requirements.

No fixed legal retention period is assumed by this document.

---

## 2. Retention Principles

The platform should:

1. Store data only when required.
2. Retain operational data for legitimate business purposes.
3. Avoid unnecessary personal-data retention.
4. Preserve required financial and audit records.
5. Separate active data from archived data.
6. Delete data when its approved retention period expires.
7. Protect archived data with appropriate access controls.
8. Maintain auditability of deletion operations.

---

## 3. Data Categories

```text
IDENTITY DATA
     ↓
OPERATIONAL DATA
     ↓
TRANSACTION DATA
     ↓
ANALYTICS DATA
     ↓
AUDIT DATA
     ↓
TEMPORARY / CACHE DATA
