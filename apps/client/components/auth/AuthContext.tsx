"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { apiFetch } from "@/lib/apiFetch";

export type AuthUser = {
  _id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: {
    url: string;
    publicId?: string;
  };
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
  reloadUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const reloadUser = useCallback(async () => {
    try {
      const response = await apiFetch("/api/auth/me", {
        cache: "no-store",
      });

      if (!response.ok) {
        setUser(null);
        return;
      }

      const result = await response.json();
      const currentUser = result.user ?? result.data?.user;

      setUser(currentUser ?? null);
    } catch (error) {
      console.error("Failed to load authenticated user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadInitialUser = async () => {
      try {
        const response = await apiFetch("/api/auth/me", {
          cache: "no-store",
        });

        if (!response.ok) {
          if (!cancelled) setUser(null);
          return;
        }

        const result = await response.json();
        const currentUser = result.user ?? result.data?.user;

        if (!cancelled) {
          setUser(currentUser ?? null);
        }
      } catch (error) {
        console.error("Failed to load authenticated user:", error);

        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadInitialUser();

    const handleAuthChange = () => {
      void reloadUser();
    };

    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      cancelled = true;
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, [reloadUser]);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, reloadUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
