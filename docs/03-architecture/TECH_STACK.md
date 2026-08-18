# ⚡ EV Mobility Platform — Technology Stack

**Project:** EV Mobility Platform  
**Version:** 1.0  
**Status:** SIH 2026 MVP  
**Architecture:** Modular Monolith + IoT Event Layer

---

# 1. Technology Stack Overview

The EV Mobility Platform uses a modern web, backend, database and IoT technology stack.

```text
┌──────────────────────────────────────────────┐
│                 FRONTEND                     │
│ React + TypeScript + Vite + Tailwind CSS    │
└──────────────────────┬───────────────────────┘
                       │ HTTPS / REST
                       ▼
┌──────────────────────────────────────────────┐
│                  BACKEND                     │
│ Node.js + Express + TypeScript              │
└──────────────────────┬───────────────────────┘
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
┌─────────────────────┐   ┌────────────────────┐
│      DATABASE       │   │       IoT           │
│ PostgreSQL + Prisma │   │ MQTT + ESP32       │
└─────────────────────┘   └─────────┬──────────┘
                                    │
                              ┌─────┴─────┐
                              ▼           ▼
                           Sensors      Lock
