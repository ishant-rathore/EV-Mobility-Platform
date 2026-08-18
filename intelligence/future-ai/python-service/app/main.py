from fastapi import FastAPI

from app.config import settings

app = FastAPI(title=settings.service_name)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": settings.service_name}
