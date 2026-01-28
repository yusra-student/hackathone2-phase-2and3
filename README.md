# Todo App with AI Chatbot

A production-ready Todo web application with a modern UI and an AI-powered chatbot assistant for natural language task management.

## Features

### Phase 2: Core Todo Application
- User authentication (signup/signin)
- Task management (create, view, update, complete, delete)
- Professional, responsive UI
- User data isolation

### Phase 3: AI Chatbot
- Natural language task management
- Right-side sliding panel interface
- Task creation, listing, updating, and deletion via conversation
- Action confirmations in friendly language

## Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL (Neon serverless)
- **ORM**: SQLModel
- **Authentication**: JWT (python-jose)
- **AI**: Google Gemini API

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **State**: React Context

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL database (or Neon account)
- Google Gemini API key (for chatbot)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create `.env` file from example:
   ```bash
   cp .env.example .env
   ```

5. Update `.env` with your configuration:
   - Set `DATABASE_URL` to your PostgreSQL connection string
   - Set `JWT_SECRET_KEY` to a secure random string
   - Set `GEMINI_API_KEY` to your Google Gemini API key

6. Start the server:
   ```bash
   uvicorn app.main:app --reload
   ```

   The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` file:
   ```bash
   cp .env.local.example .env.local
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/signin` - Login user
- `GET /api/auth/me` - Get current user

### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks` - List user's tasks
- `GET /api/tasks/{id}` - Get single task
- `PUT /api/tasks/{id}` - Update task
- `PATCH /api/tasks/{id}/complete` - Toggle completion
- `DELETE /api/tasks/{id}` - Delete task

### Chat
- `POST /api/chat` - Send message to AI
- `GET /api/chat/history` - Get conversation history
- `DELETE /api/chat/history` - Clear history

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── models/      # SQLModel database models
│   │   ├── schemas/     # Pydantic request/response schemas
│   │   ├── routers/     # API route handlers
│   │   ├── services/    # Business logic
│   │   └── middleware/  # Auth middleware
│   └── tests/           # Backend tests
│
├── frontend/
│   └── src/
│       ├── app/         # Next.js pages
│       ├── components/  # React components
│       ├── hooks/       # Custom React hooks
│       ├── lib/         # Utilities and API client
│       └── types/       # TypeScript types
│
└── specs/               # Feature specifications
```

## License

This project is for hackathon demonstration purposes.
