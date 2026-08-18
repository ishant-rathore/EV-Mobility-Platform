# ADR-007: Modular-Monolith Backend

**Status:** Accepted

Keep a single deployable Express API organized by domain modules. Routes validate and translate HTTP, services orchestrate, repositories/providers handle data/integrations, and pure calculations live in intelligence packages. Avoid microservices, Kafka, and mandatory Redis until evidence justifies them.
