import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ArrowRight, Compass } from "lucide-react";
import { Header, Footer } from "@/components/site-chrome";
import { MagazineCard } from "@/components/magazine-card";
import { fetchFeaturedCafes } from "@/lib/cafes";

export const Route = createFileRoute("/")({
  loader: async () => {
    const cafes = await fetchFeaturedCafes();
    return { cafes };
  },
  head: () => ({
    meta: [
      { title: "Indie Coffee Hub — The best independent cafes" },
      {
        name: "description",
        content:
          "A curated directory of independent specialty coffee cafes, hand-picked for nomads and coffee lovers.",
      },
      { property: "og:title", content: "Indie Coffee Hub" },
      {
        property: "og:description",
        content: "Find laptop-friendly, specialty coffee cafes worldwide.",
      },
    ],
  }),
  component: Index,
});

// Monospace data ticker items — replaces the old image marquee
const tickerItems = [
  "985 CAFES INDEXED",
  "42 CITIES",
  "LIVE DATA",
  "SPECIALTY ONLY",
  "NO CHAINS",
  "INDIE VERIFIED",
  "LAPTOP FRIENDLY",
  "PRECISION ROASTED",
];

function Index() {
  const { cafes } = Route.useLoaderData();
  const [searchVal, setSearchVal] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void navigate({
      to: "/directory",
      search: { query: searchVal, page: 1 }
    });
  };

  return (
    <div
      className="min-h-screen bg-[#F5F2EB] bg-fixed bg-center bg-cover bg-no-repeat"
      style={{
        backgroundImage: 'linear-gradient(rgba(245, 242, 235, 0.93), rgba(245, 242, 235, 0.93)), url("https://res.cloudinary.com/daon1coiv/image/upload/v1782759373/hario_v60_cover_letter_mhb4rd.png")',
        backgroundBlendMode: 'multiply',
      }}
    >
      <Header />

      {/* ────────────────────────────────────────────────────────────
          SECTION 2 — MAIN HERO (TOP)
      ──────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20 sm:py-28">
        <div className="bg-[#F5F2EB]/85 backdrop-blur-sm border-2 border-[#1A1715] p-6 sm:p-8 max-w-4xl shadow-[4px_4px_0px_#1A1715]">
          <h1 className="font-space-grotesk text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#1A1715] leading-[0.95]">
            Your city's best indie cafes, found.
          </h1>
        </div>

        {/* Search row */}
        <form
          className="mt-12 max-w-2xl flex flex-col sm:flex-row gap-3 sm:gap-0"
          onSubmit={handleSearchSubmit}
        >
          <div className="relative flex-1">
            <Search
              size={16}
              strokeWidth={1.5}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A1715]/40 pointer-events-none"
            />
            <input
              type="search"
              placeholder="Search by city, neighborhood, or name..."
              data-testid="hero-search-input"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full border-2 sm:border-r-0 border-[#1A1715] rounded-none bg-white font-mono text-sm text-[#1A1715] placeholder:text-[#1A1715]/40 pl-10 pr-4 py-4 outline-none focus:ring-2 focus:ring-[#1A1715] focus:ring-inset"
            />
          </div>
          <button
            type="submit"
            data-testid="hero-browse-button"
            className="border-2 border-[#1A1715] bg-[#1A1715] text-[#F5F2EB] hover:bg-[#F5F2EB] hover:text-[#1A1715] font-mono text-[11px] uppercase tracking-widest px-8 py-4 transition-colors duration-150 whitespace-nowrap inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            Search Directory <ArrowRight size={14} strokeWidth={1.5} />
          </button>
        </form>
      </section>

      {/* ────────────────────────────────────────────────────────────
          SECTION 1 — FEATURED CAFES
      ──────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pt-14 pb-0">
        {/* Section header */}
        <div className="flex items-end justify-between flex-wrap gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#1A1715]/60">
            Featured Cafes // Handpicked
          </p>
          <Link
            to="/directory"
            data-testid="featured-see-all-link"
            className="font-mono text-[10px] uppercase tracking-widest text-[#1A1715] hover:underline underline-offset-4"
          >
            See all →
          </Link>
        </div>

        {/* Empty state */}
        {cafes.length === 0 ? (
          <div className="mt-6 border-2 border-dashed border-[#1A1715]/20 py-20 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#1A1715]/40">
              No featured cafes yet
            </p>
            <p className="mt-2 font-mono text-[9px] uppercase tracking-widest text-[#1A1715]/25">
              Admins can feature cafes from the dashboard
            </p>
          </div>
        ) : (
          <div className="space-y-4 mt-8 flex flex-col">
            {cafes.map((cafe, index) => {
              const alignClass = index % 2 === 0 ? "self-start" : "self-end";
              return (
                <div key={cafe.id} className={`w-full lg:w-[65%] ${alignClass}`}>
                  <MagazineCard
                    cafe={cafe}
                    index={index}
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ────────────────────────────────────────────────────────────
          SECTION 3 — BREW COMPASS CTA (BOTTOM)
      ──────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="border-2 border-[#1A1715] bg-cafe-surface p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Left block */}
          <div>
            <Compass size={22} strokeWidth={1} className="text-[#1A1715] mb-5" />
            <h3 className="font-space-grotesk text-2xl font-medium text-[#1A1715] tracking-tight">
              Wanna know more about coffee?
            </h3>
            <p className="mt-3 font-mono text-[11px] text-[#1A1715]/60 leading-relaxed max-w-sm">
              // DECODE DRINK MENUS. UNDERSTAND ROAST PROFILES.<br />
              // EXPLORE ORIGIN REGIONS WITH THE BREW COMPASS.
            </p>
          </div>

          {/* CTA button */}
          <Link
            to="/brew-compass"
            data-testid="hero-brew-compass-cta"
            className="border-2 border-[#1A1715] bg-[#1A1715] text-[#F5F2EB] hover:bg-transparent hover:text-[#1A1715] font-mono text-[11px] uppercase tracking-widest px-7 py-3.5 transition-colors duration-150 whitespace-nowrap inline-flex items-center gap-2.5 flex-shrink-0"
          >
            Open Compass <ArrowRight size={13} strokeWidth={1.5} />
          </Link>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          SECTION 4 — MONOSPACE DATA TICKER (BOTTOM STRIP)
          Text-only ticker on Ristretto Black — kinetic but not chaotic
      ──────────────────────────────────────────────────────────── */}
      <div className="border-t-2 border-[#1A1715] bg-[#1A1715] overflow-hidden py-3">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
            <span
              key={i}
              className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#F5F2EB]/50 mx-10"
            >
              /// {item}
            </span>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
