# Database scripts

`verify.ts` performs a read-only connectivity query. Seed execution remains at `prisma/seed.ts` because the working API scripts and Prisma configuration already reference it.

Reset, backup, restore, and anonymization tooling is not fabricated here: those operations require an explicitly selected environment, retention policy, and confirmation design.
