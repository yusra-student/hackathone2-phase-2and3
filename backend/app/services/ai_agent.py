"""AI Agent service for chatbot with task management using OpenRouter."""

import json
import re
from datetime import date, time, datetime, timedelta
from typing import Optional
from uuid import UUID

import httpx
from sqlmodel.ext.asyncio.session import AsyncSession

from app.config import settings
from app.schemas.task import TaskCreate, TaskUpdate
from app.services import task as task_service

SYSTEM_PROMPT = """You are TaskFlow AI. When user wants to manage tasks, respond ONLY with JSON:

{"action": "create_task", "params": {"title": "task name", "due_time": "HH:MM"}}
{"action": "list_tasks", "params": {"filter": "all"}}
{"action": "complete_task", "params": {"task_id": "uuid"}}
{"action": "delete_task", "params": {"task_id": "uuid"}}

Time: 5pm=17:00, 9am=09:00

Examples:
"add task study at 5pm" → {"action": "create_task", "params": {"title": "study", "due_time": "17:00"}}
"show tasks" → {"action": "list_tasks", "params": {"filter": "all"}}

For greetings like "hi", respond friendly text only."""


class AIAgent:
    def __init__(self, session: AsyncSession, user_id: UUID):
        self.session = session
        self.user_id = user_id

    def _parse_time(self, time_str: str) -> Optional[time]:
        if not time_str:
            return None
        time_str = time_str.strip()
        try:
            return time.fromisoformat(time_str)
        except:
            match = re.match(r'(\d{1,2})(?::(\d{2}))?\s*(am|pm)?', time_str, re.I)
            if match:
                hour = int(match.group(1))
                minute = int(match.group(2) or 0)
                period = match.group(3)
                if period:
                    if period.lower() == 'pm' and hour != 12:
                        hour += 12
                    elif period.lower() == 'am' and hour == 12:
                        hour = 0
                return time(hour, minute)
        return None

    def _parse_date(self, date_str: str) -> Optional[date]:
        if not date_str:
            return None
        date_str = date_str.lower().strip()
        today = datetime.now().date()
        if date_str == "today":
            return today
        if date_str == "tomorrow":
            return today + timedelta(days=1)
        try:
            return date.fromisoformat(date_str)
        except:
            return None

    async def _create_task(self, params: dict) -> str:
        title = params.get("title", "").strip()
        if not title:
            return "Please tell me the task name."

        task_data = TaskCreate(
            title=title,
            description=params.get("description"),
            due_date=self._parse_date(params.get("due_date", "")),
            due_time=self._parse_time(params.get("due_time", "")),
        )

        task = await task_service.create_task(self.session, self.user_id, task_data)
        await self.session.commit()  # Ensure commit

        msg = f"Done! Task '{task.title}' added"
        if task.due_time:
            msg += f" for {task.due_time.strftime('%I:%M %p')}"
        if task.due_date:
            msg += f" on {task.due_date.strftime('%b %d')}"
        return msg + "."

    async def _list_tasks(self, params: dict) -> str:
        tasks = await task_service.get_tasks(self.session, self.user_id)
        filter_type = params.get("filter", "all")

        if filter_type == "pending":
            tasks = [t for t in tasks if not t.is_completed]
        elif filter_type == "completed":
            tasks = [t for t in tasks if t.is_completed]

        if not tasks:
            return "No tasks yet! Say 'add task buy groceries' to create one."

        lines = [f"Your tasks ({len(tasks)}):"]
        for i, t in enumerate(tasks, 1):
            status = "Done" if t.is_completed else "Todo"
            line = f"{i}. [{status}] {t.title}"
            if t.due_time:
                line += f" at {t.due_time.strftime('%I:%M %p')}"
            lines.append(line)
        return "\n".join(lines)

    async def _complete_task(self, params: dict) -> str:
        try:
            task_id = UUID(params.get("task_id", ""))
        except:
            return "Please provide valid task ID."
        task = await task_service.toggle_complete(self.session, task_id, self.user_id)
        if not task:
            return "Task not found."
        await self.session.commit()
        return f"Task '{task.title}' marked as {'done' if task.is_completed else 'pending'}!"

    async def _delete_task(self, params: dict) -> str:
        try:
            task_id = UUID(params.get("task_id", ""))
        except:
            return "Please provide valid task ID."
        task = await task_service.get_task(self.session, task_id, self.user_id)
        if not task:
            return "Task not found."
        title = task.title
        await task_service.delete_task(self.session, task_id, self.user_id)
        await self.session.commit()
        return f"Task '{title}' deleted!"

    def _extract_json(self, text: str) -> Optional[dict]:
        """Extract JSON from text."""
        # Remove markdown code blocks completely
        text = re.sub(r'```json\s*\n?', '', text)
        text = re.sub(r'```\s*\n?', '', text)
        text = text.strip()

        # Also try removing any leading/trailing whitespace and newlines
        text = text.replace('\n', ' ').strip()

        # Try direct parse first
        try:
            data = json.loads(text)
            if isinstance(data, dict) and "action" in data:
                return data
        except:
            pass

        # Find JSON with braces matching
        if '{' in text:
            start = text.find('{')
            depth = 0
            end = start
            for i in range(start, len(text)):
                if text[i] == '{':
                    depth += 1
                elif text[i] == '}':
                    depth -= 1
                    if depth == 0:
                        end = i + 1
                        break

            json_str = text[start:end]
            try:
                data = json.loads(json_str)
                if isinstance(data, dict) and "action" in data:
                    return data
            except:
                pass

        return None

    async def process_message(self, user_message: str, chat_history: list = None) -> str:
        try:
            headers = {
                "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000"
            }

            today = datetime.now()
            user_prompt = f"Today is {today.strftime('%Y-%m-%d')}. User says: {user_message}"

            async with httpx.AsyncClient(timeout=60.0) as client:
                resp = await client.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers=headers,
                    json={
                        "model": settings.OPENROUTER_MODEL,
                        "messages": [
                            {"role": "system", "content": SYSTEM_PROMPT},
                            {"role": "user", "content": user_prompt}
                        ],
                        "max_tokens": 150
                    }
                )
                resp.raise_for_status()
                ai_response = resp.json()["choices"][0]["message"]["content"].strip()

            # Try to extract and execute JSON action
            action_data = self._extract_json(ai_response)

            if action_data:
                action = action_data.get("action")
                params = action_data.get("params", {})

                if action == "create_task":
                    return await self._create_task(params)
                elif action == "list_tasks":
                    return await self._list_tasks(params)
                elif action == "complete_task":
                    return await self._complete_task(params)
                elif action == "delete_task":
                    return await self._delete_task(params)

            # If response looks like JSON but we couldn't parse, give friendly message
            if ai_response.strip().startswith('{'):
                return "I'm ready to help! Try 'add task meeting at 3pm' or 'show my tasks'."

            return ai_response

        except Exception as e:
            print(f"AI Agent Error: {e}")
            return "Sorry, something went wrong. Please try again."
