import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Wifi, ChevronDown, Coffee } from "lucide-react";
import { Header, Footer } from "@/components/site-chrome";
import { CafeCard } from "@/components/cafe-card";
import { cafes, neighborhoods } from "@/lib/cafes";

export const Route = createFileRoute("/directory")({
  head: () => ({
    meta: [
      { title: "Directory — Indie Cafe Hub" },
      { name: "description", content: "Browse every independent cafe in our Bengaluru directory. Filter by neighborhood and WiFi friendliness." },
      { property: "og:title", content: "Cafe Directory — Indie Cafe Hub" },
      { property: "og:description", content: "Browse and filter Bengaluru's independent cafes." },
    ],
  }),
  component: Directory,
});

function Directory() {
  const [query, setQuery] = useState("");
  const [hood, setHood] = useState<(typeof neighborhoods)[number]>("All neighborhoods");
  const [wifiOnly, setWifiOnly] = useState(false);

  const filtered = useMemo(() => {
    return cafes.filter((c) => {
      if (hood !== "All neighborhoods" && c.neighborhood !== hood) return false;
      if (wifiOnly && !c.wifi) return false;
      if (query && !`${c.name} ${c.neighborhood} ${c.blurb}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [query, hood, wifiOnly]);

  const clearAll = () => {
    setQuery("");
    setHood("All neighborhoods");
    setWifiOnly(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF7F5]">
      <Header />

      <div
        className="sticky top-[73px] z-40 bg-white/70 backdrop-blur-xl border-b border-[#F5EBE9] backdrop-saturate-150"
        data-testid="directory-filter-bar"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search size={18} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A3938F]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cafes…"
              data-testid="filter-search-input"
              className="w-full bg-white border border-[#F5EBE9] rounded-xl focus:ring-2 focus:ring-[#E67E6B]/30 focus:border-[#E67E6B] placeholder:text-[#A3938F] pl-11 pr-4 py-2 outline-none font-work-sans"
            />
          </div>
          <div className="relative">
            <select
              value={hood}
              onChange={(e) => setHood(e.target.value as typeof hood)}
              data-testid="filter-neighborhood-select"
              className="appearance-none bg-white border border-[#F5EBE9] rounded-xl focus:ring-2 focus:ring-[#E67E6B]/30 focus:border-[#E67E6B] text-[#2D2422] pl-4 pr-10 py-2 outline-none font-work-sans w-full sm:w-auto"
            >
              {neighborhoods.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <ChevronDown size={16} strokeWidth={1.5} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3938F] pointer-events-none" />
          </div>
          <button
            type="button"
            onClick={() => setWifiOnly((v) => !v)}
            data-testid="filter-wifi-toggle"
            aria-pressed={wifiOnly}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 font-work-sans text-sm ${
              wifiOnly
                ? "bg-[#E67E6B] text-white border-[#E67E6B] hover:bg-[#D96C5A]"
                : "bg-white text-[#6B5C58] border-[#F5EBE9] hover:border-[#E67E6B]/40"
            }`}
          >
            <Wifi size={16} strokeWidth={1.5} /> WiFi Friendly
          </button>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#E67E6B] font-work-sans">
            {filtered.length} {filtered.length === 1 ? "cafe" : "cafes"}
          </p>
          <h1 className="mt-3 text-5xl sm:text-6xl tracking-tight font-light text-[#2D2422] font-outfit">
            The directory
          </h1>
        </div>

        {filtered.length === 0 ? (
          <div
            className="text-center py-24 max-w-md mx-auto"
            data-testid="directory-empty-state"
          >
            <div className="inline-flex w-16 h-16 rounded-full bg-[#FDE4DD] items-center justify-center text-[#E67E6B]">
              <Coffee strokeWidth={1.5} />
            </div>
            <h2 className="mt-6 text-3xl tracking-tight font-medium text-[#2D2422] font-outfit">
              No cafes match — yet.
            </h2>
            <p className="mt-3 text-[#6B5C58] font-work-sans leading-relaxed">
              Try widening your search, or have a look at the whole directory.
            </p>
            <button
              type="button"
              onClick={clearAll}
              data-testid="empty-clear-filters-button"
              className="mt-6 text-[#E67E6B] hover:text-[#D96C5A] font-work-sans font-medium"
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
                <CafeCard
                  cafe={cafe}
                  imageHeightClass={i % 3 === 1 ? "h-80" : "h-64"}
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
