# Changelog

All notable changes are documented here. The project follows semantic versioning once public releases begin.

## Unreleased

- Normalized the modular monorepo around `apps`, `backend/api`, `intelligence`, `iot`, `database`, and workspace packages.
- Extracted tested pure energy, route, traffic, station-ranking, and charger-reliability calculations without changing HTTP contracts.
- Preserved the working driver/operator web UI and Modules 1–4 backend workflow.
- Completed Module 6 with explainable reliability factors, fault/offline invalidation, telemetry freshness, REST/MQTT ingestion, backup selection, and API documentation.
- Wired Modules 1–6 through the integrated journey endpoint, including connector and reachability filters, explainable station ranking, dynamic charger reliability, and automatic backup promotion after simulated fault telemetry.
- Added Module 8 recommendation orchestration as a tested pure intelligence package, authoritative recommendation API, integrated journey summary, and visibly simulated frontend explanation.
