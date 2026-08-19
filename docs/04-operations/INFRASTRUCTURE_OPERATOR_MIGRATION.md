# Infrastructure operator role migration

`INFRASTRUCTURE_OPERATOR` is the canonical application-facing role for teams that operate charging and parking infrastructure. The existing `OPERATOR` and `PARKING_OPERATOR` role records are intentionally preserved as compatibility aliases; no authentication or database enum was removed or renamed.

## Compatibility behavior

- The web application accepts `INFRASTRUCTURE_OPERATOR`, `OPERATOR`, and `PARKING_OPERATOR` for the same unified operator workspace.
- Backend authorization treats all three names as the same infrastructure capability set.
- Every resource query and command remains ownership-scoped by `operatorId` through the assigned station or parking location. Role compatibility does not grant access to another operator's assets.
- New accounts should be assigned `INFRASTRUCTURE_OPERATOR`. Existing accounts can be migrated incrementally.

## Data migration

After deploying and running the RBAC seed, migrate legacy users in one transaction:

```sql
UPDATE "User"
SET "roleId" = (SELECT id FROM "Role" WHERE name = 'INFRASTRUCTURE_OPERATOR')
WHERE "roleId" IN (
  SELECT id FROM "Role" WHERE name IN ('OPERATOR', 'PARKING_OPERATOR')
);
```

Keep the legacy role rows while older tokens, integrations, or external identity mappings may still emit either legacy name. Remove them only in a later, separately reviewed migration after usage reaches zero.

## Current schema gaps

The current Prisma schema has no charging reservation, pricing/tariff, dedicated parking session, alert-rule, or operator-settings model. The operator frontend does not synthesize these records. It uses explicit unavailable states for pricing and charging reservations, derives parking session views from owned bookings, and uses user profile fields for settings until dedicated APIs are added.
