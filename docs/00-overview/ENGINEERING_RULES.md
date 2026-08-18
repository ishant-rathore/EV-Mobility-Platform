# VoltTwin AI — Product, Engineering and Demo Rules

These rules are intended to act as the repository-level source of truth for team members and coding assistants.

---

## 1. Product Identity Rules

1. **PS-08 is primary.**
2. PS-05 exists only to improve EV routing and demonstrate traffic diversification.
3. Do not present the project as a generic traffic-management system.
4. Do not present the project as only a charger locator.
5. The headline product decision is always **Best EV Journey = Route + Energy + Traffic + Charger Intelligence**.
6. “VoltTwin AI” is the current hackathon-facing name in this documentation set; “Pay&Park” is the existing smart-parking/IoT foundation.
7. Do not add features unless they strengthen the hero journey or demo reliability.

---

## 2. Truthfulness Rules

1. Every dynamic data source must be identifiable.
2. Use one of:
   - `REAL`
   - `OCPP`
   - `DEMO`
   - `SIMULATOR`
3. Never display simulated voltage/current/power as real measurements.
4. Missing telemetry stays missing/null.
5. Never claim a charger is live if its latest data is stale.
6. Never call a rule-based score “machine learning” unless an ML model is actually used.
7. Never claim model accuracy without a measured test set.
8. Never claim city-wide congestion reduction from a small simulation.
9. Reliability Score is a prototype operational indicator, not a certified safety rating.
10. If a feature is mocked, label it as mock/demo.

---

## 3. Scope Rules

### P0 first

P0 is:

- EV profile.
- SOC.
- Three routes.
- Energy estimate.
- Traffic state/prediction.
- Diversification.
- Charger candidates.
- Live/demo charger state.
- Reliability.
- Station ranking.
- Combined recommendation.
- Backup/re-route.
- Real-time dashboard.
- Simulator fallback.

### Optional only after P0

- Reservation.
- Payment.
- Parking bay.
- Flap lock.
- Occupancy.
- Advanced analytics.

### Do not build for the one-day MVP

- Kubernetes.
- Kafka.
- Full microservices.
- City-scale digital twin.
- Deep-learning model.
- Computer vision.
- ANPR.
- V2G.
- Production OCPP platform.
- Nationwide data ingestion.

---

## 4. Architecture Rules

1. Keep the hackathon backend modular but deployable as one FastAPI application.
2. Business logic belongs in services/modules, not route handlers.
3. React components must not contain core recommendation algorithms.
4. SQLite is acceptable for MVP.
5. PostgreSQL/PostGIS is post-MVP scale target.
6. MQTT is used for device/telemetry events.
7. REST is used for normal request/response APIs.
8. WebSockets are used for live frontend updates.
9. All telemetry sources map to one common contract.
10. External providers must be hidden behind provider/service interfaces where practical.

---

## 5. API Rules

1. Use `/api/v1/`.
2. Validate all request bodies with Pydantic.
3. Return stable, documented response shapes.
4. Use enums for states.
5. Return timestamps in ISO 8601.
6. Include `source_mode` and freshness for dynamic data.
7. Do not break an existing frontend contract during the hackathon without updating both sides immediately.
8. Error responses must include a user-readable message and machine-readable code.
9. Recommendation output must include explanation fields.
10. Demo-reset endpoints must be admin/demo-only.

---

## 6. Data Rules

1. SOC is 0–100.
2. Route capacity must be positive.
3. Price cannot be negative.
4. Telemetry timestamps are mandatory.
5. Charger ID is mandatory.
6. Charger status must use allowed enum.
7. Simulated data requires `source_mode`.
8. Exclusive charger/bay reservations cannot overlap.
9. Stale data must not be silently treated as current.
10. Recommendation inputs should be logged for demo debugging.

---

## 7. Charger State Rules

Allowed states:

```text
AVAILABLE
CONNECTED_NOT_CHARGING
CHARGING
FAULT
OFFLINE
UNKNOWN
```

General logic:

- Healthy/idle charger → `AVAILABLE`.
- Vehicle/connector present with little/no charging → `CONNECTED_NOT_CHARGING`.
- Active measured/known charging → `CHARGING`.
- Fault or abnormal status → `FAULT`.
- Heartbeat/communication lost beyond threshold → `OFFLINE`.
- Insufficient evidence → `UNKNOWN`.

Do not derive a confident state from data you do not have.

---

## 8. Recommendation Rules

### Hard filters happen before scoring

Reject a charger if:

- It is unreachable with reserve.
- Connector is incompatible.
- It is `FAULT`.
- It is `OFFLINE`.
- Required booking/bay condition cannot be met.

### Scoring must be explainable

The system may score:

- ETA/travel impact.
- Traffic.
- Energy.
- Detour.
- Wait.
- Cost.
- Charger power.
- Reliability risk.
- Projected route load.

### Recommendation output must include

- Winner.
- Alternatives.
- Why it won.
- Important assumptions.
- Data freshness.
- Backup charger when available.

### Safety reserve wins over convenience

Never recommend an unreachable charger merely because it has a better score.

---

## 9. Traffic Diversification Rules

1. Diversification is an advisory simulation.
2. Filter routes by legal/suitable vehicle class first.
3. Never route a heavy/commercial vehicle onto a demo road marked ineligible.
4. Consider projected load, not only current load.
5. Penalize a route as it approaches capacity.
6. Do not simply send every vehicle to the least-loaded route.
7. The demo must show before/after route load.
8. Do not claim real road control.
9. A human/user remains free to choose an alternative.
10. If route data is simulated, label it.

---

## 10. Reliability Score Rules

1. Score is 0–100.
2. Current `FAULT/OFFLINE` status can override historical performance.
3. Missing data decreases confidence.
4. Freshness matters.
5. Do not let a high historical score hide an active fault.
6. Show major score factors.
7. Keep the formula configurable.
8. Do not market it as a certified electrical safety score.
9. Store the input snapshot used to calculate the score where possible.
10. Use a backup charger if the preferred option becomes invalid.

---

## 11. Reservation and Payment Rules

If enabled:

1. A reservation is not confirmed because the client showed “payment success.”
2. Server-side payment state is authoritative.
3. Conflicting exclusive reservations are rejected.
4. Expired reservations release resources.
5. Cancelled reservations release resources.
6. Access command requires a valid reservation.
7. Access command should expire.
8. Duplicate access commands should be idempotent where possible.
9. Payment-card data is never stored by the application.
10. Demo payment must be visibly identified as sandbox/simulated.

---

## 12. IoT Rules

1. NodeMCU/ESP device never receives arbitrary public client commands directly.
2. Backend authorizes privileged actions.
3. Device publishes heartbeat.
4. Device reconnects automatically.
5. Device/topic IDs are unique.
6. Production deployments use unique credentials.
7. Topic access should be restricted by ACL where possible.
8. Commands include an ID and expiry for access-control use cases.
9. Device state becomes `OFFLINE` after heartbeat timeout.
10. Simulator must use the same telemetry contract as hardware.

---

## 13. Code Rules

1. Keep functions small and testable.
2. Type public data structures.
3. Avoid hidden magic constants.
4. Put weights/thresholds in configuration.
5. Write docstrings/comments for non-obvious algorithms.
6. No hardcoded secrets.
7. No credentials in screenshots or source.
8. Do not add dependencies without need.
9. Prefer deterministic behavior for the judge demo.
10. Protect reset/admin controls.
11. Keep demo fixtures in a clearly named directory.
12. Use one canonical enum definition per shared state.

---

## 14. Git Rules

1. Never commit `.env`.
2. Small commits.
3. Descriptive commit messages.
4. Do not force-push shared main branch during final integration.
5. Merge one module at a time.
6. Run smoke tests before merge.
7. Tag a known-good demo commit.
8. Keep a local copy of the known-good build.
9. Do not refactor unrelated code during the final hours.
10. Freeze feature development before presentation rehearsal.

---

## 15. UI Rules

1. The user should understand the recommendation in one screen.
2. Always show SOC.
3. Always show estimated arrival SOC.
4. Always show charger status.
5. Always show source/freshness for demo/live data in operator mode.
6. Use clear colors plus text/icons; do not rely only on color.
7. `FAULT` and `OFFLINE` must be visually distinct.
8. Do not hide uncertainty behind exact-looking numbers.
9. Use “Estimated” for wait/energy/cost when appropriate.
10. Give the user alternatives, not only one opaque answer.

---

## 16. Demo Rules

1. Keep a local backend.
2. Keep a local MQTT broker.
3. Keep a software telemetry simulator.
4. Keep seed data.
5. Test without internet.
6. Test with NodeMCU disconnected.
7. Test fault → backup recommendation.
8. Reset the demo before each judging run.
9. Do not expose debug panels unless needed.
10. Present what is real vs simulated before judges ask.
11. Do not improvise unsafe hardware changes on demo day.
12. If an external API fails, switch to predefined routes/stations.

---

## 17. Definition of a Blocker

A problem is a blocker if it prevents:

- Journey planning.
- Recommendation.
- Real-time state change.
- Fault-aware backup.
- Judge-visible demo.

Optional feature failures are not blockers if the core hero workflow still works.

---

## 18. Source Grounding

Rules consolidate the supplied frozen PRD, prior project context, master plan, IoT backup/safety document, visual system architecture, and user pitch.
