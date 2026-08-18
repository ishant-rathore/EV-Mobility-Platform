# Applications

- `web`: working React/Vite driver, operator, and demo-control interface.
- `mobile`: reserved application boundary; currently documentation-only.

Applications consume backend REST/WebSocket APIs. They must not connect directly to PostgreSQL, MQTT, payment storage, or physical devices.
