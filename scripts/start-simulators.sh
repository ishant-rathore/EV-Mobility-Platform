#!/usr/bin/env sh
set -eu

echo "Starting the charger simulator. Output is SIMULATED demo telemetry."
npm run dev:charger --workspace=@ev-mobility/iot-simulators
