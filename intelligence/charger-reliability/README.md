# Charger Reliability

Pure Module 6 operational scoring. The engine combines current state, uptime, successful sessions, heartbeat freshness, recent faults, temperature stability, and source/data confidence into an explainable 0–100 prototype score.

`FAULT`/`FAULTED`, `OFFLINE`, and extreme telemetry readings invalidate a charger for recommendation even when historical factors are strong. `selectBackupCharger` filters invalid, unreachable, and incompatible candidates before ranking usable backups.

This score is not a certified electrical-safety score, a guaranteed availability prediction, or a production-accuracy claim.
