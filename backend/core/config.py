import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Viña del Mal SaaS"
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/vinadelmal"
    )
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")

    # JWT & Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "https://vina-del-mal.vercel.app",
    ]

    # Flow.cl Payment Gateway
    FLOW_API_KEY: str = os.getenv("FLOW_API_KEY", "")
    FLOW_SECRET_KEY: str = os.getenv("FLOW_SECRET_KEY", "")
    FLOW_API_URL: str = os.getenv("FLOW_API_URL", "https://sandbox.flow.cl/api")

    # Server
    PORT: int = int(os.getenv("PORT", "8000"))


settings = Settings()
