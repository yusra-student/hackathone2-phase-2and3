"""Task database model."""

from datetime import datetime, date, time
from typing import Optional, TYPE_CHECKING
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from app.models.user import User


class Task(SQLModel, table=True):
    """Task model for todo items."""

    __tablename__ = "tasks"

    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    title: str = Field(max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)
    due_date: Optional[date] = Field(default=None)
    due_time: Optional[time] = Field(default=None)
    is_completed: bool = Field(default=False)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    user: Optional["User"] = Relationship(back_populates="tasks")
