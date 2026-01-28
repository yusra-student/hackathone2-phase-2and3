"""FastAPI application entry point."""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import create_db_and_tables, close_db_connection

# Import models to register them with SQLModel
from app.models import User, Task, ChatMessage

# Import routers
from app.routers.auth import router as auth_router
from app.routers.tasks import router as tasks_router
from app.routers.chat import router as chat_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler for startup and shutdown."""
    # Startup: Create database tables
    await create_db_and_tables()
    yield
    # Shutdown: Close database connections
    await close_db_connection()


app = FastAPI(
    title="Todo App with AI Chatbot",
    description="A production-ready Todo application with AI-powered chatbot assistant",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(tasks_router)
app.include_router(chat_router)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "healthy", "message": "Todo App API is running"}


@app.get("/api/health")
async def health_check():
    """API health check."""
    return {"status": "ok"}
