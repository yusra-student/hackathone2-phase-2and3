"""Database connection and session management."""

import ssl
from sqlmodel import SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine
from sqlalchemy.orm import sessionmaker
from typing import AsyncGenerator

from app.config import settings


def get_database_url() -> str:
    """Get database URL, converting to asyncpg dialect and removing sslmode."""
    url = settings.DATABASE_URL
    # Convert postgresql:// to postgresql+asyncpg:// for async engine
    if url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
    # Remove sslmode and channel_binding from URL as asyncpg handles SSL differently
    if "?" in url:
        base, params = url.split("?", 1)
        param_list = [p for p in params.split("&") if not p.startswith("sslmode=") and not p.startswith("channel_binding=")]
        if param_list:
            url = f"{base}?{'&'.join(param_list)}"
        else:
            url = base
    return url


# Create async engine with connection pooling for serverless PostgreSQL
engine: AsyncEngine = create_async_engine(
    get_database_url(),
    echo=settings.DEBUG,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
    pool_recycle=300,  # Recycle connections after 5 minutes
)

# Async session factory
async_session_maker = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Dependency to get async database session."""
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()


async def create_db_and_tables():
    """Create all database tables."""
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


async def close_db_connection():
    """Close database connection pool."""
    await engine.dispose()
