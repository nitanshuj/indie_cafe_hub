import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Coffee, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Join Free — Indie Coffee Hub" },
      { name: "description", content: "Create a free account to save cafes and post notes." },
    ],
  }),
  component: SignUp,
});
function SignUp() {
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setBusy(true);
    setError(null);
    try {
      await signUp(email, password, name);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred during sign up.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-cafe-bg grid lg:grid-cols-2">
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
              Build your own little map of Bengaluru.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="lg:hidden inline-flex items-center gap-2 text-cafe-heading font-outfit text-xl font-medium mb-8"
          >
            <Coffee strokeWidth={1.5} className="text-cafe-primary" /> Indie Coffee Hub
          </Link>

          {success ? (
            <div className="mt-8 bg-cafe-surface border border-cafe-border rounded-[2rem] p-8 text-center shadow-sm font-work-sans">
              <div className="mx-auto w-14 h-14 rounded-full bg-cafe-open-bg inline-flex items-center justify-center text-cafe-open-text mb-6">
                <Coffee strokeWidth={1.5} />
              </div>
              <h2 className="text-3xl font-outfit text-cafe-heading font-light tracking-tight">
                Verify your email
              </h2>
              <p className="mt-4 text-cafe-body leading-relaxed text-sm">
                We've sent a verification link to{" "}
                <strong className="text-cafe-heading">{email}</strong>. Please check your inbox and
                verify your email address to complete your registration.
              </p>
              <Link
                to="/login"
                className="mt-8 w-full bg-cafe-primary text-white hover:bg-cafe-primary-hover px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 font-medium inline-flex items-center justify-center gap-2"
              >
                Go to Sign in
              </Link>
            </div>
          ) : (
            <>
              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-cafe-primary font-work-sans">
                Join free
              </p>
              <h1 className="mt-3 text-4xl tracking-tight font-light text-cafe-heading font-outfit">
                Create your account
              </h1>
              <p className="mt-3 text-cafe-body font-work-sans">
                Save cafes, leave notes, build your list.
              </p>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-work-sans">
                  {error}
                </div>
              )}

              <form className="mt-10 space-y-5" onSubmit={submit} data-testid="signup-form">
                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] font-semibold text-cafe-body font-work-sans mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    data-testid="signup-name-input"
                    className="w-full bg-cafe-surface border border-cafe-border rounded-xl focus:ring-2 focus:ring-cafe-primary/30 focus:border-cafe-primary placeholder:text-cafe-muted px-4 py-3 outline-none font-work-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] font-semibold text-cafe-body font-work-sans mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    data-testid="signup-email-input"
                    className="w-full bg-cafe-surface border border-cafe-border rounded-xl focus:ring-2 focus:ring-cafe-primary/30 focus:border-cafe-primary placeholder:text-cafe-muted px-4 py-3 outline-none font-work-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] font-semibold text-cafe-body font-work-sans mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    data-testid="signup-password-input"
                    className="w-full bg-cafe-surface border border-cafe-border rounded-xl focus:ring-2 focus:ring-cafe-primary/30 focus:border-cafe-primary placeholder:text-cafe-muted px-4 py-3 outline-none font-work-sans"
                  />
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  data-testid="signup-submit-button"
                  className="w-full bg-cafe-primary text-white hover:bg-cafe-primary-hover disabled:opacity-60 px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 font-work-sans font-medium inline-flex items-center justify-center gap-2"
                >
                  {busy ? (
                    "Creating account…"
                  ) : (
                    <>
                      Create account <ArrowRight size={16} strokeWidth={1.5} />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-8 text-sm text-cafe-body font-work-sans">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-cafe-primary hover:text-cafe-primary-hover font-medium"
                  data-testid="signup-to-login-link"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
