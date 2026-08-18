# VoltTwin AI — Safety, Security and Failure-Handling Requirements

**This document is mandatory for any real hardware demonstration.**

The supplied project material explicitly warns against connecting hobby electronics directly to live EV charging power paths. This document preserves that constraint as a release rule.

---

# 1. Safety Principle

> **The software demo must never depend on an unsafe electrical connection.**

Preferred hierarchy:

1. Charger OCPP/API telemetry, if legitimately available.
2. Properly rated isolated measurement hardware installed by a qualified person.
3. Limited safe telemetry.
4. Safe low-voltage NodeMCU demo rig.
5. Pure software simulator.

A convincing simulation is better than an unsafe “real” measurement.

---

# 2. Electrical Safety Rules

## Never do

- Do not connect NodeMCU GPIO pins to an EV charger power conductor.
- Do not place energized high-voltage wiring on a breadboard.
- Do not use an unverified hobby voltage/current sensor on a real charger.
- Do not assume an AC mains sensor is suitable for a DC fast charger.
- Do not bypass charger protection systems.
- Do not open or modify charger internals without authorization.
- Do not work on energized high-voltage equipment without qualified electrical supervision.
- Do not connect a PZEM-004T or similar module to a circuit unless the exact voltage/current topology, rating, isolation and installation are appropriate.
- Do not improvise current-transformer installation on a charger during the hackathon.
- Do not let exposed conductors or terminals be accessible to judges/users.

## Real electrical telemetry requires

- Exact charger model identification.
- Voltage/current topology identification.
- Properly rated meter/sensors.
- Isolation.
- Appropriate CT where required.
- Correct enclosure.
- Fusing/protection.
- Safe connectors.
- Qualified installation/testing.

---

# 3. Recommended Hackathon Hardware Mode

Use a safe low-voltage physical demo:

- NodeMCU ESP8266.
- Push buttons/switches to simulate state.
- Potentiometer or safe analog source for changing demo values.
- DS18B20 for a real temperature signal.
- LEDs for AVAILABLE / CHARGING / FAULT.
- Optional OLED.
- Buzzer for fault.
- Safe low-voltage DC load/power supply.
- Breadboard/jumpers only on low-voltage side.

Example:

```text
Button A → AVAILABLE
Button B → CHARGING
Button C → FAULT
DS18B20 → Real temperature
Potentiometer → Simulated measurement
```

The backend receives the same schema as real mode but marks the event `DEMO`.

---

# 4. Charger State Safety

The application should never treat a missing signal as proof of safety.

Examples:

- Heartbeat lost → `OFFLINE`, not `AVAILABLE`.
- Sensor missing → `UNKNOWN`, not “0”.
- Stale telemetry → stale warning.
- Abnormal temperature → fault/risk state according to configured threshold.
- Conflicting signals → `UNKNOWN` or review state.

---

# 5. Recommendation Safety

The recommendation engine must prioritize reachability and safety constraints over convenience.

Never recommend:

- An unreachable charger.
- An incompatible connector.
- A known faulty/offline charger.
- A route that consumes the safety reserve.
- A vehicle-class-ineligible route.

The system should keep a configurable SOC reserve and expose it as an assumption.

---

# 6. Reliability Score Safety

The reliability score is operational guidance only.

It must not be described as:

- Electrical certification.
- Guaranteed charger safety.
- Guaranteed availability.
- Manufacturer-approved health rating.

A hard fault always overrides a high historical score.

---

# 7. IoT Command Safety

For smart parking/access features:

- The frontend must not publish directly to a device command topic.
- Backend verifies authorization first.
- Commands should include:
  - command ID.
  - target device.
  - action.
  - reservation ID where applicable.
  - expiry.
- Duplicate commands should be handled safely.
- Device acknowledgment should be logged.
- No acknowledgment → UI does not claim success.
- Manual fallback must not bypass safety interlocks.

---

# 8. MQTT Security

Production-oriented rules:

- Use authenticated broker.
- Prefer TLS.
- Unique device credentials.
- Topic ACLs.
- No anonymous public control topics.
- Do not expose broker admin credentials in frontend.
- Store secrets in environment variables.
- Rotate compromised device credentials.
- Track last heartbeat.
- Use Last Will/online-state support when practical.

For an isolated local hackathon LAN, reduced security may be acceptable for demo simplicity, but the presentation should describe the production requirement accurately.

---

# 9. Application Security

Minimum:

- Validate all API inputs.
- Authenticate protected actions.
- Apply role checks to admin/reset/access endpoints.
- Hash passwords if real accounts are used.
- Do not log passwords/tokens.
- Do not store payment-card data.
- Hide API keys.
- Keep CORS limited to expected origins for deployed environments.
- Add basic rate limiting for public production endpoints.
- Log privileged operations.

---

# 10. Payment Safety

If payment is shown:

- Use sandbox/simulation for the hackathon.
- Do not store card details.
- Do not treat client redirect as authoritative payment confirmation.
- Real integrations require verified server-side webhook/callback.
- Failed payment must not grant access.
- Duplicate callbacks should be idempotent.

---

# 11. Data Safety and Privacy

Collect only needed data.

For MVP:

- Name/email only if auth is actually required.
- Vehicle profile.
- Journey input.
- Reservation/session data.
- Telemetry.

Avoid collecting:

- Unnecessary precise long-term location history.
- Payment-card details.
- Sensitive identifiers not needed for demo.

Dynamic data should include:

- Timestamp.
- Source mode.
- Device/source ID.

---

# 12. Physical Parking / Flap-Lock Safety

If a servo/flap mechanism is used:

- Keep force low in the model.
- Use a miniature/demo vehicle.
- Keep fingers clear during actuation.
- Provide an obvious power-off method.
- Do not actuate if the mechanism is jammed.
- Do not use the prototype as a real vehicle restraint.
- Occupancy state should prevent unsafe movement where applicable.
- Do not claim the miniature lock is road-certified hardware.

---

# 13. Failure Modes

| Failure | Safe response |
|---|---|
| NodeMCU disconnects | Mark device OFFLINE; switch to simulator if needed |
| MQTT disconnects | Reconnect; do not fake live status |
| Sensor missing | Mark field unavailable |
| Sensor gives impossible value | Mark invalid/fault; do not use as truth |
| Charger status stale | Show stale badge; reduce confidence |
| Route API fails | Use predefined demo routes |
| Station API fails | Use seed/demo stations |
| Recommendation cannot find reachable charger | Say no safe candidate found |
| Payment fails | Reservation not confirmed |
| Access command fails | Do not show unlocked |
| Database write fails | Do not confirm transaction |
| WebSocket drops | Reconnect and refetch current snapshot |
| Fault occurs mid-journey | Recompute backup |
| Traffic route reaches capacity | Penalize/avoid route when alternative exists |

---

# 14. Emergency Demo Fallback

If real hardware fails:

```text
NodeMCU unavailable?
   ↓
Use hardware demo source if possible
   ↓
Still unavailable?
   ↓
Use software simulator
   ↓
Same MQTT/API contract
   ↓
Same dashboard
   ↓
Clearly label SIMULATOR
```

The demo should continue without pretending the simulator is hardware.

---

# 15. Pre-Demo Safety Checklist

- [ ] No exposed dangerous-voltage wiring.
- [ ] No breadboard connected to live EV charger power.
- [ ] Power supplies checked.
- [ ] NodeMCU powered from safe supply.
- [ ] Hardware source mode displayed correctly.
- [ ] MQTT reconnect tested.
- [ ] Heartbeat timeout tested.
- [ ] Fault state tested.
- [ ] Backup recommendation tested.
- [ ] Local simulator tested.
- [ ] Demo reset tested.
- [ ] Flap/servo movement tested safely.
- [ ] No secrets visible on screen.
- [ ] No real card data used.
- [ ] Team knows which values are real vs simulated.

---

# 16. Post-MVP Production Safety Work

Before any real deployment:

- Electrical engineer review.
- Charger/OCPP integration review.
- Hardware enclosure and EMC considerations.
- Device provisioning and certificate lifecycle.
- Secure OTA.
- Penetration/security testing.
- Privacy/legal review.
- Payment compliance review.
- Availability SLA design.
- Field-failure and manual-recovery process.

---

## Source Grounding

This document primarily follows the supplied `EV_Charger_IoT_Backup_Options_and_Requirements` documents and the electrical/IoT safety constraints in the consolidated PRD and prior Pay&Park context.
