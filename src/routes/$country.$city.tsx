import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Search, Wifi, ChevronDown, Coffee, MapPin, Compass, ArrowLeft, Plug, Snowflake, Check } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-[#FFF7F5]">
      <Header />

      {/* Hero Header */}
      <section className="bg-white/40 border-b border-[#F5EBE9] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Link
            to="/directory"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E67E6B] hover:text-[#D96C5A] uppercase tracking-wider mb-4"
          >
            <ArrowLeft size={12} /> View global directory
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#E67E6B] font-work-sans">
                {city.country?.name} Landing Page
              </p>
              <h1 className="mt-2 text-4xl sm:text-5xl font-light text-[#2D2422] font-outfit tracking-tight">
                Independent Cafes in <span className="font-medium text-[#E67E6B]">{city.name}</span>
              </h1>
              <p className="mt-3 text-sm text-[#6B5C58] font-work-sans max-w-xl">
                Discover the best local coffee roasters, fast wifi hubs, and quiet spaces to get your best work done in {city.name}.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Toolbar */}
      <div className="sticky top-[73px] z-40 bg-white/70 backdrop-blur-xl border-b border-[#F5EBE9] backdrop-saturate-150">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A3938F]" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search cafes in ${city.name}…`}
                className="w-full bg-white border border-[#F5EBE9] rounded-xl focus:ring-2 focus:ring-[#E67E6B]/30 focus:border-[#E67E6B] pl-11 pr-4 py-2 outline-none font-work-sans text-[#2D2422]"
              />
            </div>
            
            {/* Neighborhood Dropdown */}
            <div className="relative">
              <select
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                className="appearance-none bg-white border border-[#F5EBE9] rounded-xl focus:ring-2 focus:ring-[#E67E6B]/30 focus:border-[#E67E6B] text-[#2D2422] pl-4 pr-10 py-2 outline-none font-work-sans w-full sm:w-48"
              >
                {neighborhoodsList.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3938F] pointer-events-none" />
            </div>

            {/* Noise Level Filter */}
            <div className="relative">
              <select
                value={noiseFilter}
                onChange={(e) => setNoiseFilter(e.target.value)}
                className="appearance-none bg-white border border-[#F5EBE9] rounded-xl focus:ring-2 focus:ring-[#E67E6B]/30 focus:border-[#E67E6B] text-[#2D2422] pl-4 pr-10 py-2 outline-none font-work-sans w-full sm:w-44"
              >
                <option value="all">Any Noise Level</option>
                <option value="quiet">🤫 Quiet</option>
                <option value="moderate">☕ Moderate</option>
                <option value="bustling">⚡ Bustling</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3938F] pointer-events-none" />
            </div>
          </div>

          {/* Quick Amenities Filter Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#F5EBE9]/50">
            <button
              onClick={() => setWifiOnly(!wifiOnly)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-work-sans font-medium transition-all duration-200 ${
                wifiOnly
                  ? "bg-[#E67E6B] text-white border-[#E67E6B]"
                  : "bg-white text-[#6B5C58] border-[#F5EBE9] hover:border-[#E67E6B]/40"
              }`}
            >
              <Wifi size={13} /> Fast WiFi
            </button>
            <button
              onClick={() => setPlugsOnly(!plugsOnly)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-work-sans font-medium transition-all duration-200 ${
                plugsOnly
                  ? "bg-[#E67E6B] text-white border-[#E67E6B]"
                  : "bg-white text-[#6B5C58] border-[#F5EBE9] hover:border-[#E67E6B]/40"
              }`}
            >
              <Plug size={13} /> Abundant Plugs
            </button>
            <button
              onClick={() => setAcOnly(!acOnly)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-work-sans font-medium transition-all duration-200 ${
                acOnly
                  ? "bg-[#E67E6B] text-white border-[#E67E6B]"
                  : "bg-white text-[#6B5C58] border-[#F5EBE9] hover:border-[#E67E6B]/40"
              }`}
            >
              <Snowflake size={13} /> Adequate AC
            </button>

            {(query || selectedNeighborhood !== "All neighborhoods" || wifiOnly || plugsOnly || acOnly || noiseFilter !== "all") && (
              <button
                onClick={clearAll}
                className="text-xs text-[#E67E6B] hover:text-[#D96C5A] font-semibold underline underline-offset-2 ml-auto"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8 flex items-center justify-between border-b border-[#F5EBE9] pb-4">
          <h2 className="text-xl font-outfit text-[#2D2422] font-semibold">
            {filteredAndSortedCafes.length} {filteredAndSortedCafes.length === 1 ? "cafe matches" : "cafes match"}
          </h2>
        </div>

        {cafes.length === 0 ? (
          <div className="text-center py-24 max-w-md mx-auto">
            <div className="inline-flex w-16 h-16 rounded-full bg-[#FFF7F5] border border-[#FDE4DD] items-center justify-center text-[#E67E6B] animate-pulse">
              <Coffee strokeWidth={1.5} size={28} />
            </div>
            <h2 className="mt-6 text-3xl tracking-tight font-medium text-[#2D2422] font-outfit">
              Cafes will be added here soon!
            </h2>
            <p className="mt-3 text-[#6B5C58] font-work-sans leading-relaxed text-sm">
              We haven't listed any independent cafes in {city.name} yet. Check back soon or submit your favorite spot to our curators!
            </p>
          </div>
        ) : filteredAndSortedCafes.length === 0 ? (
          <div className="text-center py-24 max-w-md mx-auto">
            <div className="inline-flex w-16 h-16 rounded-full bg-[#FDE4DD] items-center justify-center text-[#E67E6B]">
              <Coffee strokeWidth={1.5} />
            </div>
            <h2 className="mt-6 text-3xl tracking-tight font-medium text-[#2D2422] font-outfit">
              No cafes match your filters.
            </h2>
            <p className="mt-3 text-[#6B5C58] font-work-sans leading-relaxed">
              Try removing some amenities or search query terms.
            </p>
            <button
              onClick={clearAll}
              className="mt-6 bg-[#E67E6B] text-white hover:bg-[#D96C5A] px-5 py-2.5 rounded-xl font-work-sans font-medium"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedCafes.map((cafe, i) => (
              <div
                key={cafe.dbId}
                className="animate-fade-up relative"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <CafeCard
                  cafe={cafe}
                  imageHeightClass="h-64"
                  // Override card path to support localized directory path
                  to={`/${city.country?.code?.toLowerCase()}/${city.slug}/${cafe.id}`}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
