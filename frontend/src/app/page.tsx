"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { Header } from "@/components/layout/Header";
import { HeroSection, ActionButtons } from "@/components/home";
import { SignUpModal } from "@/components/auth/SignUpModal";
import { SignInModal } from "@/components/auth/SignInModal";
import {
  AddTaskModal,
  UpdateTaskModal,
  DeleteConfirmModal,
  TaskListPanel,
} from "@/components/tasks";
import { ChatButton, ChatPanel } from "@/components/chatbot";
import { useChat } from "@/hooks/useChat";
import type { Task, TaskCreate, TaskUpdate } from "@/types/task";

type SelectionMode = "view" | "select-update" | "select-complete" | "select-delete" | null;

export default function Home() {
  const { isAuthenticated } = useAuth();
  const {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
  } = useTasks();

  const {
    messages: chatMessages,
    loading: chatLoading,
    error: chatError,
    isOpen: chatOpen,
    send: sendChatMessage,
    clear: clearChat,
    toggle: toggleChat,
    close: closeChat,
  } = useChat();

  // Modal states
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showUpdateTask, setShowUpdateTask] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTaskPanel, setShowTaskPanel] = useState(false);

  // Selection state
  const [selectionMode, setSelectionMode] = useState<SelectionMode>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Handle task creation
  const handleCreateTask = useCallback(
    async (data: TaskCreate) => {
      await createTask(data);
    },
    [createTask]
  );

  // Handle task update
  const handleUpdateTask = useCallback(
    async (id: string, data: TaskUpdate) => {
      await updateTask(id, data);
    },
    [updateTask]
  );

  // Handle task deletion
  const handleDeleteTask = useCallback(
    async (id: string) => {
      await deleteTask(id);
    },
    [deleteTask]
  );

  // Handle toggle complete
  const handleToggleComplete = useCallback(
    async (task: Task) => {
      await toggleComplete(task.id);
    },
    [toggleComplete]
  );

  // Handle task selection in panel
  const handleTaskSelect = useCallback(
    (task: Task) => {
      setSelectedTask(task);
      if (selectionMode === "select-update") {
        setShowUpdateTask(true);
        setSelectionMode(null);
        setShowTaskPanel(false);
      } else if (selectionMode === "select-complete") {
        handleToggleComplete(task);
        setSelectionMode(null);
        setShowTaskPanel(false);
      } else if (selectionMode === "select-delete") {
        setShowDeleteConfirm(true);
        setSelectionMode(null);
        setShowTaskPanel(false);
      }
    },
    [selectionMode, handleToggleComplete]
  );

  // Action button handlers
  const handleAddTaskClick = () => {
    if (!isAuthenticated) {
      setShowSignIn(true);
      return;
    }
    setShowAddTask(true);
  };

  const handleViewTasksClick = () => {
    if (!isAuthenticated) {
      setShowSignIn(true);
      return;
    }
    setSelectionMode("view");
    setShowTaskPanel(true);
  };

  const handleUpdateTaskClick = () => {
    if (!isAuthenticated) {
      setShowSignIn(true);
      return;
    }
    setSelectionMode("select-update");
    setShowTaskPanel(true);
  };

  const handleCompleteTaskClick = () => {
    if (!isAuthenticated) {
      setShowSignIn(true);
      return;
    }
    setSelectionMode("select-complete");
    setShowTaskPanel(true);
  };

  const handleDeleteTaskClick = () => {
    if (!isAuthenticated) {
      setShowSignIn(true);
      return;
    }
    setSelectionMode("select-delete");
    setShowTaskPanel(true);
  };

  // Direct edit/delete from task card
  const handleDirectEdit = useCallback((task: Task) => {
    setSelectedTask(task);
    setShowUpdateTask(true);
  }, []);

  const handleDirectDelete = useCallback((task: Task) => {
    setSelectedTask(task);
    setShowDeleteConfirm(true);
  }, []);

  // Close panel handler
  const handleClosePanel = () => {
    setShowTaskPanel(false);
    setSelectionMode(null);
  };

  // Handle chat message with task refresh
  const handleSendChatMessage = useCallback(
    async (message: string) => {
      await sendChatMessage(message);
      // Refresh tasks after chat action (AI may have modified tasks)
      await fetchTasks();
    },
    [sendChatMessage, fetchTasks]
  );

  // Handle chat toggle with auth check
  const handleChatToggle = () => {
    if (!isAuthenticated) {
      setShowSignIn(true);
      return;
    }
    toggleChat();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <HeroSection
          onSignUp={() => setShowSignUp(true)}
          onSignIn={() => setShowSignIn(true)}
        />

        {isAuthenticated && (
          <ActionButtons
            onAddTask={handleAddTaskClick}
            onViewTasks={handleViewTasksClick}
            onUpdateTask={handleUpdateTaskClick}
            onCompleteTask={handleCompleteTaskClick}
            onDeleteTask={handleDeleteTaskClick}
          />
        )}

        {/* Features section for non-authenticated users */}
        {!isAuthenticated && (
          <section className="py-12">
            <h2 className="text-2xl font-semibold text-center mb-8">
              Why TaskFlow?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground">
                  Add and manage tasks in seconds with our intuitive interface.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Secure & Private</h3>
                <p className="text-sm text-muted-foreground">
                  Your tasks are encrypted and only accessible to you.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">AI-Powered</h3>
                <p className="text-sm text-muted-foreground">
                  Manage tasks naturally with our AI chatbot assistant.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TaskFlow. All rights reserved.</p>
        </div>
      </footer>

      {/* Modals */}
      <SignUpModal open={showSignUp} onOpenChange={setShowSignUp} />
      <SignInModal open={showSignIn} onOpenChange={setShowSignIn} />
      <AddTaskModal
        open={showAddTask}
        onOpenChange={setShowAddTask}
        onSubmit={handleCreateTask}
      />
      <UpdateTaskModal
        open={showUpdateTask}
        onOpenChange={setShowUpdateTask}
        task={selectedTask}
        onSubmit={handleUpdateTask}
      />
      <DeleteConfirmModal
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        task={selectedTask}
        onConfirm={handleDeleteTask}
      />
      <TaskListPanel
        open={showTaskPanel}
        onClose={handleClosePanel}
        tasks={tasks}
        loading={loading}
        error={error}
        onToggleComplete={handleToggleComplete}
        onEdit={handleDirectEdit}
        onDelete={handleDirectDelete}
        onRetry={fetchTasks}
        selectionMode={selectionMode}
        onSelect={handleTaskSelect}
      />

      {/* Chatbot */}
      <ChatButton onClick={handleChatToggle} />
      <ChatPanel
        isOpen={chatOpen}
        onClose={closeChat}
        messages={chatMessages}
        loading={chatLoading}
        error={chatError}
        onSend={handleSendChatMessage}
        onClear={clearChat}
      />
    </div>
  );
}
