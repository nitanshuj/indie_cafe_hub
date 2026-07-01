import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect, useRef } from "react";
import { Search, Wifi, ChevronDown, Coffee, Globe, MapPin, SlidersHorizontal, X } from "lucide-react";
import { Header, Footer } from "@/components/site-chrome";
import { CafeCard } from "@/components/cafe-card";
import { fetchCafes, fetchCities } from "@/lib/cafes";
import { getDeliveryStrategy } from "@/lib/cache";
import { useAuth } from "@/lib/auth-context";
import { z } from "zod";

const directorySearchSchema = z.object({
  query: z.string().optional().catch(""),
  page: z.coerce.number().catch(1),
});

export const Route = createFileRoute("/directory")({
  validateSearch: directorySearchSchema,
  loader: async () => {
    const [cafes, cities] = await Promise.all([fetchCafes(), fetchCities()]);
    return { cafes, cities };
  },
  head: () => ({
    meta: [
      { title: "Directory — Indie Coffee Hub" },
      {
        name: "description",
        content:
          "Browse every independent cafe in our directory. Filter by country, city, and WiFi friendliness.",
      },
      { property: "og:title", content: "Cafe Directory — Indie Coffee Hub" },
      { property: "og:description", content: "Browse and filter global independent cafes." },
    ],
  }),
  component: Directory,
});

function Directory() {
  const { user } = useAuth();
  const { cafes: initialCafes, cities } = Route.useLoaderData();
  const { query: urlQuery, page } = Route.useSearch();
  const currentPage = page || 1;
  const [cafes, setCafes] = useState(initialCafes);
  const [strategy, setStrategy] = useState("dynamic");
  const [query, setQuery] = useState(urlQuery || "");
  const [selectedCountry, setSelectedCountry] = useState("All countries");
  const [selectedCity, setSelectedCity] = useState("All cities");
  const [wifiOnly, setWifiOnly] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const reloadData = async () => {
    const fresh = await fetchCafes();
    setCafes(fresh);
    setStrategy(await getDeliveryStrategy());
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInputActive = activeEl && (
        activeEl.tagName === "INPUT" ||
        activeEl.tagName === "TEXTAREA" ||
        activeEl.getAttribute("contenteditable") === "true"
      );
      if (isInputActive) return;

      if (e.key === "/") {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if ((e.metaKey || e.ctrlKey) && e.key?.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (urlQuery !== undefined) {
      setQuery(urlQuery || "");
    }
  }, [urlQuery]);

  useEffect(() => {
    getDeliveryStrategy().then(setStrategy);
    window.addEventListener("delivery-strategy-change", reloadData);
    window.addEventListener("isr-cache-updated", reloadData);
    return () => {
      window.removeEventListener("delivery-strategy-change", reloadData);
      window.removeEventListener("isr-cache-updated", reloadData);
    };
  }, []);

  // Compute unique countries from loaded cities
  const countriesList = useMemo(() => {
    const countriesMap = new Map<string, string>(); // country_id -> country_name
    cities.forEach((city) => {
      if (city.country) {
        countriesMap.set(city.country.id, city.country.name);
      }
    });
    return Array.from(countriesMap.entries()).map(([id, name]) => ({ id, name }));
  }, [cities]);

  // Compute cities filtered by selected country
  const filteredCitiesList = useMemo(() => {
    if (selectedCountry === "All countries") {
      return cities;
    }
    return cities.filter((city) => city.country_id === selectedCountry);
  }, [cities, selectedCountry]);

  const filtered = useMemo(() => {
    return cafes.filter((c) => {
      // Country filter
      if (selectedCountry !== "All countries") {
        const cafeCity = cities.find((city) => city.id === c.city_id);
        if (!cafeCity || cafeCity.country_id !== selectedCountry) return false;
      }
      // City filter
      if (selectedCity !== "All cities" && c.city_id !== selectedCity) return false;

      if (wifiOnly && !c.wifi) return false;
      if (
        query &&
        !`${c.name} ${c.neighborhood} ${c.blurb} ${c.city_name || ""} ${c.country_name || ""}`.toLowerCase().includes(query.toLowerCase())
      )
        return false;
      return true;
    });
  }, [cafes, query, selectedCountry, selectedCity, wifiOnly, cities]);

  const clearAll = () => {
    setQuery("");
    setSelectedCountry("All countries");
    setSelectedCity("All cities");
    setWifiOnly(false);
  };

  return (
    <div
      className="min-h-screen bg-cafe-bg bg-fixed bg-center bg-cover bg-no-repeat"
      style={{
        backgroundImage: 'linear-gradient(rgba(245, 242, 235, 0.93), rgba(245, 242, 235, 0.93)), url("https://res.cloudinary.com/daon1coiv/image/upload/v1782760872/french_press_cover_image_gaoppk.png")',
        backgroundBlendMode: 'multiply',
      }}
    >
      <Header />      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-72px)]">
        {/* Left Sidebar */}
        <aside className="w-full lg:w-80 shrink-0 lg:fixed lg:top-[72px] lg:left-0 lg:bottom-0 lg:h-[calc(100vh-72px)] bg-[#483629] lg:border-r border-[#5A4537] rounded-2xl lg:rounded-none p-6 z-30 overflow-y-auto text-[#F5F2EB] shadow-lg">
          <div className="flex flex-col gap-5">
            {/* Always visible Search field */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C4B2A9] font-work-sans mb-1.5 font-semibold">Search</label>
              <div className="relative">
                <Search
                  size={16}
                  strokeWidth={1.5}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C4B2A9]"
                />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  placeholder="Search cafes…"
                  data-testid="filter-search-input"
                  className="w-full bg-[#5D473A] border border-[#6F5547] rounded-xl focus:ring-2 focus:ring-[#A18070]/30 focus:border-[#A18070] placeholder:text-[#C4B2A9] text-[#F5F2EB] pl-10 pr-9 py-1.5 outline-none font-work-sans text-sm transition-all"
                />
                {!isInputFocused && !query && (
                  <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 pointer-events-none select-none rounded border border-[#6F5547] bg-[#4E3B30] px-1.5 font-mono text-[10px] font-medium text-[#C4B2A9]">
                    /
                  </kbd>
                )}
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#C4B2A9] hover:text-[#F5F2EB] transition-colors rounded-full cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center justify-center gap-1.5 w-full px-3 py-1.5 rounded-xl border border-[#6F5547] bg-[#5D473A] text-[#F5F2EB] hover:bg-[#4E3B30] text-xs font-semibold transition-all cursor-pointer"
            >
              <SlidersHorizontal size={14} strokeWidth={1.5} />
              <span>{showMobileFilters ? "Hide Filters" : "Show Filters"}</span>
            </button>

            {/* Collapsible/Desktop Filters Section */}
            <div className={`${showMobileFilters ? "flex" : "hidden"} lg:flex flex-col gap-5 animate-fade-in`}>
              {/* Country Select Dropdown */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C4B2A9] font-work-sans mb-1.5 font-semibold">Country</label>
                <div className="relative">
                  <select
                    value={selectedCountry}
                    onChange={(e) => {
                      setSelectedCountry(e.target.value);
                      setSelectedCity("All cities");
                    }}
                    data-testid="filter-country-select"
                    className="appearance-none bg-[#5D473A] border border-[#6F5547] rounded-xl focus:ring-2 focus:ring-[#A18070]/30 focus:border-[#A18070] text-[#F5F2EB] pl-9 pr-9 py-1.5 outline-none font-work-sans text-sm w-full cursor-pointer"
                  >
                    <option value="All countries">All Countries</option>
                    {countriesList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <Globe
                    size={14}
                    strokeWidth={1.5}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C4B2A9] pointer-events-none"
                  />
                  <ChevronDown
                    size={14}
                    strokeWidth={1.5}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C4B2A9] pointer-events-none"
                  />
                </div>
              </div>

              {/* City Select Dropdown */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C4B2A9] font-work-sans mb-1.5 font-semibold">City</label>
                <div className="relative">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    data-testid="filter-city-select"
                    className="appearance-none bg-[#5D473A] border border-[#6F5547] rounded-xl focus:ring-2 focus:ring-[#A18070]/30 focus:border-[#A18070] text-[#F5F2EB] pl-9 pr-9 py-1.5 outline-none font-work-sans text-sm w-full cursor-pointer"
                  >
                    <option value="All cities">All Cities</option>
                    {filteredCitiesList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <MapPin
                    size={14}
                    strokeWidth={1.5}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C4B2A9] pointer-events-none"
                  />
                  <ChevronDown
                    size={14}
                    strokeWidth={1.5}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C4B2A9] pointer-events-none"
                  />
                </div>
              </div>

              {/* WiFi friendly toggle */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C4B2A9] font-work-sans mb-1.5 font-semibold">Amenities</label>
                <button
                  type="button"
                  onClick={() => setWifiOnly((v) => !v)}
                  data-testid="filter-wifi-toggle"
                  aria-pressed={wifiOnly}
                  className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all duration-200 font-work-sans text-sm w-full cursor-pointer ${
                    wifiOnly
                      ? "bg-[#F5F2EB] text-[#483629] border-[#F5F2EB] hover:bg-[#DEDBD5]"
                      : "bg-[#5D473A] text-[#EBE7DF] border-[#6F5547] hover:border-[#866858]"
                  }`}
                >
                  <Wifi size={14} strokeWidth={1.5} /> WiFi Friendly
                </button>
              </div>

              {/* Clear all filters inside sidebar */}
              {(query || selectedCountry !== "All countries" || selectedCity !== "All cities" || wifiOnly) && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="mt-2 text-xs text-[#C4B2A9] hover:text-[#F5F2EB] hover:underline font-work-sans font-medium text-center transition-colors cursor-pointer"
                >
                  Clear all active filters
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Right Main Content Area */}
        <main className="flex-1 lg:pl-80 w-full flex flex-col justify-between">
          <section className="max-w-5xl mx-auto px-6 py-12 w-full">
            <div className="mb-10 flex items-start justify-between flex-wrap gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] font-semibold text-cafe-primary font-work-sans">
                  {filtered.length} {filtered.length === 1 ? "cafe" : "cafes"}
                </p>
                <h1 className="mt-3 text-5xl sm:text-6xl tracking-tight font-light text-cafe-heading font-outfit">
                  The directory
                </h1>
              </div>
              {user && user.isAdmin && (
                <div className={`text-xs px-3.5 py-2 rounded-xl border flex items-center gap-1.5 font-medium font-work-sans shadow-sm transition-all ${
                  strategy === "isr"
                    ? "bg-purple-50 border-purple-200 text-purple-700"
                    : "bg-emerald-50 border-emerald-200 text-emerald-700"
                }`}>
                  <span className={`w-2 h-2 rounded-full ${strategy === "isr" ? "bg-purple-500 animate-pulse" : "bg-emerald-500 animate-ping"}`} />
                  {strategy === "isr" ? "Serving from Static CDN Edge (ISR Mode)" : "Live DB Query (Dynamic SSR Mode)"}
                </div>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-24 max-w-md mx-auto" data-testid="directory-empty-state">
                <div className="inline-flex w-16 h-16 rounded-full bg-cafe-primary-light items-center justify-center text-cafe-primary">
                  <Coffee strokeWidth={1.5} />
                </div>
                <h2 className="mt-6 text-3xl tracking-tight font-medium text-cafe-heading font-outfit">
                  No cafes match — yet.
                </h2>
                <p className="mt-3 text-cafe-body font-work-sans leading-relaxed">
                  Try widening your search, or have a look at the whole directory.
                </p>
                <button
                  type="button"
                  onClick={clearAll}
                  data-testid="empty-clear-filters-button"
                  className="mt-6 text-cafe-primary hover:text-cafe-primary-hover font-work-sans font-medium"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filtered.slice((currentPage - 1) * 6, currentPage * 6).map((cafe, i) => (
                    <div
                      key={cafe.id}
                      className="animate-fade-up"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <CafeCard cafe={cafe} index={(currentPage - 1) * 6 + i} />
                    </div>
                  ))}
                </div>

                {/* Brutalist Pagination controls */}
                {Math.ceil(filtered.length / 6) > 1 && (
                  <div className="flex items-center justify-between border-2 border-[#1A1715] p-4 bg-[#E5E2DA] font-mono text-xs uppercase tracking-widest mt-12">
                    {currentPage > 1 ? (
                      <Link
                        to="/directory"
                        search={(prev) => ({ ...prev, page: currentPage - 1 })}
                        className="border-2 border-[#1A1715] bg-[#1A1715] text-[#F5F2EB] px-4 py-2 hover:bg-transparent hover:text-[#1A1715] transition-colors font-bold"
                      >
                        PREV
                      </Link>
                    ) : (
                      <span className="opacity-40 border-2 border-transparent px-4 py-2">
                        PREV
                      </span>
                    )}

                    <span>
                      PAGE {currentPage} OF {Math.ceil(filtered.length / 6)}
                    </span>

                    {currentPage < Math.ceil(filtered.length / 6) ? (
                      <Link
                        to="/directory"
                        search={(prev) => ({ ...prev, page: currentPage + 1 })}
                        className="border-2 border-[#1A1715] bg-[#1A1715] text-[#F5F2EB] px-4 py-2 hover:bg-transparent hover:text-[#1A1715] transition-colors font-bold"
                      >
                        NEXT
                      </Link>
                    ) : (
                      <span className="opacity-40 border-2 border-transparent px-4 py-2">
                        NEXT
                      </span>
                    )}
                  </div>
                )}
              </>
            )}
          </section>

          <Footer />
        </main>
      </div>
    </div>
  );
}
