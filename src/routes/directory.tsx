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
      { title: "Node Registry Directory — Indie Coffee Hub" },
      {
        name: "description",
        content:
          "Browse independent cafe nodes in our directory. Filter by country, city, and WiFi status.",
      },
      { property: "og:title", content: "Cafe Node Registry" },
      { property: "og:description", content: "Browse and filter global independent operational nodes." },
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
    setStrategy(await getDeliveryStrategy());
  };

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

  const countriesList = useMemo(() => {
    const countriesMap = new Map<string, string>();
    cities.forEach((city) => {
      if (city.country) {
        countriesMap.set(city.country.id, city.country.name);
      }
    });
    return Array.from(countriesMap.entries()).map(([id, name]) => ({ id, name }));
  }, [cities]);

  const filteredCitiesList = useMemo(() => {
    if (selectedCountry === "All countries") {
      return cities;
    }
    return cities.filter((city) => city.country_id === selectedCountry);
  }, [cities, selectedCountry]);

  const filtered = useMemo(() => {
    return cafes.filter((c) => {
      if (selectedCountry !== "All countries") {
        const cafeCity = cities.find((city) => city.id === c.city_id);
        if (!cafeCity || cafeCity.country_id !== selectedCountry) return false;
      }
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
    <div className="min-h-screen bg-[#0F1115]">
      <Header />

      <div
        className="sticky top-[73px] z-40 bg-[#0F1115]/95 border-b border-[#2A2E37] backdrop-blur-md"
        data-testid="directory-filter-bar"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-3">
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-cafe-muted"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="FILTER SEARCH PATHS..."
                data-testid="filter-search-input"
                className="w-full bg-[#1A1D24] border border-[#2A2E37] rounded-none focus:border-[#00F0FF] focus:shadow-[inset_0_0_8px_rgba(0,240,255,0.2)] placeholder:text-cafe-muted text-[#00F0FF] pl-11 pr-4 py-2 outline-none font-mono text-xs uppercase tracking-wider"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="sm:hidden flex items-center gap-1.5 px-4 py-2 rounded-none border border-cafe-border bg-[#1A1D24] text-cafe-heading hover:border-[#00F0FF] text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
            >
              <SlidersHorizontal size={14} />
              <span>PARAMS</span>
            </button>
          </div>

          <div className={`${showMobileFilters ? "flex" : "hidden"} sm:flex flex-col sm:flex-row gap-3 items-stretch sm:items-center animate-fade-in`}>
            <div className="relative flex-1 sm:flex-none">
              <select
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setSelectedCity("All cities");
                }}
                data-testid="filter-country-select"
                className="appearance-none bg-[#1A1D24] border border-[#2A2E37] rounded-none text-cafe-heading pl-10 pr-10 py-2 outline-none font-mono text-xs uppercase tracking-wider w-full sm:w-auto cursor-pointer focus:border-[#00F0FF]"
              >
                <option value="All countries">ALL REGIONS (GLOBAL)</option>
                {countriesList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name.toUpperCase()}
                  </option>
                ))}
              </select>
              <Globe
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-cafe-muted pointer-events-none"
              />
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cafe-muted pointer-events-none"
              />
            </div>

            <div className="relative flex-1 sm:flex-none">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                data-testid="filter-city-select"
                className="appearance-none bg-[#1A1D24] border border-[#2A2E37] rounded-none text-cafe-heading pl-10 pr-10 py-2 outline-none font-mono text-xs uppercase tracking-wider w-full sm:w-auto cursor-pointer focus:border-[#00F0FF]"
              >
                <option value="All cities">ALL STATIONS (NODES)</option>
                {filteredCitiesList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name.toUpperCase()}
                  </option>
                ))}
              </select>
              <MapPin
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-cafe-muted pointer-events-none"
              />
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cafe-muted pointer-events-none"
              />
            </div>

            <button
              type="button"
              onClick={() => setWifiOnly((v) => !v)}
              data-testid="filter-wifi-toggle"
              aria-pressed={wifiOnly}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-none border transition-all font-mono text-xs uppercase tracking-wider ${
                wifiOnly
                  ? "bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF] hover:bg-[#00F0FF]/25 shadow-[inset_0_0_8px_rgba(0,240,255,0.2)]"
                  : "bg-[#1A1D24] text-cafe-body border-cafe-border hover:border-[#00F0FF] hover:text-[#00F0FF]"
              }`}
            >
              <Wifi size={14} /> HIGH_BANDWIDTH WIFI
            </button>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-10 flex items-start justify-between flex-wrap gap-4 border-b border-[#2A2E37] pb-6">
          <div>
            <p className="text-xs uppercase tracking-widest font-mono text-cafe-primary">
              &gt; INDEXED_NODES: {filtered.length} {filtered.length === 1 ? "UNIT" : "UNITS"} FOUND
            </p>
            <h1 className="mt-2 text-4xl sm:text-5xl tracking-widest font-black text-cafe-heading font-outfit uppercase">
              NODE DIRECTORY MATRIX
            </h1>
          </div>
          {user && user.isAdmin && (
            <div className={`text-[10px] px-3.5 py-2 border rounded-none flex items-center gap-1.5 font-mono uppercase tracking-wider ${
              strategy === "isr"
                ? "bg-purple-950/20 border-purple-800 text-purple-400"
                : "bg-[#00F0FF]/5 border-[#00F0FF]/30 text-[#00F0FF]"
            }`}>
              <span className={`w-2 h-2 rounded-none ${strategy === "isr" ? "bg-purple-500 animate-pulse" : "bg-[#00F0FF] animate-ping"}`} />
              {strategy === "isr" ? "CDN_CACHE: ACTIVE (ISR)" : "SERVER_LIVE: SSR QUERY"}
            </div>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24 max-w-md mx-auto" data-testid="directory-empty-state">
            <div className="inline-flex w-16 h-16 border border-red-500/30 bg-red-500/10 items-center justify-center text-red-400">
              <Coffee size={24} />
            </div>
            <h2 className="mt-6 text-xl tracking-widest font-bold text-cafe-heading font-mono uppercase">
              QUERY RETURNED NULL // ZERO MATCHES
            </h2>
            <p className="mt-3 text-cafe-muted font-mono text-xs uppercase tracking-wider">
              No index matched your request configuration. Adjust filtering variables and run search again.
            </p>
            <button
              type="button"
              onClick={clearAll}
              data-testid="empty-clear-filters-button"
              className="mt-6 text-[#00F0FF] hover:text-[#00C8D6] font-mono text-xs uppercase tracking-widest border border-[#00F0FF]/30 px-4 py-2 hover:bg-[#00F0FF]/5"
            >
              RESET PARAMS
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
