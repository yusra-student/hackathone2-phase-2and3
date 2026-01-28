"""Chat-related Pydantic schemas for request/response validation."""

from datetime import datetime
from typing import List, Literal
from uuid import UUID

from pydantic import BaseModel, Field


class ChatMessageCreate(BaseModel):
    """Schema for creating a new chat message."""
    content: str = Field(..., min_length=1, max_length=5000)


class ChatMessageResponse(BaseModel):
    """Schema for chat message response."""
    id: UUID
    role: Literal["user", "assistant"]
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class ChatRequest(BaseModel):
    """Schema for chat request."""
    message: str = Field(..., min_length=1, max_length=5000)


class ChatResponse(BaseModel):
    """Schema for chat response."""
    response: str
    history: List[ChatMessageResponse] = []
