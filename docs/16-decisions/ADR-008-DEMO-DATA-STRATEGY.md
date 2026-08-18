# ADR-008: Demo Data Strategy

**Status:** Accepted

Maintain deterministic fallback records and simulators so the core demo survives unavailable external systems. Every simulated source carries explicit metadata such as `source: "demo"` and `isSimulated: true`, and user-facing output uses DEMO/SIMULATED/ESTIMATED/STALE labels. Demo data must never be represented as live infrastructure.
