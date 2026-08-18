#!/usr/bin/env sh
set -eu

if [ "${CONFIRM_DATABASE_RESET:-}" != "RESET_LOCAL_DATABASE" ]; then
  echo "Refusing to reset. Set CONFIRM_DATABASE_RESET=RESET_LOCAL_DATABASE for an explicitly selected local database." >&2
  exit 2
fi

echo "No automatic destructive reset is implemented. Review DATABASE_URL, then run the intended Prisma reset command manually."
exit 2
