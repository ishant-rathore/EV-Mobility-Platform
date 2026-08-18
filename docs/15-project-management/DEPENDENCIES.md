# Dependencies

- Web depends only on backend REST and Socket.IO/WebSocket contracts.
- Backend may depend on PostgreSQL, MQTT, external maps/traffic/payment providers, and pure intelligence packages.
- Intelligence packages are deterministic and infrastructure-free.
- IoT devices depend on the MQTT broker, never PostgreSQL or the web application.
- Prisma migrations and seed scripts depend on an explicitly selected database URL.
- Demo paths should remain usable when optional external providers are unavailable.

Redis is not a hard dependency. Kafka, Kubernetes, GraphQL, and a microservice split are outside current scope.
