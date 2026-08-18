# Database Relationships

| Parent | Child | Cardinality | Purpose |
|---|---|---|---|
| User | Vehicle | 1:N | User can own multiple EVs |
| User | Journey | 1:N | User creates journeys |
| Vehicle | Journey | 1:N | Vehicle is used for journeys |
| Station | Charger | 1:N | Station contains chargers |
| Station | StationStatus | 1:N | Status history/snapshots |
| User | Reservation | 1:N | User makes bookings |
| Vehicle | Reservation | 1:N | Vehicle is booked for charging |
| Station | Reservation | 1:N | Reservation targets station |
| Charger | Reservation | 1:N | Optional charger-specific booking |
| Station | ParkingSpace | 1:N | Station contains bays |
| User | ParkingReservation | 1:N | User books parking |
| Vehicle | ParkingReservation | 1:N | Vehicle occupies booking |
| ParkingSpace | ParkingReservation | 1:N | Bay has booking history |
| Reservation | Payment | 1:N | Charging booking payment records |
| ParkingReservation | Payment | 1:N | Parking booking payment records |
| ParkingSpace | OccupancyEvent | 1:N | Bay occupancy history |
| IoTDevice | OccupancyEvent | 1:N | Device reports occupancy |
| User | Notification | 1:N | User receives notifications |
