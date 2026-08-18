
---

## 11. `USER_ROLES.md`

```md
# EV Mobility Platform — User Roles

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

Future capability.

Possible responsibilities:

- Manage EV fleet
- Optimize fleet routes
- Monitor charging
- Analyze vehicle utilization

Not required for P0 MVP.
