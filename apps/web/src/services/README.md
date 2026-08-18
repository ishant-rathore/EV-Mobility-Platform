# Frontend Services

`api.client.ts` is the single HTTP boundary. Add domain service modules only when they encapsulate real endpoint contracts; frontend services must not expose PostgreSQL, MQTT, device, or payment-storage access.
