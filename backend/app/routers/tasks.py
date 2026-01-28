"""Task management API routes."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession

from app.database import get_session
from app.middleware.auth import get_current_user
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.services import task as task_service

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    user_id: UUID = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> TaskResponse:
    """Create a new task."""
    task = await task_service.create_task(session, user_id, task_data)
    return TaskResponse.model_validate(task)


@router.get("", response_model=list[TaskResponse])
async def list_tasks(
    user_id: UUID = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> list[TaskResponse]:
    """Get all tasks for the authenticated user."""
    tasks = await task_service.get_tasks(session, user_id)
    return [TaskResponse.model_validate(task) for task in tasks]


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: UUID,
    user_id: UUID = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> TaskResponse:
    """Get a single task by ID."""
    task = await task_service.get_task(session, task_id, user_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    return TaskResponse.model_validate(task)


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: UUID,
    task_data: TaskUpdate,
    user_id: UUID = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> TaskResponse:
    """Update a task."""
    task = await task_service.update_task(session, task_id, user_id, task_data)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    return TaskResponse.model_validate(task)


@router.patch("/{task_id}/complete", response_model=TaskResponse)
async def toggle_task_complete(
    task_id: UUID,
    user_id: UUID = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> TaskResponse:
    """Toggle a task's completion status."""
    task = await task_service.toggle_complete(session, task_id, user_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    return TaskResponse.model_validate(task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: UUID,
    user_id: UUID = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> None:
    """Delete a task."""
    deleted = await task_service.delete_task(session, task_id, user_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
