import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Coffee, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Join Free — Indie Cafe Hub" },
      { name: "description", content: "Create a free account to save cafes and post notes." },
    ],
  }),
  component: SignUp,
});

function SignUp() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setBusy(true);
    try {
      await signUp(email, password, name);
      navigate({ to: "/" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7F5] grid lg:grid-cols-2">
      <div className="hidden lg:block relative p-6">
        <div
          className="h-full w-full rounded-[2rem] overflow-hidden"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1613274554329-70f997f5789f?w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="h-full w-full bg-gradient-to-tr from-[#2D2422]/45 via-transparent to-transparent p-10 flex flex-col justify-end">
            <Link to="/" className="inline-flex items-center gap-2 text-white font-outfit text-xl font-medium">
              <Coffee strokeWidth={1.5} /> Indie Cafe Hub
            </Link>
            <p className="mt-4 text-white/85 font-outfit text-3xl leading-tight max-w-sm">
              Build your own little map of Bengaluru.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 text-[#2D2422] font-outfit text-xl font-medium mb-8">
            <Coffee strokeWidth={1.5} className="text-[#E67E6B]" /> Indie Cafe Hub
          </Link>
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#E67E6B] font-work-sans">Join free</p>
          <h1 className="mt-3 text-4xl tracking-tight font-light text-[#2D2422] font-outfit">Create your account</h1>
          <p className="mt-3 text-[#6B5C58] font-work-sans">Save cafes, leave notes, build your list.</p>

          <form className="mt-10 space-y-5" onSubmit={submit} data-testid="signup-form">
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] font-semibold text-[#6B5C58] font-work-sans mb-2">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                data-testid="signup-name-input"
                className="w-full bg-white border border-[#F5EBE9] rounded-xl focus:ring-2 focus:ring-[#E67E6B]/30 focus:border-[#E67E6B] placeholder:text-[#A3938F] px-4 py-3 outline-none font-work-sans"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] font-semibold text-[#6B5C58] font-work-sans mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                data-testid="signup-email-input"
                className="w-full bg-white border border-[#F5EBE9] rounded-xl focus:ring-2 focus:ring-[#E67E6B]/30 focus:border-[#E67E6B] placeholder:text-[#A3938F] px-4 py-3 outline-none font-work-sans"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] font-semibold text-[#6B5C58] font-work-sans mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                data-testid="signup-password-input"
                className="w-full bg-white border border-[#F5EBE9] rounded-xl focus:ring-2 focus:ring-[#E67E6B]/30 focus:border-[#E67E6B] placeholder:text-[#A3938F] px-4 py-3 outline-none font-work-sans"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              data-testid="signup-submit-button"
              className="w-full bg-[#E67E6B] text-white hover:bg-[#D96C5A] disabled:opacity-60 px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 font-work-sans font-medium inline-flex items-center justify-center gap-2"
            >
              {busy ? "Creating account…" : <>Create account <ArrowRight size={16} strokeWidth={1.5} /></>}
            </button>
          </form>

          <p className="mt-8 text-sm text-[#6B5C58] font-work-sans">
            Already have an account?{" "}
            <Link to="/login" className="text-[#E67E6B] hover:text-[#D96C5A] font-medium" data-testid="signup-to-login-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
