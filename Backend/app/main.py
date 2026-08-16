from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.connection import connect_to_mongodb, close_mongodb_connection
from app.routers.auth_router import router as auth_router
from app.routers.medicine_router import router as medicine_router
from app.routers.kendra_router import router as kendra_router
@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongodb()
    yield
    await close_mongodb_connection()


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan
)

# Allow the React dev server (and other local dev ports) to call this API.
# Without this, browsers silently block every request with a CORS error
# that never reaches your frontend's error-handling code.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(medicine_router)
app.include_router(kendra_router)
@app.get("/")
async def root():
    return {
        "message": "Smart Medicine Availability & Intelligent Janaushadhi Recommendation System Backend is Running"
    }