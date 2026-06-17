import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type AuthUser = {
  email: string;
  name: string;
  isAdmin: boolean;
};

type AuthContextValue = {
  user: AuthUser | null;
  signIn: (email: string, _password: string) => Promise<AuthUser>;
  signUp: (email: string, _password: string, name?: string) => Promise<AuthUser>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "indie-cafe-user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const persist = (u: AuthUser) => {
    setUser(u);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } catch {
      /* ignore */
    }
    return u;
  };

  const value: AuthContextValue = {
    user,
    signIn: async (email) => {
      const name = email.split("@")[0] || "Friend";
      return persist({ email, name, isAdmin: email.toLowerCase().includes("admin") });
    },
    signUp: async (email, _password, name) => {
      return persist({
        email,
        name: name || email.split("@")[0] || "Friend",
        isAdmin: email.toLowerCase().includes("admin"),
      });
    },
    signOut: () => {
      setUser(null);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
