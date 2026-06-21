import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Search, Wifi, ChevronDown, Coffee, Globe, MapPin, SlidersHorizontal } from "lucide-react";
import { Header, Footer } from "@/components/site-chrome";
import { CafeCard } from "@/components/cafe-card";
import { fetchCafes, fetchCities } from "@/lib/cafes";
import { getDeliveryStrategy } from "@/lib/cache";
import { useAuth } from "@/lib/auth-context";
import { z } from "zod";

const directorySearchSchema = z.object({
  query: z.string().optional().catch(""),
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
  const { query: urlQuery } = Route.useSearch();
  const [cafes, setCafes] = useState(initialCafes);
  const [strategy, setStrategy] = useState("dynamic");
  const [query, setQuery] = useState(urlQuery || "");
  const [selectedCountry, setSelectedCountry] = useState("All countries");
  const [selectedCity, setSelectedCity] = useState("All cities");
  const [wifiOnly, setWifiOnly] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const reloadData = async () => {
    const fresh = await fetchCafes();
    setCafes(fresh);
    setStrategy(getDeliveryStrategy());
  };

  useEffect(() => {
    if (urlQuery !== undefined) {
      setQuery(urlQuery || "");
    }
  }, [urlQuery]);

  useEffect(() => {
    setStrategy(getDeliveryStrategy());
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
        !`${c.name} ${c.neighborhood} ${c.blurb}`.toLowerCase().includes(query.toLowerCase())
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
    <div className="min-h-screen bg-cafe-bg">
      <Header />

      <div
        className="sticky top-[73px] z-40 bg-cafe-surface/70 backdrop-blur-xl border-b border-cafe-border backdrop-saturate-150"
        data-testid="directory-filter-bar"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-3">
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <Search
                size={18}
                strokeWidth={1.5}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-cafe-muted"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search cafes…"
                data-testid="filter-search-input"
                className="w-full bg-cafe-surface border border-cafe-border rounded-xl focus:ring-2 focus:ring-cafe-primary/30 focus:border-cafe-primary placeholder:text-cafe-muted pl-11 pr-4 py-2 outline-none font-work-sans"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="sm:hidden flex items-center gap-1.5 px-4 py-2 rounded-xl border border-cafe-border bg-cafe-surface text-cafe-body hover:bg-cafe-bg text-sm font-semibold transition-all cursor-pointer"
            >
              <SlidersHorizontal size={16} strokeWidth={1.5} />
              <span>Filters</span>
            </button>
          </div>

          {/* Filter dropdowns/toggles: visible on desktop, or when toggled on mobile */}
          <div className={`${showMobileFilters ? "flex" : "hidden"} sm:flex flex-col sm:flex-row gap-3 items-stretch sm:items-center animate-fade-in`}>
            {/* Country Select Dropdown */}
            <div className="relative flex-1 sm:flex-none">
              <select
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setSelectedCity("All cities");
                }}
                data-testid="filter-country-select"
                className="appearance-none bg-cafe-surface border border-cafe-border rounded-xl focus:ring-2 focus:ring-cafe-primary/30 focus:border-cafe-primary text-cafe-heading pl-10 pr-10 py-2 outline-none font-work-sans w-full sm:w-auto cursor-pointer"
              >
                <option value="All countries">All Countries</option>
                {countriesList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <Globe
                size={16}
                strokeWidth={1.5}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-cafe-muted pointer-events-none"
              />
              <ChevronDown
                size={16}
                strokeWidth={1.5}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cafe-muted pointer-events-none"
              />
            </div>

            {/* City Select Dropdown */}
            <div className="relative flex-1 sm:flex-none">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                data-testid="filter-city-select"
                className="appearance-none bg-cafe-surface border border-cafe-border rounded-xl focus:ring-2 focus:ring-cafe-primary/30 focus:border-cafe-primary text-cafe-heading pl-10 pr-10 py-2 outline-none font-work-sans w-full sm:w-auto cursor-pointer"
              >
                <option value="All cities">All Cities</option>
                {filteredCitiesList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <MapPin
                size={16}
                strokeWidth={1.5}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-cafe-muted pointer-events-none"
              />
              <ChevronDown
                size={16}
                strokeWidth={1.5}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cafe-muted pointer-events-none"
              />
            </div>
            <button
              type="button"
              onClick={() => setWifiOnly((v) => !v)}
              data-testid="filter-wifi-toggle"
              aria-pressed={wifiOnly}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 font-work-sans text-sm ${
                wifiOnly
                  ? "bg-cafe-primary text-white border-cafe-primary hover:bg-cafe-primary-hover"
                  : "bg-cafe-surface text-cafe-body border-cafe-border hover:border-cafe-primary/40"
              }`}
            >
              <Wifi size={16} strokeWidth={1.5} /> WiFi Friendly
            </button>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 py-16">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((cafe, i) => (
              <div
                key={cafe.id}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <CafeCard cafe={cafe} imageHeightClass={i % 3 === 1 ? "h-80" : "h-64"} />
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
