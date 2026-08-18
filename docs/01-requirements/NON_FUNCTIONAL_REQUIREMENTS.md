⚡ EV Mobility Platform — Non-Functional Requirements

Version: 1.0
Status: SIH 2026 MVP

1. Performance
NFR-001 — API Response Time

Normal API requests should respond quickly under expected MVP load.

NFR-002 — Energy Calculation

Basic energy calculations should execute near real time.

NFR-003 — Frontend Loading States

The frontend should provide appropriate loading states for long-running operations.

NFR-004 — API Efficiency

The system should avoid unnecessary API requests.

2. Availability
NFR-005 — Demonstration Availability

Core services should remain available throughout the demonstration.

NFR-006 — External API Failure Handling

The system should gracefully handle unavailable external APIs.

NFR-007 — IoT Failure Isolation

IoT device failures must not crash the main application.

3. Security
NFR-008 — Password Security

Passwords must never be stored as plain text.

NFR-009 — API Authentication

Protected APIs must require authentication.

NFR-010 — Role-Based Authorization

Role-based authorization shall protect privileged operations.

NFR-011 — Payment Data Protection

Payment information must not be unnecessarily stored by the platform.

NFR-012 — IoT Command Authorization

IoT commands must be authorized before execution.

NFR-013 — Secret Management

Secrets must be stored using environment variables or an appropriate secrets-management mechanism.

4. Reliability
NFR-014 — Duplicate Reservation Prevention

The system must prevent duplicate reservations.

NFR-015 — Payment Failure Handling

Payment failures must not create confirmed bookings.

NFR-016 — IoT Command Logging

IoT commands should be logged.

NFR-017 — Auditable State Transitions

Important state transitions should be auditable.

5. Usability
NFR-018 — Simple Driver Journey

The driver journey should be simple and understandable.

NFR-019 — Minimal User Interaction

The primary workflow should require minimal user interaction.

NFR-020 — Explainable Recommendations

Important recommendations must explain their reasoning.

NFR-021 — Human-Readable Errors

Errors must use human-readable messages.

6. Accessibility
NFR-022 — Text Contrast

Text must have sufficient contrast.

NFR-023 — Interactive States

Interactive elements should have clear states.

NFR-024 — Keyboard Navigation

The application should support keyboard navigation where applicable.

NFR-025 — Non-Color Indicators

Icons should not be the only indicator of important information.

7. Scalability
NFR-026 — Modular Backend

Backend modules should be modular.

NFR-027 — Database Access

Database access should use Prisma.

NFR-028 — MQTT Architecture

IoT communication should use a broker-based MQTT architecture.

NFR-029 — Charging Provider Extensibility

The system should allow additional charging providers to be integrated later.

8. Maintainability
NFR-030 — TypeScript

Frontend and backend application logic should use TypeScript.

NFR-031 — Logical Modules

Features should be separated into logical modules.

NFR-032 — Automated Testing

Critical business logic should have automated tests.

NFR-033 — API Documentation

API contracts should be documented.

9. Compatibility
NFR-034 — Modern Browser Support

The web application shall support modern browsers.

NFR-035 — Responsive UI

The UI shall be responsive.

NFR-036 — Frontend Compatibility

The backend shall support the documented frontend clients.

10. Observability
NFR-037 — Application Error Logging

Application errors should be logged.

NFR-038 — IoT Observability

IoT connection and device status should be observable.

NFR-039 — Booking and Payment Traceability

Important booking and payment events should be traceable.

11. NFR Summary
Category	Requirements
Performance	NFR-001 → NFR-004
Availability	NFR-005 → NFR-007
Security	NFR-008 → NFR-013
Reliability	NFR-014 → NFR-017
Usability	NFR-018 → NFR-021
Accessibility	NFR-022 → NFR-025
Scalability	NFR-026 → NFR-029
Maintainability	NFR-030 → NFR-033
Compatibility	NFR-034 → NFR-036
Observability	NFR-037 → NFR-039
Core Principle

The MVP must be fast enough to demonstrate, reliable enough to operate, secure enough to protect users and resources, understandable enough for drivers, and modular enough to extend after the hackathon.
