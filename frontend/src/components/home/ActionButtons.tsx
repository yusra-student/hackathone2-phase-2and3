"use client";

import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onAddTask: () => void;
  onViewTasks: () => void;
  onUpdateTask: () => void;
  onCompleteTask: () => void;
  onDeleteTask: () => void;
}

export function ActionButtons({
  onAddTask,
  onViewTasks,
  onUpdateTask,
  onCompleteTask,
  onDeleteTask,
}: ActionButtonsProps) {
  const actions = [
    {
      label: "Add Task",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
      onClick: onAddTask,
      variant: "default" as const,
      description: "Create a new task",
    },
    {
      label: "View Tasks",
      icon: (
        <svg
          className="h-6 w-6"
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
      ),
      onClick: onViewTasks,
      variant: "secondary" as const,
      description: "See all your tasks",
    },
    {
      label: "Update Task",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
      onClick: onUpdateTask,
      variant: "outline" as const,
      description: "Modify an existing task",
    },
    {
      label: "Complete Task",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
      onClick: onCompleteTask,
      variant: "outline" as const,
      description: "Mark task as done",
    },
    {
      label: "Delete Task",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      ),
      onClick: onDeleteTask,
      variant: "outline" as const,
      description: "Remove a task",
    },
  ];

  return (
    <section className="py-8">
      <h2 className="text-2xl font-semibold text-center mb-8">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant}
            onClick={action.onClick}
            className="flex flex-col items-center justify-center h-32 p-4 gap-2"
          >
            {action.icon}
            <span className="font-medium">{action.label}</span>
            <span className="text-xs text-muted-foreground hidden sm:block">
              {action.description}
            </span>
          </Button>
        ))}
      </div>
    </section>
  );
}
