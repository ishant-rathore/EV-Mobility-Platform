#!/usr/bin/env sh
set -eu

docker compose up -d
npm run dev
