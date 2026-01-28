"use client";

import { useAuth } from "@/hooks/useAuth";

interface HeroSectionProps {
  onSignUp: () => void;
  onSignIn: () => void;
}

export function HeroSection({ onSignUp, onSignIn }: HeroSectionProps) {
  const { isAuthenticated, user } = useAuth();

  return (
    <section className="text-center py-12 md:py-20">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
        {isAuthenticated ? (
          <>Welcome back, <span className="text-primary">{user?.email.split("@")[0]}</span></>
        ) : (
          <>Organize Your Day with <span className="text-primary">TaskFlow</span></>
        )}
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
        {isAuthenticated
          ? "Ready to tackle your tasks? Use the action buttons below to manage your to-do list."
          : "A simple, beautiful task manager to help you stay focused and productive. Get started in seconds."}
      </p>
      {!isAuthenticated && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onSignUp}
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
          >
            Get Started Free
          </button>
          <button
            onClick={onSignIn}
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
          >
            Sign In
          </button>
        </div>
      )}
    </section>
  );
}
