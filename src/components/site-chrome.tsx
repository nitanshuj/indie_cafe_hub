import { Link } from "@tanstack/react-router";
import { Coffee, MapPin, User, LayoutDashboard, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";

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
        className="w-9 h-9 rounded-full bg-[#FDE4DD] text-[#E67E6B] inline-flex items-center justify-center font-medium font-work-sans hover:ring-2 hover:ring-[#E67E6B]/30 transition-all"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {initial}
      </button>
      {open && (
        <div
          className="absolute right-0 mt-2 w-56 bg-white border border-[#F5EBE9] rounded-2xl shadow-[0_12px_40px_rgba(230,126,107,0.08)] py-2 z-50"
          data-testid="header-avatar-menu"
        >
          <div className="px-4 py-2 border-b border-[#F5EBE9]">
            <p className="text-sm font-medium text-[#2D2422] font-outfit truncate">{user.name}</p>
            <p className="text-xs text-[#A3938F] font-work-sans truncate">{user.email}</p>
          </div>
          <button
            type="button"
            className="w-full text-left px-4 py-2 text-sm text-[#6B5C58] hover:bg-[#FFF7F5] font-work-sans inline-flex items-center gap-2"
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
            className="w-full text-left px-4 py-2 text-sm text-[#6B5C58] hover:bg-[#FFF7F5] font-work-sans inline-flex items-center gap-2"
          >
            <LogOut size={14} strokeWidth={1.5} /> Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

export function Header() {
  return (
    <header
      className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-[#F5EBE9] backdrop-saturate-150 shadow-sm"
      data-testid="site-header"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-[#2D2422] font-outfit text-xl font-medium"
          data-testid="header-logo-link"
        >
          <Coffee strokeWidth={1.5} className="text-[#E67E6B]" />
          <span>Indie Cafe Hub</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-5 text-sm font-work-sans">
          <div className="hidden md:flex items-center gap-1.5 text-[#A3938F]">
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
            <span>Indie Cafe Hub</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/60 max-w-xs font-work-sans">
            A small, hand-picked directory of independent specialty cafes across Bengaluru.
          </p>
        </div>
        <div className="text-sm font-work-sans">
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#E67E6B]">Explore</p>
          <ul className="mt-4 space-y-2">
            <li><Link to="/directory" className="hover:text-white" data-testid="footer-directory-link">All cafes</Link></li>
            <li><span className="text-white/40">Indiranagar</span></li>
            <li><span className="text-white/40">Koramangala</span></li>
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
          © {new Date().getFullYear()} Indie Cafe Hub. Bengaluru.
        </p>
      </div>
    </footer>
  );
}
