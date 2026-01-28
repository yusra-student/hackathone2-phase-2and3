"""Chat router for AI chatbot endpoints."""

from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.database import get_session
from app.middleware.auth import get_current_user
from app.models.chat import ChatMessage
from app.schemas.chat import ChatRequest, ChatResponse, ChatMessageResponse
from app.services.ai_agent import AIAgent

router = APIRouter(prefix="/api/chat", tags=["Chat"])


@router.post("", response_model=ChatResponse)
async def send_message(
    request: ChatRequest,
    session: AsyncSession = Depends(get_session),
    user_id: UUID = Depends(get_current_user),
):
    """Send a message to the AI chatbot and get a response."""
    # Save user message
    user_message = ChatMessage(
        user_id=user_id,
        role="user",
        content=request.message,
    )
    session.add(user_message)
    await session.commit()
    await session.refresh(user_message)

    # Get chat history for context (last 10 messages)
    history_query = (
        select(ChatMessage)
        .where(ChatMessage.user_id == user_id)
        .order_by(ChatMessage.created_at.desc())
        .limit(10)
    )
    result = await session.execute(history_query)
    recent_messages = list(reversed(result.scalars().all()))

    # Convert to Gemini chat history format
    gemini_history = []
    for msg in recent_messages[:-1]:  # Exclude the current message
        gemini_history.append({
            "role": "user" if msg.role == "user" else "model",
            "parts": [{"text": msg.content}]
        })

    # Process with AI agent
    agent = AIAgent(session, user_id)
    ai_response = await agent.process_message(request.message, gemini_history)

    # Save assistant response
    assistant_message = ChatMessage(
        user_id=user_id,
        role="assistant",
        content=ai_response,
    )
    session.add(assistant_message)
    await session.commit()
    await session.refresh(assistant_message)

    # Get updated history
    history_query = (
        select(ChatMessage)
        .where(ChatMessage.user_id == user_id)
        .order_by(ChatMessage.created_at.desc())
        .limit(20)
    )
    result = await session.execute(history_query)
    history = list(reversed(result.scalars().all()))

    return ChatResponse(
        response=ai_response,
        history=[
            ChatMessageResponse(
                id=msg.id,
                role=msg.role,
                content=msg.content,
                created_at=msg.created_at,
            )
            for msg in history
        ],
    )


@router.get("/history", response_model=List[ChatMessageResponse])
async def get_chat_history(
    session: AsyncSession = Depends(get_session),
    user_id: UUID = Depends(get_current_user),
    limit: int = 50,
):
    """Get chat history for the current user."""
    query = (
        select(ChatMessage)
        .where(ChatMessage.user_id == user_id)
        .order_by(ChatMessage.created_at.desc())
        .limit(min(limit, 100))  # Cap at 100 messages
    )
    result = await session.execute(query)
    messages = list(reversed(result.scalars().all()))

    return [
        ChatMessageResponse(
            id=msg.id,
            role=msg.role,
            content=msg.content,
            created_at=msg.created_at,
        )
        for msg in messages
    ]


@router.delete("/history", status_code=status.HTTP_204_NO_CONTENT)
async def clear_chat_history(
    session: AsyncSession = Depends(get_session),
    user_id: UUID = Depends(get_current_user),
):
    """Clear all chat history for the current user."""
    query = select(ChatMessage).where(ChatMessage.user_id == user_id)
    result = await session.execute(query)
    messages = result.scalars().all()

    for message in messages:
        await session.delete(message)

    await session.commit()
