---

## 21. `ERROR_CODES.md`

```md
# ⚠️ EV Mobility Platform — Error Codes

## Authentication

| Code | Meaning |
|---|---|
| AUTH_INVALID_CREDENTIALS | Invalid credentials |
| AUTH_TOKEN_MISSING | JWT missing |
| AUTH_TOKEN_INVALID | Invalid JWT |
| AUTH_TOKEN_EXPIRED | JWT expired |

## Authorization

| Code | Meaning |
|---|---|
| FORBIDDEN | Access denied |
| ROLE_REQUIRED | Required role missing |
| RESOURCE_NOT_OWNED | Resource does not belong to user |

## Validation

| Code | Meaning |
|---|---|
| VALIDATION_ERROR | Invalid request |
| INVALID_SOC | Invalid state of charge |
| INVALID_TIME_RANGE | Invalid reservation period |

## Journey

| Code | Meaning |
|---|---|
| ROUTE_NOT_FOUND | Route unavailable |
| ENERGY_CALCULATION_FAILED | Energy calculation failed |
| CHARGING_NOT_REQUIRED | Charging is not required |

## Charging

| Code | Meaning |
|---|---|
| STATION_NOT_FOUND | Station unavailable |
| CHARGER_UNAVAILABLE | Charger unavailable |
| CHARGER_OFFLINE | Charger offline |
| CHARGING_SESSION_NOT_FOUND | Session unavailable |

## Reservation

| Code | Meaning |
|---|---|
| RESERVATION_NOT_FOUND | Reservation unavailable |
| SLOT_ALREADY_RESERVED | Slot already reserved |
| RESERVATION_EXPIRED | Reservation expired |
| INVALID_RESERVATION_STATE | Invalid reservation state |

## Payment

| Code | Meaning |
|---|---|
| PAYMENT_FAILED | Payment failed |
| PAYMENT_NOT_VERIFIED | Payment verification failed |
| PAYMENT_NOT_FOUND | Payment unavailable |

## IoT

| Code | Meaning |
|---|---|
| DEVICE_NOT_FOUND | Device unavailable |
| DEVICE_OFFLINE | Device offline |
| DEVICE_COMMAND_FAILED | Command failed |
| UNAUTHORIZED_DEVICE | Device not authorized |

## System

| Code | Meaning |
|---|---|
| INTERNAL_ERROR | Internal server error |
| SERVICE_UNAVAILABLE | Service unavailable |
| RATE_LIMITED | Too many requests |
