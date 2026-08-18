# VoltTwin AI — Product Design System and UX Specification

This document converts the supplied posters, sticky-note boards and sample phone/dashboard screens into one consistent application design direction.

---

# 1. Design Goal

The app should visually communicate:

> **EV intelligence + live infrastructure + trustworthy recommendations**

The product UI should feel like a modern mobility dashboard, not a presentation poster.

---

# 2. Visual Direction

The supplied visuals use two distinct styles:

1. **Dark navy + electric green/blue** for the product/dashboard.
2. **Sticky-note / whiteboard** for explanation and planning posters.

Use them differently:

- **Application UI:** dark navy, high-contrast cards, map-first, green/blue status accents.
- **Pitch/architecture boards:** sticky-note style is acceptable.
- Do not mix sticky-note visual styling into the main production app.

---

# 3. Design Principles

1. **Map first, decision second.**
2. **Show the recommendation in one glance.**
3. **Status must be obvious.**
4. **Explain AI/scoring in plain language.**
5. **Real vs simulated data must be visible.**
6. **Never show false precision.**
7. **Alternatives must stay accessible.**
8. **Fault states need immediate visual priority.**
9. **Use text + icon + color together.**
10. **The one-day demo should need minimal typing.**

---

# 4. Suggested Design Tokens

These are implementation guidance, not a requirement to match a specific color hex from the posters.

## Base

- Background: deep navy / near-black.
- Surface: slightly lighter navy.
- Elevated surface: blue-black.
- Primary action: electric green.
- Secondary action: electric blue.
- Text primary: white.
- Text secondary: cool gray.

## Status semantics

- Available / Healthy: green.
- Charging: blue or cyan.
- Connected / Waiting: amber.
- Fault: red.
- Offline / Unknown: gray/red depending on context.
- Severe traffic: red.
- High traffic: orange.
- Medium traffic: amber.
- Low traffic: green.

Do not rely on color alone.

---

# 5. Typography

Use a clean sans-serif UI font available in the product environment.

Hierarchy:

- H1: 28–36 px desktop, 24–30 px mobile.
- H2: 20–24 px.
- Card title: 16–18 px.
- Body: 14–16 px.
- Metadata/status: 12–14 px.
- Numeric KPI: 24–40 px depending on card.

Keep route/station names readable on mobile.

---

# 6. Layout System

## Desktop

Recommended structure:

```text
┌──────────────────────────────────────────────────────────────┐
│ Header: VoltTwin AI | Driver/Operator | Source Mode          │
├───────────────────────┬──────────────────────────────────────┤
│ Journey / Filters     │                                      │
│                       │              MAP                     │
│ Recommendation Card   │                                      │
│ Alternatives          │                                      │
├───────────────────────┴──────────────────────────────────────┤
│ Live status / analytics / timeline                           │
└──────────────────────────────────────────────────────────────┘
```

## Mobile

```text
Header
↓
Journey inputs
↓
Recommended route card
↓
Map
↓
Recommended charger
↓
Backup / alternatives
↓
Live status
```

---

# 7. Driver P0 Screens

## Screen 1 — Journey Planner

Required inputs:

- From.
- To.
- Vehicle.
- Battery/SOC.

Optional:

- Vehicle class.
- Preference: Best Overall / Fastest / Most Reliable / Cheapest.

Primary button:

**PLAN EV JOURNEY**

Example:

```text
Where are you going?

From        [ Delhi         ]
To          [ Jaipur        ]

Vehicle     [ Tata Nexon EV ]
Battery     [ 38%           ]

[ PLAN EV JOURNEY ]
```

---

## Screen 2 — Route Recommendation

Must show:

- Route name.
- Distance.
- ETA.
- Predicted traffic.
- Estimated energy.
- Arrival SOC.
- Charging required.

Example:

```text
RECOMMENDED ROUTE

Route B — Energy Efficient
Distance      276 km
ETA           4h 35m
Traffic       Medium → Low
Energy Est.   32 kWh
Arrival SOC   12%

Charging required: YES
```

Add a short explanation:

> Lower predicted congestion and lower energy impact than Route A.

---

## Screen 3 — Charger Recommendation

Use a prominent card:

```text
BEST CHARGER

EV Station Alpha
Reliability      94 / 100
Status           AVAILABLE
Ports            4 / 6
Predicted wait   ~8 min
Detour           3.2 km
Power            DC Fast
Est. cost        ₹312
Source           DEMO • 5 sec ago

Why this?
✓ Reachable with reserve
✓ Higher reliability
✓ Lower wait
✓ Low route detour
```

Primary action:

- `START NAVIGATION`
or
- `RESERVE` if reservation is implemented.

---

## Screen 4 — Alternatives

Show 2–3 cards:

- Best Overall.
- Cheapest.
- Lowest Detour.
- Backup.

The backup should be visually marked:

**BACKUP IF PRIMARY CHANGES**

---

## Screen 5 — Live Journey

Show:

- Current route.
- Next charger.
- ETA to charger.
- Live charger state.
- Traffic changes.
- Backup status.

Fault scenario:

```text
Primary charger changed to FAULT.

Recalculating...
Backup selected: EV Station Beta

Reason:
• Primary charger offline
• Beta is reachable
• 91 reliability
• ~12 min wait
```

This is a key demo moment.

---

# 8. Operator Dashboard

The supplied “Digital Twin — Traffic & Chargers” visual is the strongest reference.

Recommended layout:

```text
┌──────────────────────────────────────────────────────────────┐
│ DIGITAL TWIN — TRAFFIC & CHARGERS                            │
├───────────────────────────────────────┬──────────────────────┤
│                                       │ Traffic Density      │
│                 MAP                   │ Low / Med / High     │
│                                       │ Severe               │
│                                       ├──────────────────────┤
│                                       │ Charger Status       │
│                                       │ Available            │
│                                       │ Charging             │
│                                       │ Occupied             │
│                                       │ Fault                │
├───────────────────────────────────────┴──────────────────────┤
│ Route A 78% | Route B 54% | Route C 36%                     │
│ Before Diversification → After Diversification               │
├──────────────────────────────────────────────────────────────┤
│ Live Telemetry | Reliability | Heartbeat | Active Sessions   │
└──────────────────────────────────────────────────────────────┘
```

---

# 9. Traffic Visualization

Use:

- Colored road/path.
- Small vehicle icons only if they remain readable.
- Route labels A/B/C.
- Current load and predicted load.

Example:

```text
Route A
Current:   82% HIGH
Predicted: 91% SEVERE

Route B
Current:   58% MEDIUM
Predicted: 61% MEDIUM

Route C
Current:   34% LOW
Predicted: 39% LOW
```

For before/after diversification, use paired bars or small cards rather than a complex chart.

---

# 10. Charger Status Component

Every charger card should contain:

- Name.
- Distance/detour.
- State.
- Available ports.
- Power type.
- Reliability.
- Wait.
- Freshness.
- Source mode.

State badge examples:

```text
AVAILABLE
CHARGING
CONNECTED
FAULT
OFFLINE
STALE DATA
```

---

# 11. Reliability UI

Show:

```text
Reliability 94/100
```

Add an explanation tooltip/panel:

- Healthy live state.
- Recent successful sessions.
- Fresh telemetry.
- No recent fault.

If confidence is low:

```text
Reliability: 71/100
Confidence: LOW
Reason: limited historical data
```

---

# 12. Data Source Indicator

This is mandatory in operator/demo mode.

Examples:

```text
● REAL
● OCPP
● DEMO
● SIMULATOR
```

Also show:

```text
Updated 4 sec ago
```

Stale:

```text
STALE • updated 4 min ago
```

---

# 13. Reservation / Parking UI — Optional

If included:

```text
Charging + Parking

Station      Alpha
Charger      DC-02
Bay          BAY 05
Start        14:00
Duration     30 min
Estimate     ₹312

[ CONFIRM DEMO RESERVATION ]
```

Arrival:

```text
BAY 05
Reservation verified

[ UNLOCK BAY ]
```

Never show unlock success until device acknowledgment or demo state confirms it.

---

# 14. Design for the Physical Prototype

The supplied parking-bay concept consistently includes:

- PAY&PARK/EV bay branding.
- Bay number.
- EV symbol.
- Charging pedestal.
- Flap lock/barrier.
- Occupancy sensor.
- ESP-based controller enclosure.
- Local status indicator.

For the miniature demo:

```text
      CHARGER
        │
┌─────────────────┐
│    MODEL EV     │
│       📡        │ ← occupancy sensor
│                 │
├──── FLAP ───────┤
│      ENTRY      │
└─────────────────┘
      ESP8266
```

Keep the electronics tidy and low-voltage.

---

# 15. UX Copy Rules

Prefer:

- “Estimated wait: ~8 min”
- “Predicted traffic: High”
- “Data source: Demo”
- “Updated 5 sec ago”
- “Recommended because…”
- “Backup charger”
- “No safe reachable charger found”

Avoid:

- “AI says…”
- “100% accurate”
- “Guaranteed available”
- “Guaranteed reliable”
- “Zero congestion”
- “Real-time” when data is actually static.

---

# 16. Loading, Empty and Error States

## Loading

```text
Analyzing routes...
Estimating energy...
Checking charger status...
```

## No charger

```text
No safe compatible charger is reachable with the current battery reserve.
Try another route or increase starting SOC.
```

## Charger data unavailable

```text
Live charger data unavailable.
Showing last known/demo status.
```

## MQTT offline

```text
IoT connection lost.
Device status is uncertain.
```

---

# 17. Accessibility

- Minimum readable contrast.
- Keyboard-accessible controls.
- Visible focus states.
- Icons accompanied by labels.
- Traffic status not color-only.
- Charger state not color-only.
- Large tap targets on mobile.
- Error text near the field/action that caused it.

---

# 18. Screen Priority for One-Day Build

Build in this order:

1. Journey planner.
2. Result + route cards.
3. Charger recommendation.
4. Operator digital twin.
5. Live telemetry/fault state.
6. Backup recommendation.
7. Alternatives.
8. Reservation.
9. Parking access.
10. History/analytics extras.

---

# 19. Demo Visual Sequence

For judging, the UI should visually tell this story:

```text
38% SOC
↓
Route A predicted severe
↓
Route B recommended
↓
Station Alpha 94 reliability
↓
IoT fault triggered
↓
Station Alpha becomes FAULT
↓
Station Beta promoted
↓
User continues with confidence
```

This directly supports the pitch.

---

## Source Grounding

Design direction comes from the supplied VoltTwin AI architecture poster, sticky-note product boards, EV Mobility poster, sample phone screens, digital-twin map/dashboard, smart-charger monitoring poster and smart-parking-bay concepts.
