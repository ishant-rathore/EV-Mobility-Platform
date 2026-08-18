# ADR-001: Modular Monorepo

**Status:** Accepted

Use one repository with npm workspaces for the web app, modular-monolith API, pure intelligence packages, IoT tooling, and shared contracts. This keeps cross-boundary changes testable together and suits the current team/demo scale. A service split requires measured scaling or ownership pressure, not directory aesthetics.
