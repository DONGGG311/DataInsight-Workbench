from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from database import init_db
import os

app = FastAPI(title="DataInsight Workbench API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routers import datasets
app.include_router(datasets.router)
from routers import data
app.include_router(data.router)
from routers import chart
app.include_router(chart.router)
from routers import profile
app.include_router(profile.router)

@app.on_event("startup")
def startup():
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    init_db()

@app.get("/api/health")
def health():
    return {"status": "ok"}
