# EV Mobility Platform — Non-Functional Requirements

**Version:** 1.0  
**Status:** Frozen SIH 2026 MVP

---

## 1. NFR Objective

Define the quality requirements required for the EV Mobility Platform MVP to remain:

- Fast
- Available
- Secure
- Reliable
- Usable
- Accessible
- Maintainable
- Scalable
- Compatible
- Observable

The NFRs apply across the frontend, backend, database, API, payment flow, and IoT infrastructure.

---

# 2. Performance

## NFR-001 — API Response

Normal API requests should respond quickly under expected MVP load.

## NFR-002 — Energy Calculation

Basic energy calculations should execute near real time.

## NFR-003 — Loading States

The frontend should provide loading states for long-running operations.

## NFR-004 — API Efficiency

The system should avoid unnecessary API requests.

---

# 3. Availability

## NFR-005 — Core Services

Core services should be available during the demonstration.

## NFR-006 — External API Failure

The system should gracefully handle unavailable external APIs.

## NFR-007 — IoT Failure Isolation

IoT device failures must not crash the main application.

---

# 4. Security

## NFR-008 — Password Protection

Passwords must never be stored as plain text.

## NFR-009 — API Authentication

Protected APIs must require authentication.

## NFR-010 — Role-Based Authorization

Role-based authorization shall protect privileged operations.

## NFR-011 — Payment Information

Payment information must not be unnecessarily stored by the platform.

## NFR-012 — IoT Authorization

IoT commands must be authorized before execution.

## NFR-013 — Secret Management

Secrets must be stored using environment variables or secrets management.

---

# 5. Reliability

## NFR-014 — Duplicate Reservations

The system must prevent duplicate reservations.

## NFR-015 — Payment Failure

Payment failures must not create confirmed bookings.

## NFR-016 — IoT Command Logging

IoT commands should be logged.

## NFR-017 — State Auditing

Important state transitions should be auditable.

---

# 6. Usability

## NFR-018 — Driver Experience

The driver journey should be simple and understandable.

## NFR-019 — Minimal Interaction

The primary workflow should require minimal user interaction.

## NFR-020 — Explainable Recommendations

Important recommendations must explain their reasoning.

## NFR-021 — Error Messages

Errors must use human-readable messages.

---

# 7. Accessibility

## NFR-022 — Text Contrast

Text must have sufficient contrast.

## NFR-023 — Interactive States

Interactive elements should have clear states.

## NFR-024 — Keyboard Navigation

The application should support keyboard navigation where applicable.

## NFR-025 — Information Indicators

Icons should not be the only indicator of important information.

---

# 8. Scalability

## NFR-026 — Modular Backend

Backend modules should be modular.

## NFR-027 — Database Access

Database access should use Prisma.

## NFR-028 — MQTT Architecture

IoT communication should use a broker-based MQTT architecture.

## NFR-029 — Charging Provider Integration

The system should allow additional charging providers to be integrated later.

---

# 9. Maintainability

## NFR-030 — TypeScript

Frontend and backend application logic should use TypeScript.

## NFR-031 — Logical Modules

Features should be separated into logical modules.

## NFR-032 — Automated Testing

Critical business logic should have automated tests.

## NFR-033 — API Documentation

API contracts should be documented.

---

# 10. Compatibility

## NFR-034 — Browser Support

The web application shall support modern browsers.

## NFR-035 — Responsive UI

The UI shall be responsive.

## NFR-036 — Frontend Compatibility

The backend shall support the documented frontend clients.

---

# 11. Observability

## NFR-037 — Application Logging

Application errors should be logged.

## NFR-038 — IoT Monitoring

IoT connection and device status should be observable.

## NFR-039 — Transaction Traceability

Important booking and payment events should be traceable.

---

# 12. MVP NFR Priority

The following requirements are considered important for the SIH 2026 MVP:

### P0 — Critical

- API responsiveness
- Core service availability
- Authentication
- RBAC
- IoT authorization
- Duplicate reservation prevention
- Payment failure protection
- Driver usability
- Explainable recommendations
- Responsive UI
- Error logging
- IoT status monitoring

### P1 — Important

- Accessibility improvements
- Automated testing
- API documentation
- Provider extensibility
- Advanced observability

### P2 — Post-MVP

- Large-scale backend scaling
- Advanced monitoring
- Additional charging providers
- Extended accessibility coverage

---

# 13. NFR Validation Checklist

Before the MVP is considered ready:

- [ ] Normal API requests are responsive
- [ ] Energy calculations execute near real time
- [ ] Loading states are implemented
- [ ] External API failures are handled
- [ ] IoT failures do not crash the application
- [ ] Passwords are protected
- [ ] Protected APIs require authentication
- [ ] RBAC is enforced
- [ ] IoT commands are authorized
- [ ] Secrets are not hardcoded
- [ ] Duplicate reservations are prevented
- [ ] Failed payments cannot confirm bookings
- [ ] Important state transitions are auditable
- [ ] Driver journey is understandable
- [ ] Recommendations explain their reasoning
- [ ] Errors are human-readable
- [ ] UI is responsive
- [ ] Critical business logic is tested
- [ ] API contracts are documented
- [ ] Application errors are logged
- [ ] IoT status is observable
- [ ] Booking and payment events are traceable

---

# 14. NFR Success Criteria

The MVP is considered NFR-ready when the system can demonstrate the core EV journey without significant performance, security, reliability, usability, or infrastructure failures.

```text
LOGIN
 ↓
EV PROFILE
 ↓
BATTERY / SOC
 ↓
ORIGIN + DESTINATION
 ↓
ROUTE
 ↓
ENERGY ESTIMATION
 ↓
CHARGING
 ↓
RECOMMENDATION
 ↓
RESERVATION
 ↓
PAYMENT
 ↓
CONFIRMATION
 ↓
PARKING
 ↓
MQTT
 ↓
IoT DEVICE
 ↓
SESSION
 ↓
COMPLETE
