/**
 * Chat-related TypeScript types.
 */

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  response: string;
  history: ChatMessage[];
}
