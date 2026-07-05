import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Coffee, MapPin, User, LayoutDashboard, LogOut, Zap, Globe, RefreshCw, Layers, Compass, Eye, EyeOff, Sparkles, Menu, X, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { getDeliveryStrategy, setDeliveryStrategy, DeliveryStrategy } from "@/lib/cache";
import { useAccessibility } from "./accessibility-context";

function AuthArea({ onOpenProfile }: { onOpenProfile: () => void }) {
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
          className="text-sm text-cafe-body hover:text-cafe-heading px-3 py-2 rounded-xl transition-colors font-work-sans"
        >
          Sign In
        </Link>
        <Link
          to="/signup"
          data-testid="header-signup-link"
          className="text-sm bg-cafe-primary text-white hover:bg-cafe-primary-hover px-4 py-2 rounded-xl transition-all duration-200 hover:-translate-y-0.5 font-work-sans font-medium"
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
        className="w-9 h-9 rounded-full bg-cafe-primary-light text-cafe-primary inline-flex items-center justify-center font-medium font-work-sans hover:ring-2 hover:ring-cafe-primary/30 transition-all cursor-pointer"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {initial}
      </button>
      {open && (
        <div
          className="absolute right-0 mt-2 w-56 bg-cafe-surface border border-cafe-border rounded-2xl shadow-[0_12px_40px_var(--cafe-primary-alpha-08)] py-2 z-50 animate-fade-in"
          data-testid="header-avatar-menu"
        >
          <div className="px-4 py-2 border-b border-cafe-border">
            {user.isAdmin && (
              <p className="text-xs font-bold text-cafe-primary mb-1 font-outfit" data-testid="menu-welcome-admin">
                Welcome Admin
              </p>
            )}
            <p className="text-sm font-medium text-cafe-heading font-outfit truncate">{user.name}</p>
            <p className="text-xs text-cafe-muted font-work-sans truncate">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              onOpenProfile();
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-cafe-body hover:bg-cafe-bg font-work-sans inline-flex items-center gap-2 cursor-pointer"
          >
            <User size={14} strokeWidth={1.5} /> Profile
          </button>
           <Link
            to="/my-submissions"
            onClick={() => setOpen(false)}
            data-testid="header-my-submissions-link"
            className="block px-4 py-2 text-sm text-cafe-body hover:bg-cafe-bg font-work-sans"
          >
            <span className="inline-flex items-center gap-2">
              <Coffee size={14} strokeWidth={1.5} /> Submitted Cafes
            </span>
          </Link>
          {user.isAdmin && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              data-testid="header-admin-link"
              className="block px-4 py-2 text-sm text-cafe-body hover:bg-cafe-bg font-work-sans"
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
            className="w-full text-left px-4 py-2 text-sm text-cafe-body hover:bg-cafe-bg font-work-sans inline-flex items-center gap-2 cursor-pointer"
          >
            <LogOut size={14} strokeWidth={1.5} /> Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

import { useNavigate } from "@tanstack/react-router";
import { fetchCities, City } from "@/lib/cafes";

export function Header() {
  const { user, signOut, updateProfileName } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { accessibilityMode, setAccessibilityMode } = useAccessibility();
  const [strategy, setStrategy] = useState<DeliveryStrategy>("dynamic");
  const [webhookStatus, setWebhookStatus] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Profile modal state
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState(user?.name || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action is permanent. Your submitted cafes and comments will remain, but will be unattributed."
    );
    if (!confirmed) return;

    setDeletingAccount(true);
    try {
      const { error } = await supabase.rpc("delete_current_user");
      if (error) throw error;

      toast.success("Account successfully deleted.");
      setProfileModalOpen(false);
      await signOut();
      void navigate({ to: "/" });
    } catch (err: any) {
      console.error("Account deletion failed:", err);
      toast.error(err.message || "Failed to delete account");
    } finally {
      setDeletingAccount(false);
    }
  };

  useEffect(() => {
    if (user?.name) {
      setNewProfileName(user.name);
    }
  }, [user?.name]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setSavingProfile(true);
    try {
      await updateProfileName(newProfileName.trim());
      toast.success("Profile updated successfully!");
      setProfileModalOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  // City selection state
  const [cities, setCities] = useState<City[]>([]);
  const [activeCity, setActiveCity] = useState<City | null>(null);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const cityRef = useRef<HTMLDivElement>(null);

  // Auto-detect prompt state
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [detecting, setDetecting] = useState(false);

  // Onboarding tooltip state
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem("has-seen-accessibility-tooltip");
    if (!hasSeen) {
      setShowTooltip(true);
    }
  }, []);

  const dismissTooltip = () => {
    setShowTooltip(false);
    localStorage.setItem("has-seen-accessibility-tooltip", "true");
  };

  // Pre-configured coordinates for seeded cities to calculate distance
  const cityCenters: Record<string, { lat: number; lng: number }> = {
    bengaluru: { lat: 12.9716, lng: 77.5946 },
    haldwani: { lat: 29.2183, lng: 79.5130 },
    seattle: { lat: 47.6062, lng: -122.3321 },
    "san-jose": { lat: 37.3382, lng: -121.8863 },
    "san-francisco": { lat: 37.7749, lng: -122.4194 },
    bloomington: { lat: 39.1653, lng: -86.5264 }
  };

  useEffect(() => {
    // Click outside handler for city dropdown
    const onClick = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setCityDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    getDeliveryStrategy().then(setStrategy);
    const handleStrategyChange = () => {
      getDeliveryStrategy().then(setStrategy);
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

    // Fetch cities list dynamically
    const loadCitiesData = async () => {
      try {
        const data = await fetchCities();
        setCities(data);

        // Auto-detect active city based on current URL path
        const path = window.location.pathname; // e.g. /in/bengaluru/...
        const parts = path.split("/").filter(Boolean);
        if (parts.length >= 2) {
          const matchingCity = data.find(c => c.slug === parts[1]);
          if (matchingCity) {
            setActiveCity(matchingCity);
          }
        }
      } catch (err) {
        console.error("Failed to load cities", err);
      }
    };
    void loadCitiesData();

    // Geolocation prompt check
    const promptStatus = localStorage.getItem("location-prompt-status");
    if (!promptStatus) {
      // First visit, show prompt after a short delay
      const timer = setTimeout(() => {
        setShowLocationPrompt(true);
      }, 1500);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener("delivery-strategy-change", handleStrategyChange);
      window.removeEventListener("isr-webhook-trigger", handleWebhookTrigger);
    };
  }, []);

  const toggleStrategy = async () => {
    const next: DeliveryStrategy = strategy === "dynamic" ? "isr" : "dynamic";
    await setDeliveryStrategy(next);
  };

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleAutoDetect = (silently = false) => {
    if (!navigator.geolocation) {
      if (!silently) toast.error("Geolocation not supported");
      return;
    }

    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const uLat = position.coords.latitude;
        const uLng = position.coords.longitude;

        let closestCity: City | null = null;
        let minDistance = Infinity;

        // Iterate through all fetched cities to locate the closest one
        cities.forEach((city) => {
          const coords = cityCenters[city.slug];
          if (coords) {
            const dist = getDistance(uLat, uLng, coords.lat, coords.lng);
            if (dist < minDistance) {
              minDistance = dist;
              closestCity = city;
            }
          }
        });

        setDetecting(false);
        setShowLocationPrompt(false);
        localStorage.setItem("location-prompt-status", "accepted");

        if (closestCity) {
          const cityObj = closestCity as City;
          setActiveCity(cityObj);
          toast.success(`Nearest city detected: ${cityObj.name}! Routing you now...`);
          // Navigate to closest city landing page
          void navigate({
            to: `/$country/$city`,
            params: {
              country: cityObj.country?.code?.toLowerCase() || "in",
              city: cityObj.slug,
            },
          });
        } else {
          toast.info("Could not map your position to a supported city. Defaulting to Bengaluru.");
        }
      },
      (error) => {
        console.error(error);
        setDetecting(false);
        if (!silently) toast.error("Could not fetch location permission.");
      }
    );
  };

  const dismissPrompt = () => {
    setShowLocationPrompt(false);
    localStorage.setItem("location-prompt-status", "dismissed");
  };

  const handleCitySelect = (city: City) => {
    setActiveCity(city);
    setCityDropdownOpen(false);
    void navigate({
      to: `/$country/$city`,
      params: {
        country: city.country?.code?.toLowerCase() || "in",
        city: city.slug,
      },
    });
  };

  const filteredDropdownCities = cities.filter((city) =>
    city.name.toLowerCase().includes(citySearchQuery.toLowerCase()) ||
    (city.country?.name || "").toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  const groupedCities = useMemo(() => {
    const groups: Record<string, City[]> = {};
    filteredDropdownCities.forEach((city) => {
      const countryName = city.country?.name || "India";
      if (!groups[countryName]) {
        groups[countryName] = [];
      }
      groups[countryName].push(city);
    });
    return groups;
  }, [filteredDropdownCities]);


  const mobileAuth = user ? (
    <div className="border-t border-cafe-border pt-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-cafe-primary-light text-cafe-primary inline-flex items-center justify-center font-medium font-work-sans">
          {(user.name || user.email).charAt(0).toUpperCase()}
        </div>
        <div>
          {user.isAdmin && (
            <p className="text-[10px] font-bold text-cafe-primary tracking-wider uppercase font-outfit" data-testid="menu-welcome-admin">
              Admin
            </p>
          )}
          <p className="text-xs font-semibold text-cafe-heading font-outfit">{user.name}</p>
          <p className="text-[10px] text-cafe-muted font-work-sans truncate max-w-[160px]">{user.email}</p>
        </div>
      </div>
      <div className="space-y-2">
        <Link
          to="/my-submissions"
          onClick={() => setIsMobileMenuOpen(false)}
          className="flex items-center gap-2 text-xs text-cafe-body hover:text-cafe-heading py-1 font-medium font-work-sans"
        >
          <Coffee size={13} strokeWidth={1.5} /> Submitted Cafes
        </Link>
        {user.isAdmin && (
          <Link
            to="/admin"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2 text-xs text-cafe-body hover:text-cafe-heading py-1 font-medium font-work-sans"
          >
            <LayoutDashboard size={13} strokeWidth={1.5} /> Admin Dashboard
          </Link>
        )}
        <button
          type="button"
          onClick={() => {
            setProfileModalOpen(true);
            setIsMobileMenuOpen(false);
          }}
          className="flex items-center gap-2 text-xs text-cafe-body hover:text-cafe-heading py-1 font-medium font-work-sans w-full text-left cursor-pointer"
        >
          <User size={13} strokeWidth={1.5} /> Profile
        </button>
        <button
          onClick={() => {
            signOut();
            setIsMobileMenuOpen(false);
          }}
          className="flex items-center gap-2 text-xs text-rose-600 py-1 font-semibold font-work-sans w-full text-left cursor-pointer"
        >
          <LogOut size={13} strokeWidth={1.5} /> Sign Out
        </button>
      </div>
    </div>
  ) : (
    <div className="flex flex-col gap-2 pt-4 border-t border-cafe-border">
      <Link
        to="/login"
        onClick={() => setIsMobileMenuOpen(false)}
        className="w-full text-center py-2 rounded-xl border border-cafe-border text-cafe-heading hover:bg-cafe-bg font-medium text-xs font-work-sans transition-colors"
      >
        Sign In
      </Link>
      <Link
        to="/signup"
        onClick={() => setIsMobileMenuOpen(false)}
        className="w-full text-center py-2 rounded-xl bg-cafe-primary text-white hover:bg-cafe-primary-hover font-medium text-xs font-work-sans transition-all duration-200"
      >
        Join Free
      </Link>
    </div>
  );

  return (
    <header
      className="sticky top-0 z-50 bg-cafe-bg border-b border-[#1A1715]"
      data-testid="site-header"
    >
      {/* SVG Daltonization correction filters */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="protanopia-correction">
            <feColorMatrix
              type="matrix"
              values="
                0.567 0.433 0.000 0.000 0.000
                0.558 0.442 0.000 0.000 0.000
                0.000 0.242 0.758 0.000 0.000
                0.000 0.000 0.000 1.000 0.000
              "
            />
          </filter>
          <filter id="deuteranopia-correction">
            <feColorMatrix
              type="matrix"
              values="
                0.625 0.375 0.000 0.000 0.000
                0.700 0.300 0.000 0.000 0.000
                0.000 0.300 0.700 0.000 0.000
                0.000 0.000 0.000 1.000 0.000
              "
            />
          </filter>
          <filter id="tritanopia-correction">
            <feColorMatrix
              type="matrix"
              values="
                0.950 0.050 0.000 0.000 0.000
                0.000 0.433 0.567 0.000 0.000
                0.000 0.475 0.525 0.000 0.000
                0.000 0.000 0.000 1.000 0.000
              "
            />
          </filter>
        </defs>
      </svg>

      {/* Geolocation first-visit prompt bar */}
      {showLocationPrompt && (
        <div className="bg-cafe-bg border-b border-cafe-border py-3 px-6 animate-fade-in flex flex-col sm:flex-row items-center justify-between gap-3 text-sm z-[110] relative">
          <div className="flex items-center gap-2 text-cafe-heading font-work-sans">
            <Compass className="text-cafe-primary w-4 h-4 animate-pulse" />
            <span>Would you like to auto-detect your nearest city directory?</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAutoDetect()}
              disabled={detecting}
              className="bg-cafe-primary text-white hover:bg-cafe-primary-hover px-4 py-1.5 rounded-xl font-medium text-xs transition-colors"
            >
              {detecting ? "Locating..." : "Use My Location"}
            </button>
            <button
              onClick={dismissPrompt}
              className="text-cafe-body hover:text-cafe-heading border border-cafe-border px-4 py-1.5 rounded-xl text-xs bg-cafe-surface transition-colors"
            >
              No thanks
            </button>
          </div>
        </div>
      )}

      {/* Webhook Simulator Notification Bar */}
      {webhookStatus && (
        <div className="bg-cafe-primary text-white py-2.5 px-6 text-center text-xs font-semibold font-work-sans animate-fade-in flex items-center justify-center gap-2.5 z-[100] relative">
          <RefreshCw size={14} className="animate-spin text-white" />
          <span>{webhookStatus}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-cafe-heading font-outfit text-xl font-medium"
          data-testid="header-logo-link"
        >
          <Coffee strokeWidth={1.5} className="text-cafe-primary" />
          <span>Indie Coffee Hub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-2 sm:gap-4 text-sm font-work-sans">
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
                className="text-cafe-muted hover:text-cafe-heading p-1 rounded-full text-xs font-semibold cursor-pointer border border-cafe-border h-5 w-5 inline-flex items-center justify-center"
                title="What is this?"
              >
                ?
              </button>

              {showExplanation && (
                <div className="absolute right-0 top-10 mt-1 w-80 bg-cafe-surface border border-cafe-border rounded-2xl shadow-[0_12px_40px_rgba(45,36,34,0.12)] p-4 z-[999] text-cafe-heading animate-fade-up">
                  <h3 className="font-outfit font-medium text-sm border-b border-cafe-border pb-2 mb-2 flex items-center justify-between">
                    <span>Data Strategy Simulator</span>
                    <button onClick={() => setShowExplanation(false)} className="text-xs text-cafe-muted hover:text-cafe-heading">Close</button>
                  </h3>
                  <div className="space-y-3 text-xs font-work-sans text-cafe-body">
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

          {/* Searchable Glassmorphic City Dropdown */}
          <div className="relative" ref={cityRef}>
            <button
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cafe-border bg-cafe-surface/50 text-cafe-heading hover:bg-cafe-surface text-xs font-semibold font-work-sans transition-all cursor-pointer"
            >
              <MapPin size={14} className="text-cafe-primary" />
              <span>{activeCity ? activeCity.name : "Select City"}</span>
            </button>

            {cityDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-cafe-surface border border-cafe-border rounded-2xl shadow-[0_12px_40px_rgba(45,36,34,0.12)] p-2 z-50 animate-fade-in">
                <input
                  type="text"
                  placeholder="Search cities..."
                  value={citySearchQuery}
                  onChange={(e) => setCitySearchQuery(e.target.value)}
                  className="w-full bg-cafe-bg border border-cafe-border rounded-xl px-3 py-1.5 text-xs outline-none mb-2 font-work-sans text-cafe-heading"
                />
                <button
                  onClick={() => {
                    setCityDropdownOpen(false);
                    handleAutoDetect();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-cafe-primary hover:bg-cafe-bg rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Compass size={13} />
                  <span>Auto-Detect Nearest City</span>
                </button>
                <div className="border-t border-cafe-border/75 my-1.5" />
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {Object.keys(groupedCities).length === 0 ? (
                    <p className="text-[10px] text-cafe-muted text-center py-2 font-work-sans">No cities found</p>
                  ) : (
                    Object.entries(groupedCities).map(([countryName, countryCities]) => (
                      <div key={countryName} className="space-y-0.5">
                        <div className="text-[10px] font-bold text-cafe-primary tracking-wider uppercase px-3 pt-1.5 font-outfit">
                          {countryName}
                        </div>
                        {countryCities.map((city) => (
                          <button
                            key={city.id}
                            onClick={() => handleCitySelect(city)}
                            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium font-work-sans transition-colors cursor-pointer flex justify-between items-center ${
                              activeCity?.id === city.id
                                ? "bg-cafe-bg text-cafe-primary font-semibold"
                                : "text-cafe-body hover:bg-cafe-bg/60 hover:text-cafe-heading"
                            }`}
                          >
                            <span>{city.name}</span>
                          </button>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Color-Blind Accessibility Dropdown */}
          <div className="relative flex items-center">
            <select
              value={accessibilityMode}
              onChange={(e) => setAccessibilityMode(e.target.value as any)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cafe-border bg-cafe-surface/50 text-cafe-heading hover:bg-cafe-surface text-xs font-semibold font-work-sans outline-none cursor-pointer"
              title="Select accessibility theme"
            >
              <option value="default">Standard Theme</option>
              <option value="protanopia">Protanopia (Red-Blind)</option>
              <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
              <option value="tritanopia">Tritanopia (Blue-Blind)</option>
              <option value="monochromacy">Achromatopsia (Grayscale)</option>
            </select>
            <span className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 text-[9px] text-cafe-muted font-semibold font-work-sans tracking-wide flex items-center gap-1 whitespace-nowrap">
              <Eye size={10} className="text-cafe-primary/70" /> Color Blind Friendly Themes
            </span>
            {showTooltip && (
              <div className="absolute right-0 top-full mt-5 w-60 bg-cafe-surface border border-cafe-border rounded-2xl shadow-[0_12px_40px_rgba(45,36,34,0.12)] p-3.5 z-[100] animate-fade-in text-xs font-work-sans text-cafe-body">
                <div className="font-bold text-cafe-heading mb-1 font-outfit flex items-center gap-1">
                  <Sparkles size={14} className="text-cafe-primary animate-pulse" />
                  <span>Choose Your Theme</span>
                </div>
                <p className="leading-relaxed">
                  Select a color-blind friendly theme (Protanopia, Deuteranopia, Tritanopia, or Achromatopsia) from the dropdown.
                </p>
                <button
                  onClick={dismissTooltip}
                  className="mt-2.5 w-full bg-cafe-primary text-white hover:bg-cafe-primary-hover py-1.5 rounded-xl text-[10px] font-semibold transition-colors cursor-pointer"
                >
                  Got it
                </button>
                {/* Tooltip caret pointing up */}
                <div className="absolute -top-1.5 right-6 w-3 h-3 bg-cafe-surface border-t border-l border-cafe-border rotate-45" />
              </div>
            )}
          </div>

          <Link
            to="/"
            className="hidden sm:inline text-cafe-body hover:text-cafe-heading transition-colors"
            activeProps={{ className: "text-cafe-heading font-medium" }}
            activeOptions={{ exact: true }}
            data-testid="nav-home-link"
          >
            Home
          </Link>
          <Link
            to="/directory"
            className="text-cafe-body hover:text-cafe-heading transition-colors"
            activeProps={{ className: "text-cafe-heading font-medium" }}
            data-testid="nav-directory-link"
          >
            Directory
          </Link>
          <Link
            to="/brew-compass"
            className="text-cafe-body hover:text-cafe-heading transition-colors"
            activeProps={{ className: "text-cafe-heading font-medium" }}
            activeOptions={{ exact: false }}
            data-testid="nav-brew-compass-link"
          >
            New to Coffee?
          </Link>
          <span className="hidden sm:inline-block w-px h-5 bg-cafe-border" />
          {/* Submit a Cafe — auth-aware CTA */}
          <button
            type="button"
            data-testid="nav-submit-cafe-btn"
            onClick={() => {
              if (user) {
                navigate({ to: "/submit" });
              } else {
                navigate({ to: "/login", search: { returnTo: "/submit" } });
              }
            }}
            className="hidden sm:inline-flex items-center gap-1.5 bg-cafe-primary text-white hover:bg-cafe-primary-hover px-4 py-2 rounded-xl text-sm font-work-sans font-medium transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
          >
            + Submit a Cafe
          </button>
          <span className="hidden sm:inline-block w-px h-5 bg-cafe-border" />
          <AuthArea onOpenProfile={() => setProfileModalOpen(true)} />
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-cafe-heading hover:bg-cafe-bg transition-colors border border-cafe-border flex items-center justify-center cursor-pointer"
          aria-label="Toggle Menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-cafe-surface border-t border-cafe-border p-6 space-y-6 animate-fade-in z-40 relative">
          {/* Navigation Links */}
          <div className="flex flex-col gap-3">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-cafe-body hover:text-cafe-heading transition-colors py-1 text-sm font-medium font-work-sans"
              activeProps={{ className: "text-cafe-primary font-semibold" }}
              activeOptions={{ exact: true }}
            >
              Home
            </Link>
            <Link
              to="/directory"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-cafe-body hover:text-cafe-heading transition-colors py-1 text-sm font-medium font-work-sans"
              activeProps={{ className: "text-cafe-primary font-semibold" }}
            >
              Directory
            </Link>
            <Link
              to="/brew-compass"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-cafe-body hover:text-cafe-heading transition-colors py-1 text-sm font-medium font-work-sans"
              activeProps={{ className: "text-cafe-primary font-semibold" }}
              activeOptions={{ exact: false }}
              data-testid="nav-mobile-brew-compass-link"
            >
              New to Coffee?
            </Link>

            {/* Submit a Cafe — auth-aware CTA (mobile) */}
            <button
              type="button"
              data-testid="nav-mobile-submit-cafe-btn"
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (user) {
                  navigate({ to: "/submit" });
                } else {
                  navigate({ to: "/login", search: { returnTo: "/submit" } });
                }
              }}
              className="w-full text-left py-1 text-sm font-semibold font-work-sans text-cafe-primary hover:text-cafe-primary-hover transition-colors cursor-pointer"
            >
              + Submit a Cafe
            </button>
          </div>

          <div className="border-t border-cafe-border/70 my-3" />

          {/* Controls & Dropdowns */}
          <div className="space-y-4">
            {/* City Selection */}
            <div>
              <label className="text-[10px] font-bold text-cafe-primary uppercase tracking-wider block mb-1.5 font-outfit">Active City</label>
              <div className="relative" ref={cityRef}>
                <button
                  onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-xl border border-cafe-border bg-cafe-surface/50 text-cafe-heading hover:bg-cafe-surface text-xs font-semibold font-work-sans transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-cafe-primary" />
                    <span>{activeCity ? activeCity.name : "Select City"}</span>
                  </span>
                  <ChevronDown size={14} className="text-cafe-muted" />
                </button>

                {cityDropdownOpen && (
                  <div className="absolute left-0 right-0 mt-2 bg-cafe-surface border border-cafe-border rounded-2xl shadow-[0_12px_40px_rgba(45,36,34,0.12)] p-2 z-50 animate-fade-in max-w-full">
                    <input
                      type="text"
                      placeholder="Search cities..."
                      value={citySearchQuery}
                      onChange={(e) => setCitySearchQuery(e.target.value)}
                      className="w-full bg-cafe-bg border border-cafe-border rounded-xl px-3 py-1.5 text-xs outline-none mb-2 font-work-sans text-cafe-heading"
                    />
                    <button
                      onClick={() => {
                        setCityDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                        handleAutoDetect();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-cafe-primary hover:bg-cafe-bg rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Compass size={13} />
                      <span>Auto-Detect Nearest City</span>
                    </button>
                    <div className="border-t border-cafe-border/75 my-1.5" />
                    <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                      {Object.keys(groupedCities).length === 0 ? (
                        <p className="text-[10px] text-cafe-muted text-center py-2 font-work-sans">No cities found</p>
                      ) : (
                        Object.entries(groupedCities).map(([countryName, countryCities]) => (
                          <div key={countryName} className="space-y-0.5">
                            <div className="text-[10px] font-bold text-cafe-primary tracking-wider uppercase px-3 pt-1.5 font-outfit">
                              {countryName}
                            </div>
                            {countryCities.map((city) => (
                              <button
                                key={city.id}
                                onClick={() => {
                                  handleCitySelect(city);
                                  setIsMobileMenuOpen(false);
                                }}
                                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium font-work-sans transition-colors cursor-pointer flex justify-between items-center ${
                                  activeCity?.id === city.id
                                    ? "bg-cafe-bg text-cafe-primary font-semibold"
                                    : "text-cafe-body hover:bg-cafe-bg/60 hover:text-cafe-heading"
                                }`}
                              >
                                <span>{city.name}</span>
                              </button>
                            ))}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Accessibility Dropdown */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-cafe-primary uppercase tracking-wider block mb-1.5 font-outfit">Accessibility Theme</label>
              <select
                value={accessibilityMode}
                onChange={(e) => setAccessibilityMode(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-cafe-border bg-cafe-surface/50 text-cafe-heading hover:bg-cafe-surface text-xs font-semibold font-work-sans outline-none cursor-pointer"
              >
                <option value="default">Standard Theme</option>
                <option value="protanopia">Protanopia (Red-Blind)</option>
                <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
                <option value="tritanopia">Tritanopia (Blue-Blind)</option>
                <option value="monochromacy">Achromatopsia (Grayscale)</option>
              </select>
              <span className="text-[9px] text-cafe-muted mt-1 text-center font-semibold font-work-sans tracking-wide flex items-center justify-center gap-1">
                <Eye size={10} className="text-cafe-primary/70" /> Color Blind Friendly Themes
              </span>
            </div>

            {/* Strategy Toggle - Admin Only */}
            {user && user.isAdmin && (
              <div>
                <label className="text-[10px] font-bold text-cafe-primary uppercase tracking-wider block mb-1.5 font-outfit">Delivery Strategy</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleStrategy}
                    title="Toggle Delivery Strategy"
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold font-work-sans transition-all cursor-pointer ${
                      strategy === "isr"
                        ? "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                        : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    {strategy === "isr" ? (
                      <>
                        <Layers size={13} className="text-purple-600 animate-pulse" />
                        <span>On-Demand ISR</span>
                      </>
                    ) : (
                      <>
                        <Globe size={13} className="text-emerald-600 animate-pulse" />
                        <span>Dynamic SSR</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="text-cafe-muted hover:text-cafe-heading p-2 rounded-xl text-xs font-semibold cursor-pointer border border-cafe-border h-9 w-9 flex items-center justify-center bg-cafe-surface/50"
                  >
                    ?
                  </button>
                </div>
                {showExplanation && (
                  <div className="bg-cafe-bg border border-cafe-border rounded-xl p-3.5 mt-2 text-xs font-work-sans space-y-2 text-cafe-body">
                    <div>
                      <span className="font-semibold text-emerald-700">🟢 Dynamic SSR:</span>
                      <p className="mt-0.5">Queries live database on every single page load. Extremely fresh, but hits the database each time.</p>
                    </div>
                    <div>
                      <span className="font-semibold text-purple-700">⚡ On-Demand ISR:</span>
                      <p className="mt-0.5">Serves pre-cached static HTML instantly. When you save in Admin, a background webhook invalidates the cache and rebuilds the static pages silently.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Auth Actions */}
          {mobileAuth}
        </div>
      )}

      {/* Edit Profile Modal */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-cafe-surface/90 backdrop-blur-xl border border-cafe-border rounded-2xl w-full max-w-md shadow-2xl p-6 relative animate-scale-in">
            <button
              onClick={() => setProfileModalOpen(false)}
              className="absolute right-4 top-4 p-1 rounded-full text-cafe-muted hover:text-cafe-heading hover:bg-cafe-bg transition-colors cursor-pointer border-0 bg-transparent"
              type="button"
            >
              <X size={18} />
            </button>
            <h3 className="font-outfit font-semibold text-lg text-cafe-heading mb-4">Edit Profile</h3>
            <form onSubmit={handleSaveProfile} className="space-y-4 font-work-sans">
              <div>
                <label className="block text-xs font-semibold text-cafe-muted mb-1">Email Address</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full bg-cafe-bg/50 border border-cafe-border/50 rounded-xl px-3 py-2 text-sm text-cafe-muted cursor-not-allowed select-all"
                />
                <p className="text-[10px] text-cafe-muted mt-1">Email address cannot be changed.</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-cafe-muted mb-1">Profile Name</label>
                <input
                  type="text"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  className="w-full bg-cafe-bg border border-cafe-border rounded-xl px-3 py-2 text-sm text-cafe-heading outline-none focus:border-cafe-primary transition-colors"
                />
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-cafe-border mt-4">
                <button
                  type="button"
                  disabled={deletingAccount}
                  onClick={handleDeleteAccount}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold font-work-sans cursor-pointer hover:underline disabled:opacity-50"
                >
                  {deletingAccount ? "Deleting account..." : "Delete Account"}
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setProfileModalOpen(false)}
                    className="px-4 py-2 border border-cafe-border rounded-xl text-sm font-medium text-cafe-body hover:bg-cafe-bg transition-colors cursor-pointer bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-4 py-2 bg-cafe-primary text-white hover:bg-cafe-primary-hover disabled:opacity-50 rounded-xl text-sm font-medium transition-colors cursor-pointer border-0 flex items-center gap-1.5"
                  >
                    {savingProfile ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#2D2422] text-white/80 mt-24" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-white font-outfit text-xl font-medium">
            <Coffee strokeWidth={1.5} className="text-cafe-primary" />
            <span>Indie Coffee Hub</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/60 max-w-xs font-work-sans">
            A small, hand-picked directory of independent speciality cafes across the world.
          </p>
        </div>
        <div className="text-sm font-work-sans flex flex-col gap-3 md:text-right md:items-end">
          <Link
            to="/about"
            className="text-xs uppercase tracking-[0.2em] font-semibold text-white hover:text-white/80 transition-colors block"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-xs uppercase tracking-[0.2em] font-semibold text-white hover:text-white/80 transition-colors block"
          >
            Contact Us
          </Link>
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
