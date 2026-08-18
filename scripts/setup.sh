#!/usr/bin/env sh
set -eu

npm install
npm run db:generate
echo "Setup complete. Copy .env.example to .env before starting local services."
