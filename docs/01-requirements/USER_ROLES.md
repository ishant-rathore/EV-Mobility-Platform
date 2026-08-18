# VoltTwin AI — User Roles and Permissions

This document defines who uses the platform, what each role can do, and which roles are required for the one-day SIH prototype.

---

## 1. Role Summary

| Role | Priority | Main Goal |
|---|---:|---|
| EV Driver | P0 | Plan a safe, efficient EV journey |
| Charging Station Operator | P0 | Monitor chargers, sessions and faults |
| Admin / Hackathon Operator | P0 | Control demo data, users, routes and devices |
| Parking / Charging Site Operator | P1 | Manage bays, occupancy and access |
| Fleet / Commercial User | P1 | Get vehicle-class-aware routing |
| City / Infrastructure Planner | P2 | Use aggregate analytics for planning |

---

# 2. EV Driver

## Purpose

The primary product user.

## P0 capabilities

- Select EV profile.
- Enter SOC.
- Enter origin/destination.
- View candidate routes.
- View current/predicted congestion.
- View estimated energy and arrival SOC.
- See whether charging is required.
- View compatible reachable chargers.
- View charger status.
- View estimated waiting time.
- View reliability score.
- View cost estimate when available.
- Receive best route + best charger.
- View backup charger.
- Receive re-recommendation when conditions change.

## P1 capabilities

- Create account.
- Save multiple EVs.
- Reserve charger.
- Reserve parking.
- Pay.
- Navigate.
- Unlock reserved bay.
- View active session.
- View history.
- Receive notifications.

## Driver-visible explanations

The driver should see reasons such as:

- “Lower predicted congestion.”
- “Reachable with 10% reserve.”
- “Higher charger reliability.”
- “Lower expected wait.”
- “Slightly longer route but lower total journey time.”

---

# 3. Charging Station Operator

## Purpose

Operate chargers and understand utilization/health.

## P0 capabilities

- View stations/chargers.
- View current state.
- View telemetry freshness.
- View source mode.
- View reliability score.
- View recent faults.
- View active sessions.
- View current wait estimate.
- View device online/offline state.
- View route traffic around stations where modeled.
- View basic utilization.

## P1 capabilities

- Edit charger inventory.
- Update pricing.
- Manage reservations.
- Mark charger unavailable for maintenance.
- View historical utilization.
- View revenue.
- View average session time.

## P2 capabilities

- Demand forecasting.
- Predictive maintenance.
- Dynamic pricing.
- Capacity planning.

---

# 4. Admin / Hackathon Operator

## Purpose

Keep the prototype controllable and recoverable.

## P0 capabilities

- Reset demo.
- Seed routes.
- Seed chargers.
- Change route traffic.
- Trigger charger states.
- Trigger charger fault.
- Trigger charger recovery.
- Change source mode.
- Run traffic-diversification simulation.
- View backend/device logs.
- View latest MQTT events.
- Enable/disable optional modules.

## Restrictions

- Admin controls must not appear as normal driver actions.
- Destructive/reset actions should be clearly labeled.
- In deployed mode, admin endpoints require authentication/authorization.

---

# 5. Parking / Charging Site Operator

## Purpose

Manage the physical site where charging and parking are co-located.

## P1 capabilities

- View bay availability.
- View occupancy.
- View IoT device state.
- View reservations.
- Assign bay.
- Handle access problems.
- View flap/lock status.
- View device heartbeat.

## Future

- Multiple sites.
- Maintenance tickets.
- Staff overrides with audit logging.

---

# 6. Fleet / Commercial User

## Purpose

Demonstrate PS-05 vehicle-class-aware route diversification.

## P1 capabilities

- Select vehicle class.
- Receive only eligible routes.
- View travel time and charger impact.
- Receive predictable charging stop.
- Compare alternatives.

Potential demo classes:

- Car.
- Bike/two-wheeler.
- Truck.
- Commercial vehicle.

The prototype must not imply legal road restrictions that are not actually sourced; route eligibility is demo configuration unless verified.

---

# 7. City / Infrastructure Planner

## Purpose

Future aggregate analytics user.

## P2 capabilities

- View aggregate charger utilization.
- View congestion trends.
- View demand heatmaps.
- Identify high-demand low-capacity areas.
- Compare infrastructure scenarios.

The one-day MVP should **not** claim that it can reliably recommend “X new chargers” without a validated dataset/model.

---

# 8. Permissions Matrix

| Action | Driver | Charger Operator | Admin | Site Operator | Fleet |
|---|:---:|:---:|:---:|:---:|:---:|
| Plan journey | ✅ | — | ✅ | — | ✅ |
| Enter SOC | ✅ | — | ✅ | — | ✅ |
| View route prediction | ✅ | ✅ | ✅ | ✅ | ✅ |
| View charger status | ✅ | ✅ | ✅ | ✅ | ✅ |
| View reliability | ✅ | ✅ | ✅ | ✅ | ✅ |
| Reserve charger | P1 | View | ✅ | View | P1 |
| Reserve bay | P1 | View | ✅ | Manage | P1 |
| Trigger access | P1 self | — | Demo only | Manage | P1 |
| Edit charger data | — | P1 | ✅ | Limited | — |
| Change traffic demo | — | — | ✅ | — | — |
| Trigger fault simulation | — | — | ✅ | — | — |
| Reset demo | — | — | ✅ | — | — |
| View raw telemetry | Limited | ✅ | ✅ | ✅ | Limited |
| View source mode | Limited | ✅ | ✅ | ✅ | Limited |
| View analytics | Personal | ✅ | ✅ | ✅ | Fleet |
| Manage users | — | — | P1 | — | — |

---

# 9. Authentication Strategy

## One-day prototype

Authentication may be simplified if it risks the hero demo.

Acceptable:

- Demo driver session.
- Demo operator session.
- Demo admin route protected by a simple local login or environment-controlled demo mode.

## Post-MVP

- JWT/session auth.
- Refresh flow.
- Password hashing.
- RBAC.
- Audit log.
- Operator organization boundaries.
- Per-site access.

---

# 10. Role-Based UI

## Driver UI

Focus:

- Journey.
- Map.
- Recommendation.
- Confidence/reliability.
- Backup.

Avoid:

- Raw MQTT.
- Debug values.
- Scoring implementation details.

## Operator UI

Focus:

- Infrastructure state.
- Freshness.
- Faults.
- Utilization.
- Traffic.
- Telemetry.

## Admin UI

Focus:

- Scenario controls.
- Reset.
- Seed.
- Debug.

---

# 11. Role-Based Data Exposure

### Driver can see

- Public station info.
- Journey-specific estimates.
- Reliability summary.
- Status/freshness indicator.

### Driver should not see

- Device credentials.
- Internal broker information.
- Other users’ bookings.
- Admin controls.

### Operator can see

- Their station telemetry.
- Their reservations/sessions.
- Device state.

### Admin can see

- Full demo state.
- System logs required for hackathon operations.

---

# 12. User Stories

### Driver

> As an EV driver, I want to know whether my current battery is enough so that I can travel without range anxiety.

> As an EV driver, I want the platform to recommend a charger that is likely to work when I arrive, not merely the nearest charger.

> As an EV driver, I want a backup charger if the primary charger becomes faulty.

### Operator

> As a charger operator, I want live state and fault visibility so that users are not routed to a broken charger.

### Admin

> As the hackathon operator, I want to switch between hardware and simulator telemetry so that the demo remains reliable.

### Fleet user

> As a commercial/fleet user, I want a route suitable for my vehicle class instead of receiving the same route as every other vehicle.

---

## Source Grounding

Roles consolidate the user/persona sections in the EV PRDs, the earlier Pay&Park driver/owner/admin model, the PS-05 vehicle-class diversification concept, and the operator dashboard shown in the supplied visuals.
