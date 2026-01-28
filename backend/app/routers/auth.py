"""Authentication API routes."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.database import get_session
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse
from app.services.auth import hash_password, verify_password, create_access_token
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    user_data: UserCreate,
    session: AsyncSession = Depends(get_session),
) -> TokenResponse:
    """Register a new user.

    Returns a JWT token on successful registration.
    """
    # Check if email already exists
    statement = select(User).where(User.email == user_data.email)
    result = await session.exec(statement)
    existing_user = result.first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists",
        )

    # Create new user
    user = User(
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)

    # Generate token
    access_token = create_access_token(user.id)

    return TokenResponse(access_token=access_token)


@router.post("/signin", response_model=TokenResponse)
async def signin(
    user_data: UserLogin,
    session: AsyncSession = Depends(get_session),
) -> TokenResponse:
    """Authenticate a user.

    Returns a JWT token on successful authentication.
    """
    # Find user by email
    statement = select(User).where(User.email == user_data.email)
    result = await session.exec(statement)
    user = result.first()

    # Verify credentials (generic error message for security)
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Generate token
    access_token = create_access_token(user.id)

    return TokenResponse(access_token=access_token)


@router.get("/me", response_model=UserResponse)
async def get_me(
    user_id: UUID = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> UserResponse:
    """Get the current authenticated user's information."""
    statement = select(User).where(User.id == user_id)
    result = await session.exec(statement)
    user = result.first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return UserResponse(
        id=user.id,
        email=user.email,
        created_at=user.created_at,
    )
