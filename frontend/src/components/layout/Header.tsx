"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { SignInModal } from "@/components/auth/SignInModal";
import { SignUpModal } from "@/components/auth/SignUpModal";

export function Header() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleSwitchToSignIn = () => {
    setShowSignUp(false);
    setShowSignIn(true);
  };

  const handleSwitchToSignUp = () => {
    setShowSignIn(false);
    setShowSignUp(true);
  };

  return (
    <>
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo / App Name */}
          <div className="flex items-center gap-2">
            <svg
              className="h-8 w-8 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            <span className="text-xl font-semibold">TaskFlow</span>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
            ) : isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {user?.email}
                </span>
                <Button variant="outline" onClick={logout}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => setShowSignIn(true)}>
                  Sign In
                </Button>
                <Button onClick={() => setShowSignUp(true)}>
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modals */}
      <SignInModal
        open={showSignIn}
        onOpenChange={setShowSignIn}
        onSwitchToSignUp={handleSwitchToSignUp}
      />
      <SignUpModal
        open={showSignUp}
        onOpenChange={setShowSignUp}
        onSwitchToSignIn={handleSwitchToSignIn}
      />
    </>
  );
}
