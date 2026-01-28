"use client";

import { Button } from "@/components/ui/button";

interface ChatButtonProps {
  onClick: () => void;
  hasUnread?: boolean;
}

/**
 * Floating chat button to open the chat panel.
 */
export function ChatButton({ onClick, hasUnread }: ChatButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-30 hover:scale-105 transition-transform"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
      >
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2" />
        <path d="M20 14h2" />
        <path d="M15 13v2" />
        <path d="M9 13v2" />
      </svg>
      {hasUnread && (
        <span className="absolute top-0 right-0 h-3 w-3 bg-destructive rounded-full" />
      )}
      <span className="sr-only">Open chat</span>
    </Button>
  );
}
