# Parking flow

```text
Recommended station
→ station demo bays
→ EV-enabled filter
→ occupancy check
→ reservation time-conflict check
→ optional bay assignment
```

Failure to find a bay does not falsely claim parking availability; the charger reservation is returned with a warning and `parkingBayId: null`.
