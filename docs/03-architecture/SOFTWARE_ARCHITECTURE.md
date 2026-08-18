
---

# 11. `SOFTWARE_ARCHITECTURE.md`

```md
# ⚡ EV Mobility Platform — Software Architecture

**Version:** 1.0  
**Architecture:** Modular Monolith + IoT Event Layer

---

# 1. Architecture Style

The MVP uses a modular architecture rather than prematurely splitting every feature into independent microservices.

---

# 2. Layers

```text
┌─────────────────────────────┐
│       Presentation          │
│     React + TypeScript      │
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────┐
│          API Layer          │
│     Express + TypeScript    │
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────┐
│      Application Layer      │
│ EV / Charging / Parking /   │
│ Reservation / Payment / IoT │
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────┐
│       Domain Logic          │
│ Energy / Ranking / Rules    │
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────┐
│      Data Access Layer      │
│       Prisma + PostgreSQL   │
└─────────────────────────────┘
