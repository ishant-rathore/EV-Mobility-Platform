# Reservation flow

```text
Server-issued READY Module 8 recommendation
→ validate EV profile and reservation window
→ derive route/station/charger on the server
→ reject overlapping charger reservation
→ optionally assign a conflict-free unoccupied demo bay
→ CONFIRMED or PENDING_PAYMENT reservation
```

Clients cannot replace the recommended charger in the reservation request.
