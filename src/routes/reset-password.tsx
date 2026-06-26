import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Coffee, ArrowRight, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Update Password — Indie Coffee Hub" },
      { name: "description", content: "Enter your new password." },
    ],
  }),
  component: ResetPassword,
});

function AuthSplit({ side, children }: { side: "left" | "right"; children: React.ReactNode }) {
  const Image = (
    <div className="hidden lg:block relative p-6">
      <div className="h-full w-full rounded-[2rem] overflow-hidden relative">
        <img
          src="https://res.cloudinary.com/daon1coiv/image/upload/v1781927933/Cover_Image_1_sh6d4g.png"
          alt="Indie Coffee Hub cover"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-cafe-footer/70 via-cafe-footer/20 to-transparent p-10 flex flex-col justify-end">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white font-outfit text-xl font-medium"
          >
            <Coffee strokeWidth={1.5} /> Indie Coffee Hub
          </Link>
          <p className="mt-4 text-white/85 font-outfit text-3xl leading-tight max-w-sm">
            Set your new credentials.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cafe-bg grid lg:grid-cols-2">
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

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    // Confirm user session is active (Supabase automatically signs in users arriving via recovery URL hash params)
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        setError("Your reset session has expired or is invalid. Please trigger a new recovery link.");
      }
      setCheckingSession(false);
    });
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) return;
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    
    setBusy(true);
    setError(null);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });
      if (updateError) throw updateError;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to update your password.");
    } finally {
      setBusy(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-cafe-bg flex items-center justify-center font-work-sans">
        <div className="text-center">
          <p className="text-sm text-cafe-body">Verifying secure session...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthSplit side="left">
      <Link
        to="/"
        className="lg:hidden inline-flex items-center gap-2 text-cafe-heading font-outfit text-xl font-medium mb-8"
      >
        <Coffee strokeWidth={1.5} className="text-cafe-primary" /> Indie Coffee Hub
      </Link>
      <p className="text-xs uppercase tracking-[0.2em] font-semibold text-cafe-primary font-work-sans">
        Security Portal
      </p>
      <h1 className="mt-3 text-4xl tracking-tight font-light text-cafe-heading font-outfit">
        Set New Password
      </h1>
      <p className="mt-3 text-cafe-body font-work-sans">
        Create a new secure password for your account.
      </p>

      {success ? (
        <div className="mt-8 p-6 bg-emerald-50 border border-emerald-100 rounded-3xl text-emerald-800 font-work-sans">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3">
            <Check size={20} />
          </div>
          <h3 className="font-semibold text-base font-outfit">Password updated</h3>
          <p className="text-sm mt-1 leading-relaxed opacity-90">
            Your password was changed successfully. You can now use your new credentials to sign in.
          </p>
          <button
            onClick={() => navigate({ to: "/login" })}
            className="mt-6 w-full bg-cafe-primary text-white hover:bg-cafe-primary-hover px-6 py-3 rounded-xl font-work-sans font-medium inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            Go to login <ArrowRight size={14} />
          </button>
        </div>
      ) : (
        <>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-work-sans">
              {error}
            </div>
          )}

          <form className="mt-10 space-y-5" onSubmit={submit}>
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] font-semibold text-cafe-body font-work-sans mb-2">
                New Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-cafe-surface border border-cafe-border rounded-xl focus:ring-2 focus:ring-cafe-primary/30 focus:border-cafe-primary placeholder:text-cafe-muted px-4 py-3 outline-none font-work-sans"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] font-semibold text-cafe-body font-work-sans mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-cafe-surface border border-cafe-border rounded-xl focus:ring-2 focus:ring-cafe-primary/30 focus:border-cafe-primary placeholder:text-cafe-muted px-4 py-3 outline-none font-work-sans"
              />
            </div>
            <button
              type="submit"
              disabled={busy || !password || !confirmPassword || !!error}
              className="w-full bg-cafe-primary text-white hover:bg-cafe-primary-hover disabled:opacity-60 px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 font-work-sans font-medium inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              {busy ? "Updating..." : "Update Password"}
            </button>
          </form>
        </>
      )}
    </AuthSplit>
  );
}
