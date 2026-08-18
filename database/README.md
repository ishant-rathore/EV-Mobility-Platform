# Database

PostgreSQL persistence is managed with Prisma. The canonical schema is
`prisma/schema.prisma`; existing model semantics are preserved during repository migration.

Run database commands from the repository root:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

Do not run reset operations without an explicit confirmation flag. See
`docs/05-database/SCHEMA_GAPS.md` for known model naming/coverage gaps.
