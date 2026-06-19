import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Coffee, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — Indie Coffee Hub" },
      { name: "description", content: "Sign in to save your favorite Bengaluru cafes." },
    ],
  }),
  component: Login,
});

function AuthSplit({ side, children }: { side: "left" | "right"; children: React.ReactNode }) {
  const Image = (
    <div className="hidden lg:block relative p-6">
      <div
        className="h-full w-full rounded-[2rem] overflow-hidden bg-[#FDE4DD]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="h-full w-full bg-gradient-to-tr from-[#2D2422]/40 via-transparent to-transparent p-10 flex flex-col justify-end">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white font-outfit text-xl font-medium"
          >
            <Coffee strokeWidth={1.5} /> Indie Coffee Hub
          </Link>
          <p className="mt-4 text-white/85 font-outfit text-3xl leading-tight max-w-sm">
            Slow mornings, focused work, great coffee.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF7F5] grid lg:grid-cols-2">
      {side === "left" ? Image : null}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="flex items-center justify-center px-6 py-16 w-full">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
      {side === "right" ? Image : null}
    </div>
  );
}

function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setBusy(true);
    setError(null);
    try {
      const loggedInUser = await signIn(email, password);
      if (loggedInUser.isAdmin) {
        navigate({ to: "/admin" });
      } else {
        navigate({ to: "/" });
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during sign in.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthSplit side="left">
      <Link
        to="/"
        className="lg:hidden inline-flex items-center gap-2 text-[#2D2422] font-outfit text-xl font-medium mb-8"
      >
        <Coffee strokeWidth={1.5} className="text-[#E67E6B]" /> Indie Coffee Hub
      </Link>
      <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#E67E6B] font-work-sans">
        Welcome back
      </p>
      <h1 className="mt-3 text-4xl tracking-tight font-light text-[#2D2422] font-outfit">
        Sign in
      </h1>
      <p className="mt-3 text-[#6B5C58] font-work-sans">Pick up where you left off.</p>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-work-sans">
          {error}
        </div>
      )}

      <form className="mt-10 space-y-5" onSubmit={submit} data-testid="login-form">
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] font-semibold text-[#6B5C58] font-work-sans mb-2">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            data-testid="login-email-input"
            className="w-full bg-white border border-[#F5EBE9] rounded-xl focus:ring-2 focus:ring-[#E67E6B]/30 focus:border-[#E67E6B] placeholder:text-[#A3938F] px-4 py-3 outline-none font-work-sans"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] font-semibold text-[#6B5C58] font-work-sans mb-2">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            data-testid="login-password-input"
            className="w-full bg-white border border-[#F5EBE9] rounded-xl focus:ring-2 focus:ring-[#E67E6B]/30 focus:border-[#E67E6B] placeholder:text-[#A3938F] px-4 py-3 outline-none font-work-sans"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          data-testid="login-submit-button"
          className="w-full bg-[#E67E6B] text-white hover:bg-[#D96C5A] disabled:opacity-60 px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 font-work-sans font-medium inline-flex items-center justify-center gap-2 cursor-pointer"
        >
          {busy ? (
            "Signing in…"
          ) : (
            <>
              Sign in <ArrowRight size={16} strokeWidth={1.5} />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-sm text-[#6B5C58] font-work-sans">
        New here?{" "}
        <Link
          to="/signup"
          className="text-[#E67E6B] hover:text-[#D96C5A] font-medium"
          data-testid="login-to-signup-link"
        >
          Create an account
        </Link>
      </p>
    </AuthSplit>
  );
}
