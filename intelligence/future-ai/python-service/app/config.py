from pydantic import BaseModel


class Settings(BaseModel):
    service_name: str = "VoltTwin AI Service"
    model_directory: str = "app/models"


settings = Settings()
