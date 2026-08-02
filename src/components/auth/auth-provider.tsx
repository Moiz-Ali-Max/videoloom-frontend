"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authApi } from "@/lib/api";
import { AUTH_EXPIRED_EVENT, clearTokens, getAccessToken, setTokens } from "@/lib/token-storage";
import { isTokenResponse, type SignupResponse, type UserInfo } from "@/lib/types/auth";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: UserInfo | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<SignupResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      if (!getAccessToken()) {
        if (!cancelled) {
          setUser(null);
          setStatus("unauthenticated");
        }
        return;
      }
      try {
        const me = await authApi.me();
        if (!cancelled) {
          setUser(me);
          setStatus("authenticated");
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          setStatus("unauthenticated");
        }
      }
    }

    bootstrap();

    const onExpired = () => {
      setUser(null);
      setStatus("unauthenticated");
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);

    return () => {
      cancelled = true;
      window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const tokens = await authApi.login({ email, password });
    setTokens(tokens.access_token, tokens.refresh_token);
    const me = await authApi.me();
    setUser(me);
    setStatus("authenticated");
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    const res = await authApi.signup({ email, password });
    if (isTokenResponse(res)) {
      setTokens(res.access_token, res.refresh_token);
      const me = await authApi.me();
      setUser(me);
      setStatus("authenticated");
    }
    return res;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // best-effort server-side session revoke — client state is cleared regardless
    } finally {
      clearTokens();
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, status, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
