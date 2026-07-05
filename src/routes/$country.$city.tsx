import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState, useEffect, useRef } from "react";
import { Search, Wifi, ChevronDown, Coffee, MapPin, Compass, ArrowLeft, Plug, Snowflake, Check, SlidersHorizontal, X } from "lucide-react";
import { Header, Footer } from "@/components/site-chrome";
import { CafeCard } from "@/components/cafe-card";
import { fetchCafesByCity } from "@/lib/cafes";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/$country/$city")({
  loader: async ({ params }) => {
    // Fetch the city and verify it matches the country code
    const { data: cityData, error: cityError } = await supabase
      .from("cities")
      .select("*, country:countries(*)")
      .eq("slug", params.city)
      .maybeSingle();

    if (cityError || !cityData) {
      throw notFound();
    }

    if (cityData.country?.code?.toLowerCase() !== params.country?.toLowerCase()) {
      throw notFound();
    }

    const cafes = await fetchCafesByCity(cityData.id);
    return { city: cityData, cafes };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
        { title: `Indie Cafes in ${loaderData.city.name} — Indie Coffee Hub` },
        {
          name: "description",
          content: `Browse top independent cafes for digital nomads and coffee lovers in ${loaderData.city.name}.`,
        },
        { property: "og:title", content: `Indie Cafes in ${loaderData.city.name}` },
        {
          property: "og:description",
          content: `Find laptop-friendly cafes in ${loaderData.city.name}.`,
        },
      ]
      : [],
  }),
  component: CityLandingPage,
});

function CityLandingPage() {
  const { city, cafes } = Route.useLoaderData();

  const [query, setQuery] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("All neighborhoods");
  const [wifiOnly, setWifiOnly] = useState(false);
  const [plugsOnly, setPlugsOnly] = useState(false);
  const [acOnly, setAcOnly] = useState(false);
  const [noiseFilter, setNoiseFilter] = useState("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Get unique neighborhoods in this city
  const neighborhoodsList = useMemo(() => {
    const hoods = new Set<string>();
    cafes.forEach((c) => {
      if (c.neighborhood) hoods.add(c.neighborhood);
    });
    return ["All neighborhoods", ...Array.from(hoods)];
  }, [cafes]);

  // Filter cafes
  const filteredAndSortedCafes = useMemo(() => {
    return cafes.filter((c) => {
      if (selectedNeighborhood !== "All neighborhoods" && c.neighborhood !== selectedNeighborhood) return false;
      if (wifiOnly && !c.wifi) return false;
      if (plugsOnly && !c.has_plug_points) return false;
      if (acOnly && !c.has_ac) return false;
      if (noiseFilter !== "all" && c.noise_level !== noiseFilter) return false;

      if (query) {
        const text = `${c.name} ${c.neighborhood} ${c.blurb} ${c.specialty_focus || ""}`.toLowerCase();
        if (!text.includes(query.toLowerCase())) return false;
      }
      return true;
    });
  }, [cafes, query, selectedNeighborhood, wifiOnly, plugsOnly, acOnly, noiseFilter]);

  const clearAll = () => {
    setQuery("");
    setSelectedNeighborhood("All neighborhoods");
    setWifiOnly(false);
    setPlugsOnly(false);
    setAcOnly(false);
    setNoiseFilter("all");
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

  return (
    <div
      className="min-h-screen bg-cafe-bg bg-fixed bg-center bg-cover bg-no-repeat"
      style={{
        backgroundImage: 'linear-gradient(rgba(245, 242, 235, 0.93), rgba(245, 242, 235, 0.93)), url("https://res.cloudinary.com/daon1coiv/image/upload/v1782760872/french_press_cover_image_gaoppk.png")',
        backgroundBlendMode: 'multiply',
      }}
    >
      <Header />

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-72px)]">
        {/* Left Sidebar */}
        <aside className="w-full lg:w-80 shrink-0 lg:fixed lg:top-[72px] lg:left-0 lg:bottom-0 lg:h-[calc(100vh-72px)] bg-[#6A4E36] lg:border-r border-[#826347] rounded-2xl lg:rounded-none p-6 z-30 overflow-y-auto text-[#FDFBF7] shadow-lg">
          <div className="flex flex-col gap-5">
            {/* Back to Global Directory */}
            <div>
              <Link
                to="/directory"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E0D3C5] hover:text-[#FDFBF7] uppercase tracking-wider font-work-sans transition-colors"
              >
                <ArrowLeft size={12} /> View global directory
              </Link>
            </div>

            {/* Search field */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#E0D3C5] font-work-sans mb-1.5 font-semibold">Search</label>
              <div className="relative">
                <Search
                  size={16}
                  strokeWidth={1.5}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#E0D3C5]"
                />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  placeholder={`Search cafes in ${city.name}…`}
                  data-testid="filter-search-input"
                  className="w-full bg-[#785B42] border border-[#8F7155] rounded-xl focus:ring-2 focus:ring-[#A18070]/30 focus:border-[#A18070] placeholder:text-[#E0D3C5] text-[#FDFBF7] pl-10 pr-9 py-1.5 outline-none font-work-sans text-sm transition-all"
                />
                {!isInputFocused && !query && (
                  <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 pointer-events-none select-none rounded border border-[#8F7155] bg-[#8F7155] px-1.5 font-mono text-[10px] font-medium text-[#E0D3C5]">
                    /
                  </kbd>
                )}
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#E0D3C5] hover:text-[#FDFBF7] transition-colors rounded-full cursor-pointer"
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
              className="lg:hidden flex items-center justify-center gap-1.5 w-full px-3 py-1.5 rounded-xl border border-[#8F7155] bg-[#785B42] text-[#FDFBF7] hover:bg-[#8F7155] text-xs font-semibold transition-all cursor-pointer"
            >
              <SlidersHorizontal size={14} strokeWidth={1.5} />
              <span>{showMobileFilters ? "Hide Filters" : "Show Filters"}</span>
            </button>

            {/* Collapsible/Desktop Filters Section */}
            <div className={`${showMobileFilters ? "flex" : "hidden"} lg:flex flex-col gap-5 animate-fade-in`}>
              {/* Neighborhood Select Dropdown */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#E0D3C5] font-work-sans mb-1.5 font-semibold">Neighborhood</label>
                <div className="relative">
                  <select
                    value={selectedNeighborhood}
                    onChange={(e) => setSelectedNeighborhood(e.target.value)}
                    className="appearance-none bg-[#785B42] border border-[#8F7155] rounded-xl focus:ring-2 focus:ring-[#A18070]/30 focus:border-[#A18070] text-[#FDFBF7] pl-9 pr-9 py-1.5 outline-none font-work-sans text-sm w-full cursor-pointer"
                  >
                    {neighborhoodsList.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <MapPin
                    size={14}
                    strokeWidth={1.5}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#E0D3C5] pointer-events-none"
                  />
                  <ChevronDown
                    size={14}
                    strokeWidth={1.5}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#E0D3C5] pointer-events-none"
                  />
                </div>
              </div>

              {/* Noise Level Filter */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#E0D3C5] font-work-sans mb-1.5 font-semibold">Noise Level</label>
                <div className="relative">
                  <select
                    value={noiseFilter}
                    onChange={(e) => setNoiseFilter(e.target.value)}
                    className="appearance-none bg-[#785B42] border border-[#8F7155] rounded-xl focus:ring-2 focus:ring-[#A18070]/30 focus:border-[#A18070] text-[#FDFBF7] pl-9 pr-9 py-1.5 outline-none font-work-sans text-sm w-full cursor-pointer"
                  >
                    <option value="all">Any Noise Level</option>
                    <option value="quiet">🤫 Quiet</option>
                    <option value="moderate">☕ Moderate</option>
                    <option value="bustling">⚡ Bustling</option>
                  </select>
                  <Compass
                    size={14}
                    strokeWidth={1.5}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#E0D3C5] pointer-events-none"
                  />
                  <ChevronDown
                    size={14}
                    strokeWidth={1.5}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#E0D3C5] pointer-events-none"
                  />
                </div>
              </div>

              {/* Amenities Toggles */}
              <div className="flex flex-col gap-2">
                <label className="block text-xs uppercase tracking-wider text-[#E0D3C5] font-work-sans mb-1.5 font-semibold">Amenities</label>
                <button
                  type="button"
                  onClick={() => setWifiOnly((v) => !v)}
                  className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all duration-200 font-work-sans text-sm w-full cursor-pointer ${wifiOnly
                      ? "bg-[#FDFBF7] text-[#6A4E36] border-[#FDFBF7] hover:bg-[#EAE5DF]"
                      : "bg-[#785B42] text-[#EBE7DF] border-[#8F7155] hover:border-[#8F7155]"
                    }`}
                >
                  <Wifi size={14} strokeWidth={1.5} /> WiFi Friendly
                </button>
                <button
                  type="button"
                  onClick={() => setPlugsOnly((v) => !v)}
                  className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all duration-200 font-work-sans text-sm w-full cursor-pointer ${plugsOnly
                      ? "bg-[#FDFBF7] text-[#6A4E36] border-[#FDFBF7] hover:bg-[#EAE5DF]"
                      : "bg-[#785B42] text-[#EBE7DF] border-[#8F7155] hover:border-[#8F7155]"
                    }`}
                >
                  <Plug size={14} strokeWidth={1.5} /> Abundant Plugs
                </button>
                <button
                  type="button"
                  onClick={() => setAcOnly((v) => !v)}
                  className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all duration-200 font-work-sans text-sm w-full cursor-pointer ${acOnly
                      ? "bg-[#FDFBF7] text-[#6A4E36] border-[#FDFBF7] hover:bg-[#EAE5DF]"
                      : "bg-[#785B42] text-[#EBE7DF] border-[#8F7155] hover:border-[#8F7155]"
                    }`}
                >
                  <Snowflake size={14} strokeWidth={1.5} /> Adequate AC
                </button>
              </div>

              {/* Clear all filters inside sidebar */}
              {(query || selectedNeighborhood !== "All neighborhoods" || wifiOnly || plugsOnly || acOnly || noiseFilter !== "all") && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="mt-2 text-xs text-[#E0D3C5] hover:text-[#FDFBF7] hover:underline font-work-sans font-medium text-center transition-colors cursor-pointer"
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
              <div className="bg-[#fcfaf7]/40 backdrop-blur-md border border-[#e5dec9]/60 p-6 rounded-2xl w-full shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] font-semibold text-cafe-primary font-work-sans">
                  {city.country?.name} Landing Page
                </p>
                <h1 className="mt-3 text-5xl sm:text-6xl tracking-tight font-light text-cafe-heading font-outfit">
                  Cafes in <span className="font-medium text-cafe-primary">{city.name}</span>
                </h1>
                <p className="mt-3 text-sm text-[#6B5C58] font-work-sans leading-relaxed">
                  Discover the best local coffee roasters, fast wifi hubs, and quiet spaces to get your best work done in {city.name}.
                </p>
              </div>
            </div>

            {cafes.length === 0 ? (
              <div className="text-center py-24 max-w-md mx-auto">
                <div className="inline-flex w-16 h-16 rounded-full bg-cafe-bg border border-cafe-primary-light items-center justify-center text-cafe-primary animate-pulse">
                  <Coffee strokeWidth={1.5} size={28} />
                </div>
                <h2 className="mt-6 text-3xl tracking-tight font-medium text-cafe-heading font-outfit">
                  Cafes will be added here soon!
                </h2>
                <p className="mt-3 text-cafe-body font-work-sans leading-relaxed text-sm">
                  We haven't listed any independent cafes in {city.name} yet. Check back soon or submit your favorite spot to our curators!
                </p>
              </div>
            ) : filteredAndSortedCafes.length === 0 ? (
              <div className="text-center py-24 max-w-md mx-auto">
                <div className="inline-flex w-16 h-16 rounded-full bg-cafe-primary-light items-center justify-center text-cafe-primary">
                  <Coffee strokeWidth={1.5} />
                </div>
                <h2 className="mt-6 text-3xl tracking-tight font-medium text-cafe-heading font-outfit">
                  No cafes match your filters.
                </h2>
                <p className="mt-3 text-cafe-body font-work-sans leading-relaxed">
                  Try removing some amenities or search query terms.
                </p>
                <button
                  onClick={clearAll}
                  className="mt-6 bg-cafe-primary text-white hover:bg-cafe-primary-hover px-5 py-2.5 rounded-xl font-work-sans font-medium"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredAndSortedCafes.map((cafe, i) => (
                  <div
                    key={cafe.dbId}
                    className="animate-fade-up relative"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <CafeCard
                      cafe={cafe}
                      index={i}
                      // Override card path to support localized directory path
                      to={`/${city.country?.code?.toLowerCase()}/${city.slug}/${cafe.id}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>

          <Footer />
        </main>
      </div>
    </div>
  );
}
