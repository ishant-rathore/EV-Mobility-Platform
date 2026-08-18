# System architecture

```text
React web
   ↓ REST / WebSocket
Express API
   ├─ PostgreSQL / Prisma
   ├─ routing and station providers
   └─ MQTT ingestion ← ESP8266 / simulator
```
