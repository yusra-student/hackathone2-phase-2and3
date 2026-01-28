/**
 * Custom hook for managing chat state and operations.
 */

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "./useAuth";
import { sendMessage, getChatHistory, clearChatHistory } from "@/lib/chat";
import type { ChatMessage } from "@/types/chat";

export function useChat() {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch chat history when panel opens and user is authenticated
  const fetchHistory = useCallback(async () => {
    if (!isAuthenticated) {
      setMessages([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const history = await getChatHistory();
      setMessages(history);
    } catch (err) {
      console.error("Failed to fetch chat history:", err);
      setError("Failed to load chat history");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Load history when panel opens
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchHistory();
    }
  }, [isOpen, isAuthenticated, fetchHistory]);

  // Clear messages when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setMessages([]);
    }
  }, [isAuthenticated]);

  // Send a message to the chatbot
  const send = useCallback(
    async (message: string) => {
      if (!message.trim() || loading) return;

      // Optimistically add user message
      const tempUserMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        role: "user",
        content: message.trim(),
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, tempUserMessage]);
      setLoading(true);
      setError(null);

      try {
        const response = await sendMessage(message.trim());
        // Replace with server response which includes updated history
        setMessages(response.history);
      } catch (err) {
        console.error("Failed to send message:", err);
        setError("Failed to send message. Please try again.");
        // Remove the optimistic message on error
        setMessages((prev) => prev.filter((m) => m.id !== tempUserMessage.id));
      } finally {
        setLoading(false);
      }
    },
    [loading]
  );

  // Clear chat history
  const clear = useCallback(async () => {
    try {
      setLoading(true);
      await clearChatHistory();
      setMessages([]);
      setError(null);
    } catch (err) {
      console.error("Failed to clear chat history:", err);
      setError("Failed to clear history");
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle chat panel
  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    messages,
    loading,
    error,
    isOpen,
    send,
    clear,
    toggle,
    open,
    close,
    fetchHistory,
  };
}
