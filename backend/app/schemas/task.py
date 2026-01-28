"""Task-related schemas for API requests and responses."""

from datetime import datetime, date, time
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class TaskCreate(BaseModel):
    """Schema for creating a new task."""

    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)
    due_date: Optional[date] = None
    due_time: Optional[time] = None


class TaskUpdate(BaseModel):
    """Schema for updating a task."""

    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)
    due_date: Optional[date] = None
    due_time: Optional[time] = None
    is_completed: Optional[bool] = None


class TaskResponse(BaseModel):
    """Schema for task response."""

    id: UUID
    title: str
    description: Optional[str]
    due_date: Optional[date]
    due_time: Optional[time]
    is_completed: bool
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
