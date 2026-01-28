"use client";

import { useState, useEffect, useCallback } from "react";
import type { Task, TaskCreate, TaskUpdate } from "@/types/task";
import * as taskApi from "@/lib/tasks";
import { useAuth } from "@/hooks/useAuth";

export function useTasks() {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) {
      setTasks([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await taskApi.getTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const createTask = useCallback(async (data: TaskCreate) => {
    const newTask = await taskApi.createTask(data);
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  const updateTask = useCallback(async (id: string, data: TaskUpdate) => {
    const updatedTask = await taskApi.updateTask(id, data);
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? updatedTask : task))
    );
    return updatedTask;
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    await taskApi.deleteTask(id);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const toggleComplete = useCallback(async (id: string) => {
    const updatedTask = await taskApi.toggleComplete(id);
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? updatedTask : task))
    );
    return updatedTask;
  }, []);

  // Auto-fetch tasks when authenticated
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
  };
}
