# Database Schema

## Canonical entities

### User
Identity and account information.

### Vehicle
EV profile, model, battery capacity, efficiency, connector type, and user ownership.

### Journey
Origin, destination, battery state, route, energy estimate, and journey status.

### Station
Charging/parking infrastructure location and metadata.

### Charger
Individual charger attached to a station, including connector and power details.

### StationStatus
Current availability and operational status snapshot.

### Reservation
Charging reservation linked to a user, vehicle, station, and optionally charger.

### ParkingSpace
Individual parking bay associated with a station.

### ParkingReservation
Parking booking linked to user, vehicle, and parking space.

### Payment
Payment transaction and status for a reservation/booking.

### IoTDevice
Physical device identity, type, connectivity, and health.

### OccupancyEvent
Timestamped occupancy changes for parking infrastructure.

### Notification
User-facing operational and booking messages.

## Rules
All primary keys are unique. Foreign keys must reference canonical records. Created/updated timestamps are required for mutable transactional entities.
