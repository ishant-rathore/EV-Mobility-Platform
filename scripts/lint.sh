#!/usr/bin/env sh
set -eu

echo "No repository-wide lint configuration exists yet; running strict TypeScript checks."
npm run typecheck
