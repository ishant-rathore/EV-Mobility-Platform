# ADR-003: PostgreSQL and Prisma

**Status:** Accepted

PostgreSQL is the durable data store and Prisma defines the schema/migration history. The schema is not rewritten during structural work; semantic changes require an explicit migration and compatibility review. Devices and frontend clients never access it directly.
