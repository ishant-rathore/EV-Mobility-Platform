# Risks

| Risk | Mitigation |
|---|---|
| Demo data mistaken for live data | Mandatory source metadata and UI labels |
| Estimated range treated as exact | Reserve-aware logic, explanation, conservative wording |
| Prototype connected unsafely | Low-voltage-only documentation and supervised hardware review |
| Backend modules drift after extraction | Compatibility adapters plus package and API tests |
| Schema outruns implementation | Document entity gaps; require migration for every semantic change |
| External API/broker/database outage | Deterministic fallback and offline E2E scenario |
| Payment scope expands into card storage | Provider sandbox/tokenization only; never store card data |
| Future AI presented as production-ready | Require datasets, evaluation metrics, limitations, and approvals |
