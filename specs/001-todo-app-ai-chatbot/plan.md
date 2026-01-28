# Implementation Plan: Full Stack Todo Application with AI Chatbot

**Branch**: `001-todo-app-ai-chatbot` | **Date**: 2026-01-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-todo-app-ai-chatbot/spec.md`

## Summary

Build a production-ready Todo web application (Phase 2) with user authentication, task CRUD operations, and a professional UI, then extend it with an AI-powered chatbot assistant (Phase 3) for natural language task management. The application follows a strict separation of concerns with FastAPI backend, Next.js frontend, PostgreSQL database, and AI agent integration.

## Technical Context

**Language/Version**: Python 3.11+ (backend), TypeScript 5.x (frontend)
**Primary Dependencies**:
- Backend: FastAPI, SQLModel, python-jose (JWT), passlib, httpx
- Frontend: Next.js 14, React 18, TailwindCSS, shadcn/ui
- AI: Anthropic Claude API (or OpenAI-compatible)
**Storage**: PostgreSQL (Neon serverless)
**Testing**: pytest (backend), Vitest (frontend)
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
**Project Type**: Web application (frontend + backend)
**Performance Goals**:
- Task list loads < 2 seconds
- Chatbot response < 5 seconds
- Signup/signin < 60 seconds
**Constraints**:
- Stateless backend (JWT-based auth)
- User data isolation enforced at all layers
- No hardcoded secrets
**Scale/Scope**: Single-user focus per session, designed for hackathon evaluation

## Constitution Check

*GATE: Must pass before implementation. All items verified against constitution.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec-Driven Development | PASS | Plan follows spec → plan → tasks → implement loop |
| II. Separation of Concerns | PASS | Clear frontend/backend/AI/database boundaries |
| III. Security-First | PASS | JWT auth, user-scoped APIs, input validation planned |
| IV. Production-Grade Quality | PASS | Professional UI, clean code structure, error handling |
| V. Phase Extension | PASS | Phase 3 extends Phase 2, no breaking changes |
| VI. Stateless Services | PASS | JWT tokens, database as single source of truth |

## Project Structure

### Documentation (this feature)

```text
specs/001-todo-app-ai-chatbot/
├── spec.md              # Feature specification
├── plan.md              # This file (implementation plan)
├── tasks.md             # Task breakdown (created by /sp.tasks)
└── checklists/
    └── requirements.md  # Specification quality checklist
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry
│   ├── config.py            # Environment configuration
│   ├── database.py          # Database connection
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py          # User SQLModel
│   │   └── task.py          # Task SQLModel
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py          # User Pydantic schemas
│   │   ├── task.py          # Task Pydantic schemas
│   │   └── chat.py          # Chat message schemas
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py          # Authentication endpoints
│   │   ├── tasks.py         # Task CRUD endpoints
│   │   └── chat.py          # Chat/AI endpoints
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth.py          # Authentication logic
│   │   ├── task.py          # Task business logic
│   │   └── ai_agent.py      # AI agent with tools
│   └── middleware/
│       ├── __init__.py
│       └── auth.py          # JWT authentication middleware
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # Test fixtures
│   ├── test_auth.py         # Auth endpoint tests
│   ├── test_tasks.py        # Task endpoint tests
│   └── test_chat.py         # Chat endpoint tests
├── requirements.txt
├── .env.example
└── README.md

frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Homepage
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── layout/
│   │   │   ├── Header.tsx   # App header
│   │   │   └── Footer.tsx   # App footer
│   │   ├── auth/
│   │   │   ├── SignInModal.tsx
│   │   │   ├── SignUpModal.tsx
│   │   │   └── AuthProvider.tsx
│   │   ├── tasks/
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── AddTaskModal.tsx
│   │   │   ├── UpdateTaskModal.tsx
│   │   │   └── DeleteConfirmModal.tsx
│   │   ├── chatbot/
│   │   │   ├── ChatPanel.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   └── ChatButton.tsx
│   │   └── home/
│   │       ├── ActionButtons.tsx
│   │       └── HeroSection.tsx
│   ├── lib/
│   │   ├── api.ts           # API client
│   │   ├── auth.ts          # Auth utilities
│   │   └── utils.ts         # General utilities
│   ├── hooks/
│   │   ├── useAuth.ts       # Authentication hook
│   │   ├── useTasks.ts      # Tasks data hook
│   │   └── useChat.ts       # Chat functionality hook
│   └── types/
│       ├── user.ts          # User types
│       ├── task.ts          # Task types
│       └── chat.ts          # Chat types
├── public/
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
├── .env.example
└── README.md

# Root level
├── .env.example             # Combined environment template
├── .gitignore
└── README.md                # Project documentation
```

**Structure Decision**: Web application structure with separate `backend/` and `frontend/` directories. This enables independent development, testing, and deployment while maintaining clear boundaries per the constitution's separation of concerns principle.

## Complexity Tracking

No constitution violations requiring justification. The architecture follows the simplest viable approach:
- Single backend service (no microservices)
- Single frontend application (no micro-frontends)
- Direct database access (no ORM abstraction layer beyond SQLModel)
- Simple JWT auth (no OAuth complexity)

---

## Phase 2: Core Todo Application

### Step 1: Project Setup & Structure

**Objective**: Establish the project foundation with proper folder structure, configuration, and tooling.

**Deliverables**:
1. Create `backend/` directory with FastAPI project structure
2. Create `frontend/` directory with Next.js 14 App Router
3. Configure environment variables (.env files)
4. Set up Tailwind CSS and shadcn/ui
5. Create README with setup instructions

**Technical Details**:
- Backend: Python 3.11+, FastAPI with uvicorn
- Frontend: Next.js 14 with TypeScript, App Router
- Styling: TailwindCSS with shadcn/ui components
- Environment: dotenv for secrets management

**Acceptance Criteria**:
- [ ] Backend starts with `uvicorn app.main:app --reload`
- [ ] Frontend starts with `npm run dev`
- [ ] Environment variables loaded from .env files
- [ ] Both services run without errors

---

### Step 2: Database & Models

**Objective**: Define data models and establish database connectivity.

**Deliverables**:
1. User model (SQLModel)
   - id: UUID (primary key)
   - email: str (unique, indexed)
   - hashed_password: str
   - created_at: datetime
   - updated_at: datetime

2. Task model (SQLModel)
   - id: UUID (primary key)
   - title: str (required)
   - description: str (optional)
   - due_date: date (optional)
   - due_time: time (optional)
   - is_completed: bool (default: False)
   - user_id: UUID (foreign key to User)
   - created_at: datetime
   - updated_at: datetime

3. Database connection setup for Neon PostgreSQL
4. Migration/table creation script

**Technical Details**:
- SQLModel for ORM (combines SQLAlchemy + Pydantic)
- Async database sessions with `asyncpg`
- Connection pooling for serverless PostgreSQL
- UUID primary keys for security

**Acceptance Criteria**:
- [ ] Models define all required fields from spec
- [ ] Database connection established
- [ ] Tables created successfully
- [ ] Foreign key constraint enforces user-task relationship

---

### Step 3: Authentication System

**Objective**: Implement secure user registration and login.

**Deliverables**:
1. Auth schemas (Pydantic)
   - UserCreate (email, password)
   - UserLogin (email, password)
   - TokenResponse (access_token, token_type)
   - UserResponse (id, email, created_at)

2. Auth service
   - Password hashing with bcrypt
   - JWT token generation/validation
   - User creation with duplicate check
   - Login validation

3. Auth router endpoints
   - POST `/api/auth/signup` - Create new user
   - POST `/api/auth/signin` - Login user
   - GET `/api/auth/me` - Get current user (protected)

4. Auth middleware
   - JWT token extraction from Authorization header
   - Token validation and user lookup
   - Dependency injection for protected routes

**Technical Details**:
- JWT with HS256 algorithm
- Token expiration: 24 hours (configurable)
- Password hashing: bcrypt with salt
- HTTP-only considerations for frontend

**Security Considerations**:
- Never return password in responses
- Generic error messages (no "email exists" vs "wrong password")
- Rate limiting consideration (future enhancement)

**Acceptance Criteria**:
- [ ] User can register with email/password
- [ ] Duplicate email returns 400 error
- [ ] User can login with valid credentials
- [ ] Invalid credentials return 401 error
- [ ] Protected routes require valid JWT
- [ ] JWT contains user_id claim

---

### Step 4: Task CRUD API

**Objective**: Implement task management endpoints with user isolation.

**Deliverables**:
1. Task schemas (Pydantic)
   - TaskCreate (title, description?, due_date?, due_time?)
   - TaskUpdate (title?, description?, due_date?, due_time?, is_completed?)
   - TaskResponse (all fields including id, timestamps)

2. Task service
   - Create task (associates with authenticated user)
   - List tasks (filtered by user_id)
   - Get single task (with ownership validation)
   - Update task (with ownership validation)
   - Delete task (with ownership validation)

3. Task router endpoints
   - POST `/api/tasks` - Create task
   - GET `/api/tasks` - List user's tasks
   - GET `/api/tasks/{id}` - Get single task
   - PUT `/api/tasks/{id}` - Update task
   - PATCH `/api/tasks/{id}/complete` - Toggle completion
   - DELETE `/api/tasks/{id}` - Delete task

**Security Enforcement**:
- All endpoints require authentication
- All queries filter by authenticated user's ID
- Ownership validated before update/delete
- 403 Forbidden for cross-user access attempts

**Acceptance Criteria**:
- [ ] Authenticated user can create tasks
- [ ] Tasks are associated with creating user
- [ ] User can only see their own tasks
- [ ] User can update their own tasks
- [ ] User cannot access other users' tasks (403)
- [ ] Task deletion requires ownership
- [ ] Completion toggle works correctly

---

### Step 5: Frontend - Homepage & Layout

**Objective**: Build the public homepage with navigation and action buttons.

**Deliverables**:
1. Root layout with header
   - App logo/name
   - Sign In / Sign Up buttons (when unauthenticated)
   - User menu / Logout (when authenticated)

2. Homepage (public)
   - Hero section with app description
   - 5 action buttons in clean grid:
     - Add Task
     - View Tasks
     - Update Task
     - Complete Task
     - Delete Task
   - Chatbot trigger button (Phase 3, placeholder)

3. Global styles
   - Calm color palette (blues, grays, white)
   - Consistent spacing scale
   - Typography hierarchy
   - Smooth transitions

**UI/UX Requirements**:
- Mobile-first responsive design
- Buttons are clearly labeled
- Visual feedback on hover/click
- Professional, minimal aesthetic (Notion/Slack quality)

**Acceptance Criteria**:
- [ ] Homepage loads without authentication
- [ ] 5 action buttons visible and styled
- [ ] Auth buttons in header
- [ ] Responsive on mobile/tablet/desktop
- [ ] Clean, professional appearance

---

### Step 6: Frontend - Authentication UI

**Objective**: Implement sign-in and sign-up modals with form handling.

**Deliverables**:
1. AuthProvider context
   - User state management
   - Login/logout functions
   - Token storage (localStorage)
   - Auto-login on page load

2. SignUpModal component
   - Email input with validation
   - Password input with requirements
   - Confirm password field
   - Error display
   - Loading state
   - Success redirect to homepage

3. SignInModal component
   - Email input
   - Password input
   - Error display
   - Loading state
   - Success redirect to homepage

4. Protected route handling
   - Redirect to sign-in when accessing protected features
   - Preserve intended action after login

**Technical Details**:
- React Context for auth state
- Form validation with clear error messages
- JWT stored in localStorage
- API client with auth header injection

**Acceptance Criteria**:
- [ ] Sign Up modal opens from header button
- [ ] Sign In modal opens from header button
- [ ] Form validation prevents invalid submissions
- [ ] Successful signup logs user in automatically
- [ ] Successful signin updates UI to authenticated state
- [ ] Error messages display clearly
- [ ] Modals close after successful auth

---

### Step 7: Frontend - Task Management UI

**Objective**: Build task list, creation, editing, and deletion interfaces.

**Deliverables**:
1. TaskList component
   - Displays all user's tasks
   - Task cards with title, description, due date, time
   - Completion status indicator (checkbox/toggle)
   - Empty state message

2. TaskCard component
   - Task information display
   - Completion toggle button
   - Edit button
   - Delete button
   - Visual distinction for completed tasks

3. AddTaskModal component
   - Title input (required)
   - Description textarea (optional)
   - Date picker for due date
   - Time picker for due time
   - Submit and cancel buttons
   - Validation and error handling

4. UpdateTaskModal component
   - Pre-populated with existing task data
   - Same fields as AddTaskModal
   - Save and cancel buttons

5. DeleteConfirmModal component
   - Confirmation message
   - Task title display
   - Confirm and cancel buttons

6. Action button handlers
   - Add Task → Opens AddTaskModal
   - View Tasks → Opens TaskList panel
   - Update Task → Opens TaskList for selection, then UpdateTaskModal
   - Complete Task → Opens TaskList for selection, toggles completion
   - Delete Task → Opens TaskList for selection, then DeleteConfirmModal

**UI/UX Requirements**:
- Panels slide in from right (consistent with chatbot)
- Smooth animations for open/close
- Clear visual hierarchy
- Accessible form controls

**Acceptance Criteria**:
- [ ] Add Task creates new task via API
- [ ] View Tasks shows only user's tasks
- [ ] Update Task modifies existing task
- [ ] Complete Task toggles completion status
- [ ] Delete Task removes task after confirmation
- [ ] All modals have loading and error states
- [ ] Empty state displayed when no tasks

---

### Phase 2 Checkpoint

Before proceeding to Phase 3, verify:
- [ ] User can sign up and sign in
- [ ] User can create tasks
- [ ] User can view their tasks
- [ ] User can update their tasks
- [ ] User can mark tasks complete
- [ ] User can delete tasks
- [ ] No cross-user data access possible
- [ ] UI is responsive and professional
- [ ] All errors display user-friendly messages

---

## Phase 3: AI Chatbot Integration

### Step 8: Chatbot UI Components

**Objective**: Build the chatbot panel interface.

**Deliverables**:
1. ChatButton component
   - Floating button on homepage
   - Chat icon
   - Opens chat panel on click
   - Badge for unread messages (optional)

2. ChatPanel component
   - Right-side sliding drawer (desktop: 400px width)
   - Full-screen on mobile
   - Header with title and close button
   - Message display area (scrollable)
   - Input area at bottom

3. ChatMessage component
   - User message style (right-aligned, colored)
   - Assistant message style (left-aligned, neutral)
   - Timestamp display
   - Loading indicator for pending responses

4. ChatInput component
   - Text input field
   - Send button
   - Disabled during loading
   - Enter key to send

**UI/UX Requirements**:
- Panel slides in smoothly from right
- Main UI remains visible (desktop)
- Messages auto-scroll to bottom
- Typing indicator during AI processing
- Professional, SaaS-style appearance

**Acceptance Criteria**:
- [ ] Chat button visible on homepage (when authenticated)
- [ ] Panel slides open/closed smoothly
- [ ] Messages display correctly (user vs assistant)
- [ ] Input submits on Enter or button click
- [ ] Loading indicator shows during processing
- [ ] Panel responsive (side drawer on desktop, full-screen on mobile)

---

### Step 9: Chat Backend Endpoint

**Objective**: Create the chat API endpoint with conversation history.

**Deliverables**:
1. ChatMessage model (SQLModel)
   - id: UUID
   - user_id: UUID (foreign key)
   - role: str ("user" or "assistant")
   - content: str
   - created_at: datetime

2. Chat schemas
   - ChatMessageCreate (content)
   - ChatMessageResponse (id, role, content, created_at)
   - ChatRequest (message)
   - ChatResponse (response, history)

3. Chat router endpoints
   - POST `/api/chat` - Send message, get AI response
   - GET `/api/chat/history` - Get conversation history
   - DELETE `/api/chat/history` - Clear conversation history

**Technical Details**:
- Store all messages in database
- Load recent history for context (last 20 messages)
- User isolation enforced

**Acceptance Criteria**:
- [ ] User can send chat messages
- [ ] Messages stored in database
- [ ] Conversation history retrievable
- [ ] History filtered by authenticated user
- [ ] History can be cleared

---

### Step 10: AI Agent with Tools

**Objective**: Implement AI agent that manages tasks through defined tools.

**Deliverables**:
1. AI Agent service
   - Claude/OpenAI API integration
   - System prompt defining assistant behavior
   - Tool definitions for task operations
   - Response generation with tool calls

2. Tool definitions
   - `create_task(title, description?, due_date?, due_time?)`
   - `list_tasks(filter?: "all" | "pending" | "completed")`
   - `update_task(task_id, title?, description?, due_date?, due_time?)`
   - `complete_task(task_id)`
   - `delete_task(task_id)`

3. Tool execution
   - Parse tool calls from AI response
   - Execute corresponding task service methods
   - Return results to AI for response generation
   - Handle errors gracefully

4. System prompt
   ```
   You are a helpful task management assistant. You help users manage their todo list through natural conversation.

   Available actions:
   - Create tasks with optional due dates and times
   - List all tasks, or filter by pending/completed
   - Update task details
   - Mark tasks as complete
   - Delete tasks (always confirm first)

   Guidelines:
   - Be friendly and concise
   - Confirm every action you take
   - If a request is unclear, ask for clarification
   - Never make up task data - only use what's in the database
   - When listing tasks, format them clearly
   ```

**Security Enforcement**:
- All tool calls use authenticated user's context
- No cross-user data access possible
- Tool results validated before AI response

**Acceptance Criteria**:
- [ ] AI can create tasks via natural language
- [ ] AI can list tasks with filters
- [ ] AI can update task details
- [ ] AI can mark tasks complete
- [ ] AI can delete tasks (with confirmation)
- [ ] AI confirms all actions taken
- [ ] AI asks for clarification when needed
- [ ] All operations respect user isolation

---

### Step 11: Frontend Chat Integration

**Objective**: Connect chat UI to backend and handle responses.

**Deliverables**:
1. useChat hook
   - Message history state
   - Send message function
   - Loading state
   - Error handling
   - Auto-refresh task list after AI actions

2. Chat API integration
   - POST to /api/chat with message
   - Handle response and update history
   - Display loading indicator
   - Handle errors gracefully

3. Task list refresh
   - After AI creates/updates/deletes task
   - Notify user of changes
   - Keep UI in sync

**Acceptance Criteria**:
- [ ] User messages sent to backend
- [ ] AI responses displayed in chat
- [ ] Loading indicator during processing
- [ ] Errors displayed in chat
- [ ] Task list refreshes after AI actions
- [ ] Conversation history persists across sessions

---

### Step 12: Testing & Verification

**Objective**: Ensure all features work correctly and securely.

**Verification Checklist**:

**Phase 2 Features**:
- [ ] Homepage loads without authentication
- [ ] Sign up creates new user
- [ ] Sign in authenticates user
- [ ] Duplicate email rejected
- [ ] Invalid credentials rejected
- [ ] Create task works
- [ ] View tasks shows only user's tasks
- [ ] Update task works
- [ ] Complete task toggles status
- [ ] Delete task removes task
- [ ] Cross-user access blocked (403)

**Phase 3 Features**:
- [ ] Chatbot opens as side panel
- [ ] Chatbot closes properly
- [ ] "Add task X" creates task
- [ ] "Show my tasks" lists tasks
- [ ] "Update task X" modifies task
- [ ] "Mark X as done" completes task
- [ ] "Delete X" removes task (with confirmation)
- [ ] AI confirms all actions
- [ ] AI asks for clarification when ambiguous
- [ ] Chat history persists

**Security**:
- [ ] Unauthenticated API calls return 401
- [ ] Cross-user task access returns 403
- [ ] Chat restricted to authenticated users
- [ ] AI cannot access other users' data

**UI/UX**:
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Responsive on desktop
- [ ] Professional appearance
- [ ] Smooth animations
- [ ] Clear error messages

---

## API Contract Summary

### Authentication

```
POST /api/auth/signup
Request: { "email": "user@example.com", "password": "securepassword" }
Response: { "access_token": "jwt...", "token_type": "bearer" }
Errors: 400 (validation), 409 (email exists)

POST /api/auth/signin
Request: { "email": "user@example.com", "password": "securepassword" }
Response: { "access_token": "jwt...", "token_type": "bearer" }
Errors: 401 (invalid credentials)

GET /api/auth/me
Headers: Authorization: Bearer <token>
Response: { "id": "uuid", "email": "user@example.com", "created_at": "..." }
Errors: 401 (not authenticated)
```

### Tasks

```
POST /api/tasks
Headers: Authorization: Bearer <token>
Request: { "title": "Buy groceries", "description": "...", "due_date": "2026-01-27", "due_time": "17:00" }
Response: { "id": "uuid", "title": "...", "is_completed": false, ... }
Errors: 400 (validation), 401 (not authenticated)

GET /api/tasks
Headers: Authorization: Bearer <token>
Response: [{ "id": "uuid", "title": "...", ... }, ...]
Errors: 401 (not authenticated)

GET /api/tasks/{id}
Headers: Authorization: Bearer <token>
Response: { "id": "uuid", "title": "...", ... }
Errors: 401, 403 (not owner), 404 (not found)

PUT /api/tasks/{id}
Headers: Authorization: Bearer <token>
Request: { "title": "Updated title", ... }
Response: { "id": "uuid", "title": "Updated title", ... }
Errors: 400, 401, 403, 404

PATCH /api/tasks/{id}/complete
Headers: Authorization: Bearer <token>
Response: { "id": "uuid", "is_completed": true, ... }
Errors: 401, 403, 404

DELETE /api/tasks/{id}
Headers: Authorization: Bearer <token>
Response: 204 No Content
Errors: 401, 403, 404
```

### Chat

```
POST /api/chat
Headers: Authorization: Bearer <token>
Request: { "message": "Add a task to buy groceries tomorrow" }
Response: { "response": "Done! I've added...", "history": [...] }
Errors: 401, 500 (AI service error)

GET /api/chat/history
Headers: Authorization: Bearer <token>
Response: [{ "id": "uuid", "role": "user", "content": "...", "created_at": "..." }, ...]
Errors: 401

DELETE /api/chat/history
Headers: Authorization: Bearer <token>
Response: 204 No Content
Errors: 401
```

---

## Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| AI service unavailable | Medium | Medium | Graceful fallback message, core UI unaffected |
| Database connection issues | Low | High | Connection retry logic, clear error messages |
| JWT token expiration mid-session | Medium | Low | Auto-refresh token, prompt re-login |
| Ambiguous chatbot requests | High | Low | AI asks for clarification, never guesses destructively |
| Large chat history | Low | Low | Limit context to last 20 messages |

---

## Environment Variables

```env
# Backend (.env)
DATABASE_URL=postgresql+asyncpg://user:pass@host/db
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
AI_API_KEY=your-anthropic-or-openai-key
AI_MODEL=claude-3-sonnet-20240229

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Next Steps

After plan approval, run `/sp.tasks` to generate the detailed task breakdown for implementation.
