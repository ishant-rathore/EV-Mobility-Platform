
---

# `06-DEMO_CONTROL.md`

**Important:** I could not find a project source defining a `DEMO_CONTROL.md` API contract. Therefore, this file should **not be treated as an approved production API**. If this file is intended for the hackathon demo/simulation layer, the following is a safe baseline that keeps demo controls separate from real charging/IoT operations.

```md
# Demo Control API

**Module:** `06-api`  
**File:** `DEMO_CONTROL.md`  
**Version:** `1.0`  
**Status:** Demo-only baseline

---

## 1. Purpose

The Demo Control API provides controlled simulation functionality for
demonstrating the EV Mobility Platform without requiring every physical
device or external integration to be available.

This API is intended for:

- Hackathon demonstrations
- Local development
- Automated demonstrations
- Controlled test scenarios
- UI development

It must not be used as a replacement for production charging or IoT APIs.

---

## 2. Important Security Rule

Demo controls must never bypass production authorization.

```text
DEMO CONTROL
     ↓
DEMO ENVIRONMENT ONLY
