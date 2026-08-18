#!/usr/bin/env sh
set -eu

docker compose -f infrastructure/compose/docker-compose.demo.yml up --build
