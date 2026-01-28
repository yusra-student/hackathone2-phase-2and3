"use client";

import { useEffect, useRef } from "react";
import { TaskList } from "./TaskList";
import { Button } from "@/components/ui/button";
import type { Task } from "@/types/task";
import { cn } from "@/lib/utils";

interface TaskListPanelProps {
  open: boolean;
  onClose: () => void;
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

export function TaskListPanel({
  open,
  onClose,
  tasks,
  loading,
  error,
  onToggleComplete,
  onEdit,
  onDelete,
  onRetry,
  selectionMode,
  onSelect,
}: TaskListPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Handle escape key to close panel
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  // Handle click outside to close panel
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        open &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        aria-hidden="true"
      />

      {/* Sliding Panel */}
      <div
        ref={panelRef}
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-[400px] md:w-[480px] bg-background z-50 shadow-xl",
          "transform transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Task list panel"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">My Tasks</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
            aria-label="Close panel"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>

        {/* Task count */}
        <div className="px-4 py-2 border-b bg-muted/50">
          <p className="text-sm text-muted-foreground">
            {loading ? (
              "Loading..."
            ) : (
              <>
                {tasks.filter((t) => !t.is_completed).length} active,{" "}
                {tasks.filter((t) => t.is_completed).length} completed
              </>
            )}
          </p>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-4 h-[calc(100%-120px)]">
          <TaskList
            tasks={tasks}
            loading={loading}
            error={error}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
            onRetry={onRetry}
            selectionMode={selectionMode}
            onSelect={onSelect}
          />
        </div>
      </div>
    </>
  );
}
