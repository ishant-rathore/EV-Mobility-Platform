# Module Ownership

| Boundary | Responsibility |
|---|---|
| `apps` | User interfaces and REST/WebSocket clients |
| `backend/api` | Auth, HTTP, transactions, orchestration, providers |
| `intelligence` | Pure energy, traffic, ranking, reliability calculations |
| `iot` | Firmware, low-voltage prototypes, MQTT, simulators |
| `database` | Prisma schema, migrations, seeds, verification |
| `packages` | Proven shared types/contracts/configuration only |
| `mock-data` | Deterministic and visibly simulated fallback data |
| `tests` | Cross-domain/E2E/hardware/security/performance validation |
| `infrastructure` | Local config, CI, deployment definitions |
| `docs` | Architectural and project decision record |
