"""Chat message database model."""

from datetime import datetime
from typing import Optional, TYPE_CHECKING, Literal
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from app.models.user import User


class ChatMessage(SQLModel, table=True):
    """Chat message model for storing conversation history."""

    __tablename__ = "chat_messages"

    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    role: str = Field(max_length=20)  # "user" or "assistant"
    content: str = Field(max_length=10000)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    user: Optional["User"] = Relationship()
