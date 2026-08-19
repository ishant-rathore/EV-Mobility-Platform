# EV Mobility Platform — User Roles

**Version:** 1.0  
**Status:** Frozen SIH 2026 MVP

---

## 1. EV Driver

**Primary user**

### Responsibilities

- Manage EV profile
- Plan journeys
- Check battery
- Find charging stations
- Compare recommendations
- Reserve charging
- Reserve parking
- Make payment
- Access parking
- View trip history

### Permissions

| Feature | Access |
|---|---|
| EV Profile | Create / Read / Update |
| Journey | Create / Read |
| Stations | Read |
| Reservations | Create / Read / Cancel |
| Payment | Create / Read |
| Parking | Read |
| IoT Access | Authorized |
| Analytics | Own data only |

---

# 2. Charging Station Operator

### Responsibilities

- Manage charging stations
- Monitor chargers
- View reservations
- Monitor utilization
- View charging analytics

### Permissions

- Station management
- Charger management
- Reservation viewing
- Analytics
- Operational status

---

# 3. Parking Operator

### Responsibilities

- Manage parking bays
- Monitor occupancy
- Manage IoT devices
- View parking reservations

### Permissions

- Parking management
- Occupancy monitoring
- Device monitoring
- Reservation management
- Parking analytics

---

# 4. Admin

### Responsibilities

- Manage users
- Manage operators
- Manage stations
- Manage parking
- Manage devices
- Monitor system activity

### Permissions

Administrative access to platform configuration and management.

---

# 5. Future Role — Fleet Manager

**Status:** Future capability

### Possible Responsibilities

- Manage EV fleet
- Optimize fleet routes
- Monitor charging
- Analyze vehicle utilization

**Not required for P0 MVP.**

---

# 6. Role Overview

| Role | Primary Responsibility | MVP |
|---|---|:---:|
| **EV Driver** | Plan, charge, park and complete journeys | ✅ P0 |
| **Charging Station Operator** | Manage charging infrastructure | ✅ P0 |
| **Parking Operator** | Manage parking and IoT infrastructure | ✅ P0 |
| **Admin** | Manage platform and system operations | ✅ P0 |
| **Fleet Manager** | Fleet optimization and management | ⏳ Future |

---

# 7. Role Hierarchy

```text
                    ADMIN
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
CHARGING STATION OPERATOR   PARKING OPERATOR
          │                       │
          ▼                       ▼
      CHARGERS                PARKING + IoT
          │                       │
          └───────────┬───────────┘
                      │
                      ▼
                  EV DRIVER
                      │
                      ▼
             EV JOURNEY
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
      ROUTE        CHARGING       PARKING
        │             │             │
        └─────────────┼─────────────┘
                      ▼
                   PAYMENT
                      │
                      ▼
                  IoT ACCESS
