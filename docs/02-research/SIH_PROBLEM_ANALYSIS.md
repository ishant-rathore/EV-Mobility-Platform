
---

# `02 - SIH_PROBLEM_ANALYSIS.md`

```md
# ⚡ SIH Problem Analysis — EV Mobility Platform

**Project:** EV Mobility Platform  
**Status:** SIH 2026 Internal Hackathon  
**Priority:** Core Research

---

# 1. Problem

EV mobility involves multiple connected decisions:

- Can my EV reach the destination?
- Where should I charge?
- Is the charger available?
- How long will I wait?
- What will charging cost?
- Is parking available?
- Can I reserve it?
- Can I access the physical parking bay?

These decisions are often fragmented.

---

# 2. Core Problem Statement

The platform should help EV users make charging and parking decisions as part of their complete journey.

---

# 3. Problem Breakdown

## Problem 1 — Range Uncertainty

Users may not know whether their current SOC is sufficient.

### Solution

Battery-aware energy estimation.

---

## Problem 2 — Charging Uncertainty

Users may not know which station is best.

### Solution

Charging station discovery and ranking.

---

## Problem 3 — Waiting

A station may have limited availability.

### Solution

Availability and waiting-time information.

---

## Problem 4 — Cost

Different charging options may have different costs.

### Solution

Cost-aware station comparison.

---

## Problem 5 — Parking

Charging locations may not guarantee a suitable parking bay.

### Solution

Integrated parking availability and reservation.

---

## Problem 6 — Physical Access

A digital reservation does not automatically control physical infrastructure.

### Solution

IoT-based parking access.

```text
Reservation
    ↓
Authorization
    ↓
MQTT
    ↓
ESP32
    ↓
Smart Lock
