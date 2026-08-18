# Payment flow

```text
PENDING_PAYMENT demo reservation
→ strict amount/currency/outcome request
→ idempotency-key check
→ simulated APPROVED or DECLINED result
→ APPROVED confirms reservation
```

No money moves and no card data is accepted or stored.
