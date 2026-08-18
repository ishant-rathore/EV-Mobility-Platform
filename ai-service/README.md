# Optional AI service

Use this FastAPI service only for trained ML inference. Deterministic energy, traffic, reliability, and recommendation logic stays in the TypeScript backend.

Run locally after installing the requirements:

```bash
uvicorn app.main:app --reload --app-dir ai-service
```
