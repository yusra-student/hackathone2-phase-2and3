---
id: 001
title: Create Project Constitution
stage: constitution
date: 2026-01-26
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: master
user: yusra waheed
command: /sp.constitution
labels: ["constitution", "project-setup", "principles", "hackathon"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - null
---

## Prompt

/sp.constitution

Project:
Full Stack Todo Web Application with AI Chatbot (Phase 2 + Phase 3)

Core Principles:
- Spec-driven development only (Spec-Kit Plus workflow)
- No manual coding by human
- Clear separation of concerns (frontend, backend, AI, database)
- Security-first design
- Professional, production-grade quality (not demo-level)

Architecture Principles:
- Phase 3 must extend Phase 2, not replace it
- Existing Phase 2 functionality must remain stable
- Stateless backend services
- Persistent state stored only in database
- User data isolation strictly enforced

UI / UX Principles:
- Homepage loads first (public)
- Authentication is user-triggered (no forced redirects)
- UI must feel modern, clean, and professional
- Chatbot must feel like a native feature
- No experimental or flashy UI patterns
- Accessibility and responsiveness required

Backend Principles:
- REST APIs must be user-scoped
- All operations must validate authenticated user
- Database is the single source of truth
- Errors must be handled gracefully
- No hardcoded secrets or credentials

AI & Chatbot Principles:
- AI must act only through defined tools/APIs
- No hallucinated task data
- All AI actions must be confirmed in responses
- Chatbot must explain what it did in simple language
- AI must never access data outside the authenticated user

Security Standards:
- Authentication required for all task operations
- Unauthorized requests return proper HTTP errors
- Input validation on all endpoints
- Task ownership enforced at every layer

Quality Standards:
- Clean and readable structure
- Predictable folder organization
- Clear naming conventions
- Reusable components
- Maintainable and extensible design

Constraints:
- No manual code writing
- Claude generates code, structure, and logic
- Phase 3 implemented inside Phase 2 project
- No breaking changes to existing APIs
- No unnecessary dependencies

Success Criteria:
- Phase 2 Todo app fully functional via UI
- Phase 3 chatbot manages todos via natural language
- UI looks production-ready
- App can be evaluated easily by hackathon judges
- Project demonstrates agentic workflow clearly

Out of Scope:
- Voice interaction
- Multi-tenant admin dashboards
- Notifications or reminders
- Advanced analytics
- Offline mode

## Response snapshot

Created project constitution at `.specify/memory/constitution.md` with:
- 6 Core Principles: Spec-Driven Development, Separation of Concerns, Security-First, Production-Grade Quality, Phase Extension (Not Replacement), Stateless Services
- Architecture Principles for Backend, Frontend, and AI/Chatbot
- Quality Standards for Code, Testing, and Documentation
- Development Constraints and Out of Scope items clearly defined
- 5 Success Criteria for hackathon evaluation
- Governance rules establishing constitution as authoritative

## Outcome

- Impact: Established foundational principles for Phase 2 + Phase 3 hackathon project
- Tests: N/A (constitution document)
- Files: 1 created/updated (.specify/memory/constitution.md)
- Next prompts: /sp.specify to create feature specs, /sp.plan to create implementation plan
- Reflection: Constitution captures all user requirements comprehensively; ready for spec-driven development

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
