import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "./supabase";

export type AuthUser = {
  email: string;
  name: string;
  isAdmin: boolean;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthUser>;
  signUp: (email: string, password: string, name?: string) => Promise<AuthUser>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, is_admin")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error fetching profile:", err);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const handleSession = async (session: any) => {
    if (session?.user) {
      const profile = await fetchProfile(session.user.id);
      setUser({
        email: session.user.email || "",
        name:
          profile?.full_name ||
          session.user.user_metadata?.full_name ||
          session.user.email?.split("@")[0] ||
          "Friend",
        isAdmin: profile?.is_admin || session.user.email?.toLowerCase().includes("admin") || false,
      });
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      void handleSession(session);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    signIn: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const profile = await fetchProfile(data.user.id);
      const u = {
        email: data.user.email || "",
        name:
          profile?.full_name ||
          data.user.user_metadata?.full_name ||
          data.user.email?.split("@")[0] ||
          "Friend",
        isAdmin: profile?.is_admin || data.user.email?.toLowerCase().includes("admin") || false,
      };
      return u;
    },
    signUp: async (email, password, name) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });
      if (error) throw error;
      if (!data.user) throw new Error("No user returned from signup");

      const profile = await fetchProfile(data.user.id);
      const u = {
        email: data.user.email || "",
        name:
          profile?.full_name ||
          data.user.user_metadata?.full_name ||
          data.user.email?.split("@")[0] ||
          "Friend",
        isAdmin: profile?.is_admin || data.user.email?.toLowerCase().includes("admin") || false,
      };
      return u;
    },
    signOut: async () => {
      await supabase.auth.signOut();
      setUser(null);
    },
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
