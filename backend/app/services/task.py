"""Task service for business logic."""

from datetime import datetime
from typing import Optional
from uuid import UUID

from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate


async def create_task(
    session: AsyncSession,
    user_id: UUID,
    data: TaskCreate,
) -> Task:
    """Create a new task for a user."""
    task = Task(
        title=data.title,
        description=data.description,
        due_date=data.due_date,
        due_time=data.due_time,
        user_id=user_id,
    )
    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task


async def get_tasks(
    session: AsyncSession,
    user_id: UUID,
) -> list[Task]:
    """Get all tasks for a user."""
    statement = select(Task).where(Task.user_id == user_id).order_by(Task.created_at.desc())
    result = await session.exec(statement)
    return list(result.all())


async def get_task(
    session: AsyncSession,
    task_id: UUID,
    user_id: UUID,
) -> Optional[Task]:
    """Get a single task by ID, only if owned by user."""
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = await session.exec(statement)
    return result.first()


async def update_task(
    session: AsyncSession,
    task_id: UUID,
    user_id: UUID,
    data: TaskUpdate,
) -> Optional[Task]:
    """Update a task, only if owned by user."""
    task = await get_task(session, task_id, user_id)
    if not task:
        return None

    # Update only provided fields
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)

    task.updated_at = datetime.utcnow()
    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task


async def delete_task(
    session: AsyncSession,
    task_id: UUID,
    user_id: UUID,
) -> bool:
    """Delete a task, only if owned by user."""
    task = await get_task(session, task_id, user_id)
    if not task:
        return False

    await session.delete(task)
    await session.commit()
    return True


async def toggle_complete(
    session: AsyncSession,
    task_id: UUID,
    user_id: UUID,
) -> Optional[Task]:
    """Toggle a task's completion status."""
    task = await get_task(session, task_id, user_id)
    if not task:
        return None

    task.is_completed = not task.is_completed
    task.updated_at = datetime.utcnow()
    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task
