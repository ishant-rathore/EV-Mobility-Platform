# Release Plan

1. Freeze API/schema changes for the candidate.
2. Run dependency install, Prisma generation, type-check, tests, and builds from a clean checkout.
3. Run golden-path, charger-failure, traffic-diversion, and offline-fallback checks.
4. Review secret handling, simulated-data labels, hardware safety, and payment scope.
5. Rehearse demo seed/reset and rollback procedures.
6. Tag the release and update the root changelog with verified results only.

Staging and production remain blocked until their documented security and operational prerequisites are met.
