# Tasks: Full Stack Todo Application with AI Chatbot

**Input**: Design documents from `/specs/001-todo-app-ai-chatbot/`
**Prerequisites**: plan.md (required), spec.md (required)
**Branch**: `001-todo-app-ai-chatbot`
**Created**: 2026-01-26

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Paths use web app structure: `backend/`, `frontend/`

---

## Phase 1: Project Setup (Shared Infrastructure)

**Purpose**: Initialize both frontend and backend projects with proper structure

### Backend Setup

- [ ] T001 [P] Create `backend/` directory structure per plan.md
- [ ] T002 [P] Create `backend/requirements.txt` with dependencies: fastapi, uvicorn, sqlmodel, asyncpg, python-jose, passlib[bcrypt], python-dotenv, httpx, anthropic
- [ ] T003 Create `backend/app/__init__.py` (empty init file)
- [ ] T004 Create `backend/app/config.py` with environment variable loading (DATABASE_URL, JWT_SECRET_KEY, JWT_ALGORITHM, JWT_EXPIRATION_HOURS, AI_API_KEY, AI_MODEL)
- [ ] T005 Create `backend/app/main.py` with FastAPI app initialization, CORS middleware, and router includes
- [ ] T006 Create `backend/.env.example` with all required environment variables
- [ ] T007 Verify backend starts with `uvicorn app.main:app --reload`

### Frontend Setup

- [ ] T008 [P] Initialize Next.js 14 project in `frontend/` with TypeScript and App Router
- [ ] T009 [P] Configure TailwindCSS in `frontend/tailwind.config.ts`
- [ ] T010 [P] Initialize shadcn/ui and add required components (button, input, dialog, card, textarea)
- [ ] T011 Create `frontend/src/lib/utils.ts` with cn() utility function
- [ ] T012 Create `frontend/src/lib/api.ts` with base API client (fetch wrapper with auth header injection)
- [ ] T013 Create `frontend/.env.example` with NEXT_PUBLIC_API_URL
- [ ] T014 Create `frontend/src/app/globals.css` with Tailwind imports and custom styles (calm color palette)
- [ ] T015 Verify frontend starts with `npm run dev`

### Root Configuration

- [ ] T016 [P] Create root `.env.example` combining backend and frontend variables
- [ ] T017 [P] Create root `.gitignore` for Python, Node.js, and environment files
- [ ] T018 [P] Create root `README.md` with project overview and setup instructions

**Checkpoint**: Both services start without errors, project structure matches plan.md

---

## Phase 2: Database & Models (Foundational)

**Purpose**: Core infrastructure that MUST be complete before user story implementation

**CRITICAL**: No user story work can begin until this phase is complete

### Database Connection

- [ ] T019 Create `backend/app/database.py` with async SQLModel engine setup for Neon PostgreSQL
- [ ] T020 Add connection pooling configuration suitable for serverless PostgreSQL
- [ ] T021 Create `get_session` async dependency for database sessions

### User Model

- [ ] T022 Create `backend/app/models/__init__.py` with model exports
- [ ] T023 Create `backend/app/models/user.py` with User SQLModel:
  - id: UUID (primary key, default uuid4)
  - email: str (unique, indexed)
  - hashed_password: str
  - created_at: datetime (default utcnow)
  - updated_at: datetime (default utcnow, onupdate)

### Task Model

- [ ] T024 Create `backend/app/models/task.py` with Task SQLModel:
  - id: UUID (primary key, default uuid4)
  - title: str (required, max 200 chars)
  - description: Optional[str] (max 2000 chars)
  - due_date: Optional[date]
  - due_time: Optional[time]
  - is_completed: bool (default False)
  - user_id: UUID (foreign key to User.id)
  - created_at: datetime
  - updated_at: datetime

### Database Initialization

- [ ] T025 Add table creation function in `backend/app/database.py` using SQLModel.metadata.create_all
- [ ] T026 Add startup event in `backend/app/main.py` to create tables on first run
- [ ] T027 Test database connection and table creation with Neon PostgreSQL

**Checkpoint**: Database connected, User and Task tables created, foreign key relationship verified

---

## Phase 3: User Story 1-3 - Authentication (Priority: P1)

**Goal**: Enable user registration, login, and protected route access
**Maps to**: US-1 (Homepage), US-2 (Registration), US-3 (Authentication)

### Auth Schemas

- [ ] T028 Create `backend/app/schemas/__init__.py` with schema exports
- [ ] T029 Create `backend/app/schemas/user.py` with Pydantic schemas:
  - UserCreate (email: EmailStr, password: str with min 8 chars)
  - UserLogin (email: EmailStr, password: str)
  - UserResponse (id: UUID, email: str, created_at: datetime)
  - TokenResponse (access_token: str, token_type: str = "bearer")

### Auth Service

- [ ] T030 Create `backend/app/services/__init__.py` with service exports
- [ ] T031 Create `backend/app/services/auth.py` with:
  - hash_password(password: str) -> str using bcrypt
  - verify_password(plain: str, hashed: str) -> bool
  - create_access_token(user_id: UUID) -> str using python-jose
  - decode_access_token(token: str) -> UUID or None

### Auth Middleware

- [ ] T032 Create `backend/app/middleware/__init__.py`
- [ ] T033 Create `backend/app/middleware/auth.py` with:
  - get_current_user dependency (extracts JWT from Authorization header)
  - Validates token and returns user_id
  - Raises 401 HTTPException if invalid/missing

### Auth Router

- [ ] T034 Create `backend/app/routers/__init__.py` with router exports
- [ ] T035 Create `backend/app/routers/auth.py` with:
  - POST `/api/auth/signup` - Create user, return token
  - POST `/api/auth/signin` - Validate credentials, return token
  - GET `/api/auth/me` - Return current user (protected)

### Auth Implementation Details

- [ ] T036 [US2] Implement signup endpoint logic:
  - Validate email uniqueness (return 400 if exists)
  - Hash password with bcrypt
  - Create user in database
  - Generate and return JWT token
- [ ] T037 [US3] Implement signin endpoint logic:
  - Find user by email
  - Verify password
  - Return 401 with generic message if invalid
  - Generate and return JWT token
- [ ] T038 [US3] Implement /me endpoint logic:
  - Use get_current_user dependency
  - Return UserResponse

### Frontend Auth Types

- [ ] T039 [P] Create `frontend/src/types/user.ts` with User and AuthResponse types

### Frontend Auth Context

- [ ] T040 Create `frontend/src/components/auth/AuthProvider.tsx` with:
  - User state (null when logged out)
  - isAuthenticated computed property
  - login(token: string) function (stores in localStorage, fetches user)
  - logout() function (clears localStorage and state)
  - Auto-login on mount (check localStorage for token)
- [ ] T041 Wrap app in AuthProvider in `frontend/src/app/layout.tsx`

### Frontend Auth Hook

- [ ] T042 Create `frontend/src/hooks/useAuth.ts` exporting useAuth hook from context

### Frontend Auth API

- [ ] T043 Create `frontend/src/lib/auth.ts` with:
  - signup(email: string, password: string) -> Promise<AuthResponse>
  - signin(email: string, password: string) -> Promise<AuthResponse>
  - getCurrentUser() -> Promise<User>

### Frontend SignUp Modal

- [ ] T044 [US2] Create `frontend/src/components/auth/SignUpModal.tsx` with:
  - Email input with validation
  - Password input (min 8 chars)
  - Confirm password field
  - Submit button with loading state
  - Error message display
  - Success: call login(), close modal

### Frontend SignIn Modal

- [ ] T045 [US3] Create `frontend/src/components/auth/SignInModal.tsx` with:
  - Email input
  - Password input
  - Submit button with loading state
  - Error message display
  - Success: call login(), close modal

### Frontend Header with Auth

- [ ] T046 [US1] Create `frontend/src/components/layout/Header.tsx` with:
  - App logo/name
  - Sign In / Sign Up buttons (when unauthenticated)
  - User email display + Logout button (when authenticated)
  - Modal trigger state management

**Checkpoint**: User can sign up, sign in, and see authenticated state in UI. JWT works correctly.

---

## Phase 4: User Story 4-5 - Task Creation & Viewing (Priority: P1)

**Goal**: Enable users to create and view their tasks
**Maps to**: US-4 (Create Task), US-5 (View Tasks)

### Task Schemas

- [ ] T047 Create `backend/app/schemas/task.py` with:
  - TaskCreate (title: str, description?: str, due_date?: date, due_time?: time)
  - TaskUpdate (title?: str, description?: str, due_date?: date, due_time?: time, is_completed?: bool)
  - TaskResponse (id, title, description, due_date, due_time, is_completed, user_id, created_at, updated_at)

### Task Service

- [ ] T048 Create `backend/app/services/task.py` with:
  - create_task(session, user_id, data: TaskCreate) -> Task
  - get_tasks(session, user_id) -> List[Task]
  - get_task(session, task_id, user_id) -> Task or None
  - update_task(session, task_id, user_id, data: TaskUpdate) -> Task or None
  - delete_task(session, task_id, user_id) -> bool
  - toggle_complete(session, task_id, user_id) -> Task or None

### Task Router - Create & List

- [ ] T049 Create `backend/app/routers/tasks.py` with router setup and auth dependency
- [ ] T050 [US4] Implement POST `/api/tasks` endpoint:
  - Requires authentication
  - Validates TaskCreate schema
  - Creates task with user_id from token
  - Returns TaskResponse
- [ ] T051 [US5] Implement GET `/api/tasks` endpoint:
  - Requires authentication
  - Returns only tasks where user_id matches authenticated user
  - Returns List[TaskResponse]

### Frontend Task Types

- [ ] T052 [P] Create `frontend/src/types/task.ts` with Task, TaskCreate, TaskUpdate types

### Frontend Task API

- [ ] T053 Create `frontend/src/lib/tasks.ts` with:
  - createTask(data: TaskCreate) -> Promise<Task>
  - getTasks() -> Promise<Task[]>
  - getTask(id: string) -> Promise<Task>
  - updateTask(id: string, data: TaskUpdate) -> Promise<Task>
  - deleteTask(id: string) -> Promise<void>
  - toggleComplete(id: string) -> Promise<Task>

### Frontend Tasks Hook

- [ ] T054 Create `frontend/src/hooks/useTasks.ts` with:
  - tasks state array
  - loading state
  - error state
  - fetchTasks() function
  - createTask(), updateTask(), deleteTask(), toggleComplete() functions
  - Auto-fetch on mount (if authenticated)

### Frontend Add Task Modal

- [ ] T055 [US4] Create `frontend/src/components/tasks/AddTaskModal.tsx` with:
  - Title input (required)
  - Description textarea (optional)
  - Date picker for due_date (using shadcn calendar or native input)
  - Time picker for due_time
  - Submit and cancel buttons
  - Loading state during API call
  - Error display
  - Success: refresh task list, close modal

### Frontend Task Card

- [ ] T056 [US5] Create `frontend/src/components/tasks/TaskCard.tsx` with:
  - Display title, description (truncated), due date, time
  - Completion status indicator (checkbox style)
  - Visual distinction for completed tasks (strikethrough, muted colors)
  - Edit button
  - Delete button

### Frontend Task List

- [ ] T057 [US5] Create `frontend/src/components/tasks/TaskList.tsx` with:
  - List of TaskCard components
  - Loading state
  - Empty state message ("No tasks yet. Create your first task!")
  - Error state with retry option

### Frontend Task List Panel

- [ ] T058 [US5] Create `frontend/src/components/tasks/TaskListPanel.tsx` with:
  - Right-side sliding panel (similar to chatbot)
  - Header with "My Tasks" title and close button
  - TaskList component inside
  - Smooth slide animation

**Checkpoint**: User can create tasks and view their task list. Tasks are user-scoped.

---

## Phase 5: User Story 6-8 - Task Update, Complete, Delete (Priority: P2)

**Goal**: Enable users to modify and delete their tasks
**Maps to**: US-6 (Update), US-7 (Complete), US-8 (Delete)

### Task Router - CRUD Operations

- [ ] T059 [US6] Implement GET `/api/tasks/{id}` endpoint:
  - Requires authentication
  - Validates task ownership (return 403 if not owner, 404 if not found)
  - Returns TaskResponse
- [ ] T060 [US6] Implement PUT `/api/tasks/{id}` endpoint:
  - Requires authentication
  - Validates ownership
  - Updates task fields
  - Returns updated TaskResponse
- [ ] T061 [US7] Implement PATCH `/api/tasks/{id}/complete` endpoint:
  - Requires authentication
  - Validates ownership
  - Toggles is_completed
  - Returns updated TaskResponse
- [ ] T062 [US8] Implement DELETE `/api/tasks/{id}` endpoint:
  - Requires authentication
  - Validates ownership
  - Deletes task
  - Returns 204 No Content

### Frontend Update Task Modal

- [ ] T063 [US6] Create `frontend/src/components/tasks/UpdateTaskModal.tsx` with:
  - Pre-populated with existing task data
  - Same fields as AddTaskModal
  - Save and cancel buttons
  - Loading state
  - Error display
  - Success: refresh task list, close modal

### Frontend Delete Confirm Modal

- [ ] T064 [US8] Create `frontend/src/components/tasks/DeleteConfirmModal.tsx` with:
  - Warning message
  - Task title display
  - Confirm (red) and cancel buttons
  - Loading state during deletion
  - Success: refresh task list, close modal

### Frontend Task Card Actions

- [ ] T065 [US7] Add completion toggle handler to TaskCard:
  - Call toggleComplete from useTasks
  - Optimistic UI update
  - Revert on error
- [ ] T066 [US6] Add edit button handler to TaskCard:
  - Open UpdateTaskModal with task data
- [ ] T067 [US8] Add delete button handler to TaskCard:
  - Open DeleteConfirmModal

**Checkpoint**: User can update, complete, and delete tasks. Ownership is enforced.

---

## Phase 6: User Story 1 - Homepage & Action Buttons (Priority: P1)

**Goal**: Build the public homepage with 5 action buttons
**Maps to**: US-1 (Homepage Navigation)

### Homepage Components

- [ ] T068 [US1] Create `frontend/src/components/home/HeroSection.tsx` with:
  - App title and tagline
  - Brief description of features
  - Professional, minimal design

- [ ] T069 [US1] Create `frontend/src/components/home/ActionButtons.tsx` with:
  - 5 buttons in responsive grid:
    - Add Task (opens AddTaskModal if authenticated, else SignInModal)
    - View Tasks (opens TaskListPanel if authenticated, else SignInModal)
    - Update Task (opens TaskListPanel for selection if authenticated)
    - Complete Task (opens TaskListPanel for selection if authenticated)
    - Delete Task (opens TaskListPanel for selection if authenticated)
  - Clean button styling with icons
  - Hover/active states

### Homepage Layout

- [ ] T070 [US1] Update `frontend/src/app/page.tsx` with:
  - Header component
  - HeroSection
  - ActionButtons
  - Modal state management for all modals
  - TaskListPanel state

- [ ] T071 [US1] Create `frontend/src/app/layout.tsx` complete with:
  - AuthProvider wrapper
  - Metadata (title, description)
  - Font configuration
  - Global styles

### Action Button Mode Handling

- [ ] T072 [US6,7,8] Add selection mode to TaskListPanel:
  - mode: "view" | "select-update" | "select-complete" | "select-delete"
  - When mode is select-*, clicking a task triggers the appropriate action
  - Visual indication of selection mode

**Checkpoint**: Homepage displays correctly, all 5 buttons work, auth required for task actions

---

## Phase 7: Phase 2 Final Polish

**Purpose**: Ensure Phase 2 is complete before starting Phase 3

- [ ] T073 Add responsive breakpoints to all components (mobile/tablet/desktop)
- [ ] T074 Add loading spinners to all async operations
- [ ] T075 Add toast notifications for success/error states (optional, use shadcn toast)
- [ ] T076 Verify all error messages are user-friendly
- [ ] T077 Test cross-user access prevention (403 responses)
- [ ] T078 Create `backend/README.md` with API documentation
- [ ] T079 Create `frontend/README.md` with component documentation

**Phase 2 Checkpoint**:
- [ ] Homepage loads without authentication
- [ ] User can sign up with email/password
- [ ] User can sign in with credentials
- [ ] User can create tasks via Add Task button
- [ ] User can view tasks via View Tasks button
- [ ] User can update tasks via Update Task button
- [ ] User can complete tasks via Complete Task button
- [ ] User can delete tasks via Delete Task button
- [ ] Tasks persist in database
- [ ] User data isolation enforced
- [ ] UI is responsive and professional

---

## Phase 8: User Story 9 - Chatbot UI (Priority: P3)

**Goal**: Build the chatbot panel interface
**Maps to**: US-9 (Chatbot Panel)

### Chat Types

- [ ] T080 [P] Create `frontend/src/types/chat.ts` with:
  - ChatMessage { id, role: "user" | "assistant", content, created_at }
  - ChatRequest { message: string }
  - ChatResponse { response: string, history: ChatMessage[] }

### Chat Button

- [ ] T081 [US9] Create `frontend/src/components/chatbot/ChatButton.tsx` with:
  - Floating button (bottom-right corner)
  - Chat/message icon
  - Only visible when authenticated
  - Opens ChatPanel on click
  - Subtle animation on hover

### Chat Panel

- [ ] T082 [US9] Create `frontend/src/components/chatbot/ChatPanel.tsx` with:
  - Right-side sliding drawer
  - Width: 400px on desktop, full-screen on mobile
  - Header: "AI Assistant" title + close button
  - Scrollable message area
  - ChatInput at bottom
  - Smooth slide animation (transform, transition)

### Chat Message

- [ ] T083 [US9] Create `frontend/src/components/chatbot/ChatMessage.tsx` with:
  - User message: right-aligned, primary color background
  - Assistant message: left-aligned, neutral background
  - Rounded corners, soft shadows
  - Timestamp display (optional, small text)
  - Avatar/icon for assistant

### Chat Input

- [ ] T084 [US9] Create `frontend/src/components/chatbot/ChatInput.tsx` with:
  - Text input field
  - Send button (icon)
  - Disabled state during loading
  - Enter key to send (Shift+Enter for newline)
  - Clear input after send

### Typing Indicator

- [ ] T085 [US9] Create typing indicator component (dots animation or "AI is thinking...")

### Integrate Chat Button to Homepage

- [ ] T086 [US9] Add ChatButton and ChatPanel to homepage
- [ ] T087 [US9] Add panel open/close state management

**Checkpoint**: Chatbot UI opens/closes correctly, messages display properly (static for now)

---

## Phase 9: User Story 10-14 - Chat Backend & AI Agent (Priority: P3)

**Goal**: Implement chat API and AI agent with task tools
**Maps to**: US-10 (Add via Chat), US-11 (List via Chat), US-12 (Update via Chat), US-13 (Complete via Chat), US-14 (Delete via Chat)

### Chat Model

- [ ] T088 Create `backend/app/models/chat.py` with ChatMessage SQLModel:
  - id: UUID (primary key)
  - user_id: UUID (foreign key to User)
  - role: str ("user" or "assistant")
  - content: str
  - created_at: datetime

- [ ] T089 Update `backend/app/models/__init__.py` to export ChatMessage
- [ ] T090 Update database startup to create chat_messages table

### Chat Schemas

- [ ] T091 Create `backend/app/schemas/chat.py` with:
  - ChatMessageCreate (content: str)
  - ChatMessageResponse (id, role, content, created_at)
  - ChatRequest (message: str)
  - ChatResponse (response: str, history: List[ChatMessageResponse])

### Chat Router

- [ ] T092 Create `backend/app/routers/chat.py` with router setup
- [ ] T093 Implement GET `/api/chat/history` endpoint:
  - Requires authentication
  - Returns last 50 messages for user
  - Returns List[ChatMessageResponse]
- [ ] T094 Implement DELETE `/api/chat/history` endpoint:
  - Requires authentication
  - Deletes all messages for user
  - Returns 204 No Content

### AI Agent Service

- [ ] T095 Create `backend/app/services/ai_agent.py` with:
  - AIAgent class
  - System prompt configuration
  - Tool definitions

- [ ] T096 [US10] Define create_task tool:
  - Parameters: title (required), description, due_date, due_time
  - Calls task service create_task
  - Returns created task details

- [ ] T097 [US11] Define list_tasks tool:
  - Parameters: filter ("all" | "pending" | "completed")
  - Calls task service get_tasks
  - Filters based on is_completed
  - Returns formatted task list

- [ ] T098 [US12] Define update_task tool:
  - Parameters: task_id (required), title, description, due_date, due_time
  - Calls task service update_task
  - Returns updated task details or error

- [ ] T099 [US13] Define complete_task tool:
  - Parameters: task_id (required)
  - Calls task service toggle_complete
  - Returns updated task details

- [ ] T100 [US14] Define delete_task tool:
  - Parameters: task_id (required)
  - Calls task service delete_task
  - Returns confirmation

### AI Agent Implementation

- [ ] T101 Implement process_message method in AIAgent:
  - Send message to Claude/OpenAI API with tools
  - Handle tool calls in response
  - Execute tools and send results back
  - Return final assistant message

- [ ] T102 Add system prompt to AIAgent:
  ```
  You are a helpful task management assistant. Help users manage their todo list.

  Available actions: create tasks, list tasks, update tasks, complete tasks, delete tasks.

  Guidelines:
  - Be friendly and concise
  - Confirm every action you take
  - If unclear, ask for clarification
  - Never make up task data
  - Format task lists clearly
  - For delete, always confirm first
  ```

### Chat Endpoint Integration

- [ ] T103 Implement POST `/api/chat` endpoint:
  - Requires authentication
  - Save user message to database
  - Call AIAgent.process_message with user context
  - Save assistant response to database
  - Return ChatResponse with response and recent history

### Register Chat Router

- [ ] T104 Add chat router to main.py

**Checkpoint**: Chat API works, AI can call tools, messages persist

---

## Phase 10: User Story 10-14 - Frontend Chat Integration (Priority: P3)

**Goal**: Connect chat UI to backend
**Maps to**: US-10, US-11, US-12, US-13, US-14 (Chat task management)

### Chat API Client

- [ ] T105 Create `frontend/src/lib/chat.ts` with:
  - sendMessage(message: string) -> Promise<ChatResponse>
  - getHistory() -> Promise<ChatMessage[]>
  - clearHistory() -> Promise<void>

### Chat Hook

- [ ] T106 Create `frontend/src/hooks/useChat.ts` with:
  - messages state array
  - loading state
  - error state
  - sendMessage(content: string) function
  - fetchHistory() function
  - clearHistory() function
  - Auto-fetch history on mount

### Connect Chat Components

- [ ] T107 [US10-14] Update ChatPanel to use useChat hook
- [ ] T108 [US10-14] Update ChatInput to call sendMessage
- [ ] T109 [US10-14] Update ChatMessage list to display messages from hook
- [ ] T110 [US10-14] Add loading indicator while waiting for AI response
- [ ] T111 [US10-14] Add error handling and display in chat

### Task List Refresh After Chat Actions

- [ ] T112 Add callback to useChat for task refresh:
  - After successful AI response, refresh task list
  - Pass refreshTasks function from useTasks

### Auto-scroll Chat

- [ ] T113 Add auto-scroll to bottom when new messages arrive

**Checkpoint**: Chat fully functional, AI can manage tasks via natural language

---

## Phase 11: Final Testing & Verification

**Purpose**: Complete testing of all features

### Phase 2 Verification

- [ ] T114 Test: Homepage loads without authentication
- [ ] T115 Test: Sign up creates new user, returns token
- [ ] T116 Test: Sign up with existing email returns error
- [ ] T117 Test: Sign in with valid credentials succeeds
- [ ] T118 Test: Sign in with invalid credentials returns 401
- [ ] T119 Test: Create task with valid data succeeds
- [ ] T120 Test: Create task without title fails validation
- [ ] T121 Test: List tasks returns only user's tasks
- [ ] T122 Test: Update task with valid data succeeds
- [ ] T123 Test: Update another user's task returns 403
- [ ] T124 Test: Complete task toggles is_completed
- [ ] T125 Test: Delete task removes from database
- [ ] T126 Test: Delete another user's task returns 403

### Phase 3 Verification

- [ ] T127 Test: Chatbot panel opens/closes correctly
- [ ] T128 Test: "Add a task called X" creates task
- [ ] T129 Test: "Show my tasks" lists all tasks
- [ ] T130 Test: "Show pending tasks" lists incomplete tasks
- [ ] T131 Test: "Update task X title to Y" updates task
- [ ] T132 Test: "Mark X as done" completes task
- [ ] T133 Test: "Delete X" removes task (after confirmation)
- [ ] T134 Test: AI confirms all actions in response
- [ ] T135 Test: Chat history persists across sessions

### Security Verification

- [ ] T136 Test: Unauthenticated API calls return 401
- [ ] T137 Test: Cross-user task access returns 403
- [ ] T138 Test: Chat API requires authentication
- [ ] T139 Test: AI cannot access other users' tasks

### UI/UX Verification

- [ ] T140 Test: Responsive on mobile (320px - 480px)
- [ ] T141 Test: Responsive on tablet (768px - 1024px)
- [ ] T142 Test: Responsive on desktop (1024px+)
- [ ] T143 Test: All animations smooth (60fps)
- [ ] T144 Test: Error messages clear and actionable
- [ ] T145 Test: Loading states visible during operations

**Final Checkpoint**: All tests pass, application ready for demonstration

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) → Phase 2 (Database) → Phase 3 (Auth) → Phase 4 (Tasks CRUD)
                                                      ↓
                                    Phase 5 (Update/Delete) → Phase 6 (Homepage)
                                                             ↓
                                                    Phase 7 (Polish) → PHASE 2 COMPLETE
                                                             ↓
                                    Phase 8 (Chat UI) → Phase 9 (Chat Backend)
                                                       ↓
                                              Phase 10 (Chat Integration)
                                                       ↓
                                              Phase 11 (Verification)
```

### Task Dependencies Within Phases

- **T001-T018**: All [P] tasks can run in parallel within their subsection
- **T019-T027**: Sequential (database before models before init)
- **T028-T046**: Auth schemas → service → middleware → router → frontend
- **T047-T058**: Task schemas → service → router → frontend
- **T059-T067**: Backend CRUD → Frontend modals
- **T068-T072**: Homepage components (can parallel), then integration
- **T080-T087**: Chat UI components (can parallel)
- **T088-T104**: Chat backend sequential
- **T105-T113**: Chat frontend sequential
- **T114-T145**: All verification tests can run in parallel

### Parallel Opportunities

```bash
# Phase 1 - Run in parallel:
T001, T002 (backend structure)
T008, T009, T010 (frontend init)
T016, T017, T018 (root files)

# Phase 3 - Models in parallel:
T039 (frontend types) | T028-T038 (backend auth)

# Phase 4 - Types in parallel:
T052 (frontend types) | T047-T051 (backend tasks)

# Phase 8 - Chat UI in parallel:
T081, T082, T083, T084, T085 (all components)
```

---

## Implementation Strategy

### MVP First (Phase 2 Only)

1. Complete Phases 1-7
2. **STOP and VALIDATE**: Test all Phase 2 features
3. Deploy/demo if deadline approaching

### Full Implementation

1. Complete Phases 1-7 (Phase 2)
2. Validate Phase 2 checkpoint
3. Complete Phases 8-10 (Phase 3)
4. Complete Phase 11 (Verification)
5. Demo complete application

---

## Notes

- **[P]** tasks can run in parallel (different files, no dependencies)
- **[US#]** label maps task to specific user story
- Commit after each task or logical group
- Test locally before proceeding to next phase
- Phase 2 must be stable before starting Phase 3
- AI API key required for Phase 3 (Claude or OpenAI)
