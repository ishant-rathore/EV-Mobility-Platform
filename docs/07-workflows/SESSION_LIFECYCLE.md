# Session lifecycle

Module 9 P0 implements these states:

```text
PENDING_PAYMENT → CONFIRMED → ACTIVE
```

`PENDING_PAYMENT → CONFIRMED` occurs after approved simulated payment. A confirmed occupancy event moves the reservation to `ACTIVE`.

Completion, cancellation, expiry, one-time access tokens, parking-session metering, and charging-session settlement remain P1. The current code does not imply those states are automated.
