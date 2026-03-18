import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, LogIn, LogOut } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface LoginButtonProps {
  variant?: "default" | "hero" | "outline" | "ghost";
  label?: string;
}

export default function LoginButton({
  variant = "default",
  label,
}: LoginButtonProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: "/" });
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as Error;
        if (err?.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const text = isLoggingIn
    ? "Connecting..."
    : isAuthenticated
      ? label || "Logout"
      : label || "Login";

  if (variant === "hero") {
    return (
      <button
        type="button"
        onClick={handleAuth}
        disabled={isLoggingIn}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-accent-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isLoggingIn ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isAuthenticated ? (
          <LogOut className="w-4 h-4" />
        ) : (
          <LogIn className="w-4 h-4" />
        )}
        {text}
      </button>
    );
  }

  if (variant === "outline") {
    return (
      <button
        type="button"
        onClick={handleAuth}
        disabled={isLoggingIn}
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-sidebar-border text-sidebar-foreground/80 hover:bg-sidebar-accent/40 transition-colors font-medium disabled:opacity-50"
      >
        {isLoggingIn ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <LogIn className="w-4 h-4" />
        )}
        {text}
      </button>
    );
  }

  if (variant === "ghost") {
    return (
      <button
        type="button"
        onClick={handleAuth}
        disabled={isLoggingIn}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground transition-colors text-sm font-medium disabled:opacity-50"
      >
        {isLoggingIn ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isAuthenticated ? (
          <LogOut className="w-4 h-4" />
        ) : (
          <LogIn className="w-4 h-4" />
        )}
        {text}
      </button>
    );
  }

  // Default
  return (
    <button
      type="button"
      onClick={handleAuth}
      disabled={isLoggingIn}
      className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 text-sm ${
        isAuthenticated
          ? "bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/80"
          : "bg-accent text-accent-foreground hover:opacity-90"
      }`}
    >
      {isLoggingIn ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isAuthenticated ? (
        <LogOut className="w-4 h-4" />
      ) : (
        <LogIn className="w-4 h-4" />
      )}
      {text}
    </button>
  );
}
