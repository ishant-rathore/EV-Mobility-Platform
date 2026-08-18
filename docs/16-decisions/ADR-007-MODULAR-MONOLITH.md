<<<<<<< HEAD
# Adr-007-Modular-Monolith

**Documentation area:** 16-decisions

Architecture Decision Records documenting major technical choices.

## Purpose
Define the canonical project guidance for this topic.

## Status
Scaffold / team-owned document.
=======
# ADR-007: Modular-Monolith Backend

**Status:** Accepted

Keep a single deployable Express API organized by domain modules. Routes validate and translate HTTP, services orchestrate, repositories/providers handle data/integrations, and pure calculations live in intelligence packages. Avoid microservices, Kafka, and mandatory Redis until evidence justifies them.
>>>>>>> junior/main
