
---

# 7. `REPOSITORY_STRUCTURE.md`

```md
# ⚡ EV Mobility Platform — Repository Structure

**Architecture:** Professional Modular Monorepo  
**Version:** 1.0

---

# 1. Root Structure

```text
EV-Mobility-Platform/
│
├── apps/
│   ├── web/
│   └── api/
│
├── packages/
│   ├── shared/
│   ├── types/
│   ├── validation/
│   └── config/
│
├── services/
│   ├── ev-engine/
│   ├── charging/
│   ├── parking/
│   ├── reservation/
│   ├── payment/
│   └── iot/
│
├── firmware/
│   └── esp32/
│
├── database/
│   ├── prisma/
│   └── seed/
│
├── docs/
│   ├── 01-requirements/
│   ├── 02-research/
│   ├── 03-architecture/
│   └── ...
│
├── infrastructure/
│   ├── docker/
│   ├── mqtt/
│   └── deployment/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .github/
│   └── workflows/
│
├── docker-compose.yml
├── package.json
├── README.md
└── .env.example
