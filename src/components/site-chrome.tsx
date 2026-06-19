import { Link } from "@tanstack/react-router";
import { Coffee, MapPin, User, LayoutDashboard, LogOut, Zap, Globe, RefreshCw, Layers } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getDeliveryStrategy, setDeliveryStrategy, DeliveryStrategy } from "@/lib/cache";

function AuthArea() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!user) {
    return (
      <div className="flex items-center gap-2" data-testid="auth-buttons">
        <Link
          to="/login"
          data-testid="header-signin-link"
          className="text-sm text-[#6B5C58] hover:text-[#2D2422] px-3 py-2 rounded-xl transition-colors font-work-sans"
        >
          Sign In
        </Link>
        <Link
          to="/signup"
          data-testid="header-signup-link"
          className="text-sm bg-[#E67E6B] text-white hover:bg-[#D96C5A] px-4 py-2 rounded-xl transition-all duration-200 hover:-translate-y-0.5 font-work-sans font-medium"
        >
          Join Free
        </Link>
      </div>
    );
  }

  const initial = (user.name || user.email).charAt(0).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        data-testid="header-avatar-button"
        className="w-9 h-9 rounded-full bg-[#FDE4DD] text-[#E67E6B] inline-flex items-center justify-center font-medium font-work-sans hover:ring-2 hover:ring-[#E67E6B]/30 transition-all cursor-pointer"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {initial}
      </button>
      {open && (
        <div
          className="absolute right-0 mt-2 w-56 bg-white border border-[#F5EBE9] rounded-2xl shadow-[0_12px_40px_rgba(230,126,107,0.08)] py-2 z-50 animate-fade-in"
          data-testid="header-avatar-menu"
        >
          <div className="px-4 py-2 border-b border-[#F5EBE9]">
            {user.isAdmin && (
              <p className="text-xs font-bold text-[#E67E6B] mb-1 font-outfit" data-testid="menu-welcome-admin">
                Welcome Admin
              </p>
            )}
            <p className="text-sm font-medium text-[#2D2422] font-outfit truncate">{user.name}</p>
            <p className="text-xs text-[#A3938F] font-work-sans truncate">{user.email}</p>
          </div>
          <button
            type="button"
            className="w-full text-left px-4 py-2 text-sm text-[#6B5C58] hover:bg-[#FFF7F5] font-work-sans inline-flex items-center gap-2 cursor-pointer"
          >
            <User size={14} strokeWidth={1.5} /> Profile
          </button>
          {user.isAdmin && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              data-testid="header-admin-link"
              className="block px-4 py-2 text-sm text-[#6B5C58] hover:bg-[#FFF7F5] font-work-sans"
            >
              <span className="inline-flex items-center gap-2">
                <LayoutDashboard size={14} strokeWidth={1.5} /> Admin Dashboard
              </span>
            </Link>
          )}
          <button
            type="button"
            onClick={() => {
              signOut();
              setOpen(false);
            }}
            data-testid="header-signout-button"
            className="w-full text-left px-4 py-2 text-sm text-[#6B5C58] hover:bg-[#FFF7F5] font-work-sans inline-flex items-center gap-2 cursor-pointer"
          >
            <LogOut size={14} strokeWidth={1.5} /> Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const { user } = useAuth();
  const [strategy, setStrategy] = useState<DeliveryStrategy>("dynamic");
  const [webhookStatus, setWebhookStatus] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    setStrategy(getDeliveryStrategy());
    const handleStrategyChange = () => {
      setStrategy(getDeliveryStrategy());
    };
    window.addEventListener("delivery-strategy-change", handleStrategyChange);

    const handleWebhookTrigger = (e: Event) => {
      const customEvent = e as CustomEvent;
      const cafeName = customEvent.detail?.cafeName || "New Cafe";
      
      setWebhookStatus(`[ISR Webhook] Triggered page invalidation for "${cafeName}"...`);
      setTimeout(() => {
        setWebhookStatus(`[ISR Webhook] Generating lightweight WebP optimized layouts...`);
      }, 1000);
      setTimeout(() => {
        setWebhookStatus(`[ISR Webhook] Swapping pre-cached static HTML at Bengaluru Edge CDN!`);
      }, 2200);
      setTimeout(() => {
        setWebhookStatus(null);
      }, 3500);
    };

    window.addEventListener("isr-webhook-trigger", handleWebhookTrigger);

    return () => {
      window.removeEventListener("delivery-strategy-change", handleStrategyChange);
      window.removeEventListener("isr-webhook-trigger", handleWebhookTrigger);
    };
  }, []);

  const toggleStrategy = () => {
    const next: DeliveryStrategy = strategy === "dynamic" ? "isr" : "dynamic";
    setDeliveryStrategy(next);
  };

  return (
    <header
      className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-[#F5EBE9] backdrop-saturate-150 shadow-sm"
      data-testid="site-header"
    >
      {/* Webhook Simulator Notification Bar */}
      {webhookStatus && (
        <div className="bg-[#E67E6B] text-white py-2.5 px-6 text-center text-xs font-semibold font-work-sans animate-fade-in flex items-center justify-center gap-2.5 z-[100] relative">
          <RefreshCw size={14} className="animate-spin text-white" />
          <span>{webhookStatus}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-[#2D2422] font-outfit text-xl font-medium"
          data-testid="header-logo-link"
        >
          <Coffee strokeWidth={1.5} className="text-[#E67E6B]" />
          <span>Indie Coffee Hub</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4 text-sm font-work-sans">
          {/* Strategy Toggle - Admin Only */}
          {user && user.isAdmin && (
            <div className="relative flex items-center gap-1.5 mr-2">
              <button
                onClick={toggleStrategy}
                title="Toggle Delivery Strategy"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium font-work-sans transition-all cursor-pointer ${
                  strategy === "isr"
                    ? "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                    : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                }`}
              >
                {strategy === "isr" ? (
                  <>
                    <Layers size={13} className="text-purple-600 animate-pulse" />
                    <span className="hidden sm:inline">Strategy:</span> On-Demand ISR
                  </>
                ) : (
                  <>
                    <Globe size={13} className="text-emerald-600 animate-pulse" />
                    <span className="hidden sm:inline">Strategy:</span> Dynamic SSR
                  </>
                )}
              </button>
              
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="text-[#A3938F] hover:text-[#2D2422] p-1 rounded-full text-xs font-semibold cursor-pointer border border-[#F5EBE9] h-5 w-5 inline-flex items-center justify-center"
                title="What is this?"
              >
                ?
              </button>

              {showExplanation && (
                <div className="absolute right-0 top-10 mt-1 w-80 bg-white border border-[#F5EBE9] rounded-2xl shadow-[0_12px_40px_rgba(45,36,34,0.12)] p-4 z-[999] text-[#2D2422] animate-fade-up">
                  <h3 className="font-outfit font-medium text-sm border-b border-[#F5EBE9] pb-2 mb-2 flex items-center justify-between">
                    <span>Data Strategy Simulator</span>
                    <button onClick={() => setShowExplanation(false)} className="text-xs text-[#A3938F] hover:text-[#2D2422]">Close</button>
                  </h3>
                  <div className="space-y-3 text-xs font-work-sans text-[#6B5C58]">
                    <div>
                      <span className="font-semibold text-emerald-700">🟢 Dynamic SSR:</span>
                      <p className="mt-0.5">Queries live database on every single page load. Extremely fresh, but hits the database each time.</p>
                    </div>
                    <div>
                      <span className="font-semibold text-purple-700">⚡ On-Demand ISR:</span>
                      <p className="mt-0.5">Serves pre-cached static HTML instantly. When you save in Admin, a background webhook invalidates the cache and rebuilds the static pages silently.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="hidden lg:flex items-center gap-1.5 text-[#A3938F]">
            <MapPin size={16} strokeWidth={1.5} />
            <span>Bengaluru</span>
          </div>
          <Link
            to="/"
            className="hidden sm:inline text-[#6B5C58] hover:text-[#2D2422] transition-colors"
            activeProps={{ className: "text-[#2D2422] font-medium" }}
            activeOptions={{ exact: true }}
            data-testid="nav-home-link"
          >
            Home
          </Link>
          <Link
            to="/directory"
            className="text-[#6B5C58] hover:text-[#2D2422] transition-colors"
            activeProps={{ className: "text-[#2D2422] font-medium" }}
            data-testid="nav-directory-link"
          >
            Directory
          </Link>
          <span className="hidden sm:inline-block w-px h-5 bg-[#F5EBE9]" />
          <AuthArea />
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#2D2422] text-white/80 mt-24" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-6 py-16 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 text-white font-outfit text-xl font-medium">
            <Coffee strokeWidth={1.5} className="text-[#E67E6B]" />
            <span>Indie Coffee Hub</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/60 max-w-xs font-work-sans">
            A small, hand-picked directory of independent specialty cafes across Bengaluru.
          </p>
        </div>
        <div className="text-sm font-work-sans">
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#E67E6B]">Explore</p>
          <ul className="mt-4 space-y-2">
            <li>
              <Link
                to="/directory"
                className="hover:text-white"
                data-testid="footer-directory-link"
              >
                All cafes
              </Link>
            </li>
            <li>
              <span className="text-white/40">Indiranagar</span>
            </li>
            <li>
              <span className="text-white/40">Koramangala</span>
            </li>
          </ul>
        </div>
        <div className="text-sm font-work-sans">
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#E67E6B]">About</p>
          <p className="mt-4 text-white/60 leading-relaxed">
            Built with care for nomads, freelancers, and the people who keep these places running.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="max-w-7xl mx-auto px-6 py-6 text-xs text-white/40 font-work-sans">
          © {new Date().getFullYear()} Indie Coffee Hub. Bengaluru.
        </p>
      </div>
    </footer>
  );
}
