"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiClient, ApiRequestError } from "@/lib/apiClient";
import { storage, type StoredAuth, type StoredUser } from "@/lib/authStorage";

interface AuthContextValue {
  user: StoredUser | null;
  loading: boolean;
  /** True until we've read localStorage on mount — prevents hydration flash. */
  hydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
  patchUser: (patch: Partial<StoredUser>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthResponse {
  user: StoredUser;
  accessToken: string;
  refreshToken: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // On mount: read the persisted session, re-hydrate React state, and fire
  // `/me` to verify the token is still valid. If it isn't, apiClient
  // handles the refresh dance; if refresh also fails, storage is cleared.
  useEffect(() => {
    const stored = storage.get();
    if (stored?.user) setUser(stored.user);
    setHydrated(true);

    if (stored?.accessToken) {
      apiClient
        .get<StoredUser>("/auth/me")
        .then((fresh) => {
          setUser(fresh);
          storage.patchUser(fresh);
        })
        .catch(() => {
          // Token invalid + refresh failed — clear state.
          storage.clear();
          setUser(null);
        });
    }
  }, []);

  // Cross-tab sync: if another tab logs in/out, pick it up here.
  useEffect(() => {
    const onStorage = () => {
      const s = storage.get();
      setUser(s?.user ?? null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleAuthResponse = (res: AuthResponse) => {
    const stored: StoredAuth = {
      user: res.user,
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
    };
    storage.set(stored);
    setUser(res.user);
  };

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await apiClient.post<AuthResponse>("/auth/login", {
        email,
        password,
      });
      handleAuthResponse(res);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(
    async (input: {
      name: string;
      email: string;
      password: string;
      phone?: string;
    }) => {
      setLoading(true);
      try {
        const res = await apiClient.post<AuthResponse>("/auth/register", input);
        handleAuthResponse(res);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    const stored = storage.get();
    // Tell the server to revoke the refresh token so it can't be replayed.
    // Errors here are non-fatal — logging out locally is always safe.
    if (stored?.refreshToken) {
      try {
        await apiClient.post("/auth/logout", {
          refreshToken: stored.refreshToken,
        });
      } catch {
        /* ignore */
      }
    }
    storage.clear();
    setUser(null);
  }, []);

  const refreshMe = useCallback(async () => {
    try {
      const fresh = await apiClient.get<StoredUser>("/auth/me");
      setUser(fresh);
      storage.patchUser(fresh);
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 401) {
        storage.clear();
        setUser(null);
      } else {
        throw err;
      }
    }
  }, []);

  const patchUser = useCallback((patch: Partial<StoredUser>) => {
    setUser((curr) => (curr ? { ...curr, ...patch } : curr));
    storage.patchUser(patch);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      hydrated,
      login,
      register,
      logout,
      refreshMe,
      patchUser,
    }),
    [user, loading, hydrated, login, register, logout, refreshMe, patchUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
