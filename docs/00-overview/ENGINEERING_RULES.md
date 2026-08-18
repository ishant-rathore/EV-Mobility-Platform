# ⚡ EV Mobility Platform — Engineering Rules

> **Project:** EV Mobility Platform  
> **Product:** Pay&Park — Intelligent EV Mobility, Charging & Smart Parking Platform  
> **Version:** 1.0  
> **Status:** SIH 2026 MVP / Prototype  
> **Primary Problem Statement:** SIH PS-08 — EV Mobility Ecosystem  
> **Supporting Capability:** Smart Parking / IoT infrastructure  
> **Architecture:** Modular Monorepo  
> **Engineering Principle:** MVP-first, modular, testable, transparent, scalable

---

# 1. Product Identity Rules

These rules define how the project must be understood and presented.

## 1.1 Primary Product Identity

**EV Mobility Platform is the primary product.**

The product must always be presented as:

> **An intelligent EV mobility platform that plans battery-aware journeys, recommends charging stops, enables charging and parking reservations, and connects digital mobility decisions with IoT infrastructure.**

The platform is **NOT**:

- Only a parking application.
- Only an EV charger locator.
- Only a charging application.
- Only an IoT parking project.
- Only a route-planning application.
- A generic traffic-management system.

---

## 1.2 Primary Problem Statement

### PS-08 is the primary problem statement.

All major product decisions must support:

```text
EV Mobility
     ↓
Journey Planning
     ↓
Battery Awareness
     ↓
Energy Estimation
     ↓
Charging Intelligence
     ↓
Station Recommendation
     ↓
Charging Reservation
     ↓
Parking Reservation
     ↓
IoT Access
     ↓
Analytics
