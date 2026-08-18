# Journey Flow

1. Select a validated EV profile and state of charge.
2. Evaluate route candidates and estimated energy use.
3. Attach current/predicted demo traffic summaries and advisory diversification.
4. If reserve-aware reachability requires charging, rank compatible station candidates.
5. Return a primary and explainable backup recommendation.
6. Optionally create a Module 9 demo reservation, simulate payment, assign parking, issue a low-voltage access command, and record occupancy.
7. Continue through navigation, device status, charging-session completion, and production transactions as those later modules are implemented.

Frontend clients use REST/WebSocket only. IoT devices use MQTT only. Neither connects directly to the database.
