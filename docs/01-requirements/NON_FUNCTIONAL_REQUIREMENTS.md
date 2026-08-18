
---

## 4. `NON_FUNCTIONAL_REQUIREMENTS.md`

```md
# EV Mobility Platform — Non-Functional Requirements

**Version:** 1.0  
**Status:** SIH 2026 MVP

---

## 1. Performance

### NFR-001
Normal API requests should respond quickly under expected MVP load.

### NFR-002
Basic energy calculations should execute near real time.

### NFR-003
The frontend should provide loading states for long-running operations.

### NFR-004
The system should avoid unnecessary API requests.

---

## 2. Availability

### NFR-005
Core services should be available during the demonstration.

### NFR-006
The system should gracefully handle unavailable external APIs.

### NFR-007
IoT device failures must not crash the main application.

---

## 3. Security

### NFR-008
Passwords must never be stored as plain text.

### NFR-009
Protected APIs must require authentication.

### NFR-010
Role-based authorization shall protect privileged operations.

### NFR-011
Payment information must not be unnecessarily stored by the platform.

### NFR-012
IoT commands must be authorized before execution.

### NFR-013
Secrets must be stored using environment variables/secrets management.

---

## 4. Reliability

### NFR-014
The system must prevent duplicate reservations.

### NFR-015
Payment failures must not create confirmed bookings.

### NFR-016
IoT commands should be logged.

### NFR-017
Important state transitions should be auditable.

---

## 5. Usability

### NFR-018
The driver journey should be simple and understandable.

### NFR-019
The primary workflow should require minimal user interaction.

### NFR-020
Important recommendations must explain their reasoning.

### NFR-021
Errors must use human-readable messages.

---

## 6. Accessibility

### NFR-022
Text must have sufficient contrast.

### NFR-023
Interactive elements should have clear states.

### NFR-024
The application should support keyboard navigation where applicable.

### NFR-025
Icons should not be the only indicator of important information.

---

## 7. Scalability

### NFR-026
Backend modules should be modular.

### NFR-027
Database access should use Prisma.

### NFR-028
IoT communication should use a broker-based MQTT architecture.

### NFR-029
The system should allow additional charging providers to be integrated later.

---

## 8. Maintainability

### NFR-030
Code should use TypeScript for frontend/backend application logic.

### NFR-031
Features should be separated into logical modules.

### NFR-032
Critical business logic should have automated tests.

### NFR-033
API contracts should be documented.

---

## 9. Compatibility

### NFR-034
The web application shall support modern browsers.

### NFR-035
The UI shall be responsive.

### NFR-036
The backend shall support the documented frontend clients.

---

## 10. Observability

### NFR-037
Application errors should be logged.

### NFR-038
IoT connection/device status should be observable.

### NFR-039
Important booking and payment events should be traceable.
