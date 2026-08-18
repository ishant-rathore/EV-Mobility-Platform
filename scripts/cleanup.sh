#!/usr/bin/env sh
set -eu

docker compose down
echo "Stopped local containers. Volumes, databases, source files, and generated artifacts were preserved."
