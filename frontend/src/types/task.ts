/**
 * Task-related TypeScript types.
 */

export interface Task {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  due_time: string | null;
  is_completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string | null;
  due_date?: string | null;
  due_time?: string | null;
}

export interface TaskUpdate {
  title?: string;
  description?: string | null;
  due_date?: string | null;
  due_time?: string | null;
  is_completed?: boolean;
}
