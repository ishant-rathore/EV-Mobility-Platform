<<<<<<< HEAD
# Adr-008-Demo-Data-Strategy

**Documentation area:** 16-decisions

Architecture Decision Records documenting major technical choices.

## Purpose
Define the canonical project guidance for this topic.

## Status
Scaffold / team-owned document.
=======
# ADR-008: Demo Data Strategy

**Status:** Accepted

Maintain deterministic fallback records and simulators so the core demo survives unavailable external systems. Every simulated source carries explicit metadata such as `source: "demo"` and `isSimulated: true`, and user-facing output uses DEMO/SIMULATED/ESTIMATED/STALE labels. Demo data must never be represented as live infrastructure.
>>>>>>> junior/main
