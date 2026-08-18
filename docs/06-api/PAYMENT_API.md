# Payment simulation API

`POST /api/v1/reservations/:id/payments/simulate`

```json
{
  "idempotencyKey": "demo-payment-0001",
  "amount": 250,
  "currency": "INR",
  "outcome": "APPROVED"
}
```

The endpoint is available only when the reservation was created with `paymentRequired: true`. Repeating the same idempotency key for the same reservation returns the original result. Reusing it for another reservation returns a conflict.

The request is strict and has no card, CVV, bank, or wallet fields. The response is marked `DEMO`, `isSimulated: true`, and states that no money moved. Declined simulations leave the reservation pending; approved simulations confirm it.

Payment provider sandboxes, signatures, webhooks, refunds, and production settlement are not implemented.
