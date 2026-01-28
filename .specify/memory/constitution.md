# Full Stack Todo Web Application with AI Chatbot Constitution
<!-- Phase 2 + Phase 3 Hackathon Project -->

## Core Principles

### I. Spec-Driven Development Only
All development follows the Spec-Kit Plus workflow. No manual coding by human — Claude generates all code, structure, and logic. Every feature must be specified before implementation begins.

### II. Clear Separation of Concerns
The architecture maintains strict boundaries between:
- **Frontend**: User interface and client-side logic
- **Backend**: API services and business logic
- **AI/Chatbot**: Natural language processing and tool orchestration
- **Database**: Persistent data storage

Each layer has a single responsibility and communicates through well-defined interfaces.

### III. Security-First Design
Security is not an afterthought but a foundational requirement:
- Authentication required for all task operations
- Unauthorized requests return proper HTTP errors (401, 403)
- Input validation on all endpoints
- Task ownership enforced at every layer
- No hardcoded secrets or credentials (use `.env`)
- User data isolation strictly enforced

### IV. Production-Grade Quality
This is not a demo — it must feel professional and production-ready:
- Clean, readable code structure
- Predictable folder organization
- Clear naming conventions
- Reusable components
- Maintainable and extensible design
- Graceful error handling throughout

### V. Phase Extension (Not Replacement)
Phase 3 (AI Chatbot) must extend Phase 2 (Todo App), not replace it:
- Existing Phase 2 functionality must remain stable
- No breaking changes to existing APIs
- New features integrate seamlessly with existing architecture
- Both UI-based and chat-based task management coexist

### VI. Stateless Services with Persistent State
- Backend services are stateless
- Persistent state stored only in database
- Database is the single source of truth
- No session state stored in memory

## Architecture Principles

### Backend Requirements
- REST APIs must be user-scoped
- All operations must validate authenticated user
- Errors must be handled gracefully with meaningful messages
- No unnecessary dependencies

### Frontend Requirements
- Homepage loads first (public landing page)
- Authentication is user-triggered (no forced redirects)
- Modern, clean, and professional UI
- Accessibility and responsiveness required
- No experimental or flashy UI patterns

### AI & Chatbot Requirements
- AI must act only through defined tools/APIs
- No hallucinated task data — all data comes from database
- All AI actions must be confirmed in responses
- Chatbot must explain what it did in simple language
- AI must never access data outside the authenticated user
- Chatbot must feel like a native feature, not bolted-on

## Quality Standards

### Code Quality
- Clean and readable structure
- Predictable folder organization
- Clear naming conventions
- Reusable components
- Maintainable and extensible design

### Testing Standards
- Features must be testable
- Clear acceptance criteria for each feature
- Error paths explicitly tested

### Documentation
- Code should be self-documenting where possible
- Complex logic documented inline
- API contracts clearly defined

## Constraints

### Development Constraints
- No manual code writing by human
- Claude generates code, structure, and logic
- Phase 3 implemented inside Phase 2 project
- No breaking changes to existing APIs
- No unnecessary dependencies

### Out of Scope
- Voice interaction
- Multi-tenant admin dashboards
- Notifications or reminders
- Advanced analytics
- Offline mode

## Success Criteria

1. **Phase 2 Complete**: Todo app fully functional via UI
2. **Phase 3 Complete**: Chatbot manages todos via natural language
3. **Production Quality**: UI looks professional and polished
4. **Evaluator-Friendly**: App can be evaluated easily by hackathon judges
5. **Agentic Demo**: Project demonstrates agentic workflow clearly

## Governance

This constitution supersedes all other practices for this project:
- All code must comply with these principles
- Amendments require explicit user approval
- When in doubt, refer back to these principles
- Complexity must be justified against simplicity

**Version**: 1.0.0 | **Ratified**: 2026-01-26 | **Last Amended**: 2026-01-26
