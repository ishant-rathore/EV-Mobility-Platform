# Backup modes

All five Module 7 modes converge on the normalized backend contract:

1. `LIVE_IOT` — a real device integration with verified provenance.
2. `LIMITED_IOT` — partial metrics; absent values remain absent.
3. `OCPP` — a future provider adapter, not direct frontend access.
4. `HARDWARE_DEMO` — low-voltage prototype, explicitly simulated.
5. `SIMULATOR` — deterministic software fallback, explicitly simulated.

The frontend consumes REST snapshots and Socket.IO events only. Changing source mode
does not change frontend code. Use the software simulator whenever hardware or the
demo network is unavailable.
