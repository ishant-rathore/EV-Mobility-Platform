#!/usr/bin/env sh
set -eu

docker compose up -d postgres mosquitto
npm run dev
