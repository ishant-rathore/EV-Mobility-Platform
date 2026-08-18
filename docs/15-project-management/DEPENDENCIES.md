# Dependencies

<<<<<<< HEAD
**Documentation area:** 15-project-management

Roadmap, sprints, roles, ownership, risks, dependencies, release planning, and changelog.

## Purpose
Define the canonical project guidance for this topic.

## Status
Scaffold / team-owned document.
=======
- Web depends only on backend REST and Socket.IO/WebSocket contracts.
- Backend may depend on PostgreSQL, MQTT, external maps/traffic/payment providers, and pure intelligence packages.
- Intelligence packages are deterministic and infrastructure-free.
- IoT devices depend on the MQTT broker, never PostgreSQL or the web application.
- Prisma migrations and seed scripts depend on an explicitly selected database URL.
- Demo paths should remain usable when optional external providers are unavailable.

Redis is not a hard dependency. Kafka, Kubernetes, GraphQL, and a microservice split are outside current scope.
>>>>>>> junior/main
