<<<<<<< HEAD
# Traffic Prediction

**Documentation area:** 04-intelligence

Energy estimation, EV routing, traffic intelligence, station ranking, charger reliability, backup selection, and optimization.

## Purpose
Define the canonical project guidance for this topic.

## Status
Scaffold / team-owned document.
=======
# Traffic prediction

The MVP derives congestion from free-flow speed, observed speed, and occupancy. A trained model can replace this adapter later.

`summarizeRouteTraffic` is the stable Module 03 handoff to Module 02. It returns both current and
predicted load/capacity, both congestion classes, source provenance, vehicle eligibility, and the
travel-time multiplier for the selected `CURRENT` or `PREDICTED` horizon. The same multiplier is
used for route ETA and energy, and the complete snapshot is returned to the journey UI.
>>>>>>> junior/main
