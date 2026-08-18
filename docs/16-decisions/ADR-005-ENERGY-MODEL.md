# ADR-005: Explainable Energy Model

**Status:** Accepted

Calculate route energy from distance, vehicle efficiency, traffic/environment factors, auxiliary load, battery health, SOC, and safety reserve. Keep the pure model in `intelligence/energy-engine` and validation/orchestration in the API. Outputs are estimates, never exact range guarantees.
