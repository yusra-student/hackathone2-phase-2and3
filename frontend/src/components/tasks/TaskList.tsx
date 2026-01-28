"use client";

import { TaskCard } from "./TaskCard";
import type { Task } from "@/types/task";

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onRetry?: () => void;
  selectionMode?: "view" | "select-update" | "select-complete" | "select-delete" | null;
  onSelect?: (task: Task) => void;
}

export function TaskList({
  tasks,
  loading,
  error,
  onToggleComplete,
  onEdit,
  onDelete,
  onRetry,
  selectionMode,
  onSelect,
}: TaskListProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4 text-sm text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <svg
          className="h-12 w-12 text-destructive"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p className="mt-4 text-sm text-destructive">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm text-primary hover:underline"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <svg
          className="h-12 w-12 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <p className="mt-4 text-muted-foreground">No tasks yet</p>
        <p className="text-sm text-muted-foreground">
          Create your first task to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {selectionMode && selectionMode !== "view" && (
        <div className="mb-4 p-3 bg-primary/10 rounded-lg text-sm text-center">
          {selectionMode === "select-update" && "Select a task to update"}
          {selectionMode === "select-complete" && "Select a task to mark complete/incomplete"}
          {selectionMode === "select-delete" && "Select a task to delete"}
        </div>
      )}
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
          selectionMode={selectionMode}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
