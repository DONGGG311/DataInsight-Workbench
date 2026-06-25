import os

class Settings:
    DB_PATH: str = os.getenv("DB_PATH", "backend/data/datainsight.db")
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "backend/data/uploads")
    MAX_FILE_SIZE: int = 100 * 1024 * 1024  # 100MB
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000"]

settings = Settings()
