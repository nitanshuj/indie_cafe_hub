import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ArrowRight, Compass } from "lucide-react";
import { Header, Footer } from "@/components/site-chrome";
import { CafeCard } from "@/components/cafe-card";
import { fetchCafes } from "@/lib/cafes";

export const Route = createFileRoute("/")({
  loader: async () => {
    const cafes = await fetchCafes();
    return { featured: cafes.slice(0, 5) };
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
  const { featured } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-[#F5F2EB]">
      <Header />

      {/* ────────────────────────────────────────────────────────────
          SECTION 1 — FEATURED PRECISION CAFES (TOP)
      ──────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pt-14 pb-0">
        {/* Section header */}
        <div className="flex items-end justify-between flex-wrap gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#1A1715]/60">
            Featured Precision Cafes // This Month
          </p>
          <Link
            to="/directory"
            data-testid="featured-see-all-link"
            className="font-mono text-[10px] uppercase tracking-widest text-[#1A1715] hover:underline underline-offset-4"
          >
            See all →
          </Link>
        </div>

        {/* Cafe card grid — strict 2-col, equal row heights via grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {featured.map((cafe) => (
            <CafeCard
              key={cafe.id}
              cafe={cafe}
            />
          ))}
          {featured.length % 2 !== 0 && (
            <Link
              className="flex flex-col items-center justify-center border-2 border-[#1A1715] bg-[#E5E2DA] p-8 text-center hover:bg-[#1A1715] hover:text-[#F5F2EB] transition-colors h-full min-h-[350px]"
              to="/directory"
            >
              <span className="font-mono text-sm tracking-widest uppercase">
                /// DISCOVER MORE SPACES ///
              </span>
              <h3 className="font-sans text-xl font-bold mt-2">
                View All Indexed Cities &amp; Cafes →
              </h3>
            </Link>
          )}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          SECTION 2 — MAIN HERO (MIDDLE)
      ──────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20 sm:py-28">
        <h1 className="font-space-grotesk text-6xl sm:text-7xl lg:text-8xl font-light tracking-tighter text-[#1A1715] max-w-4xl leading-[0.95]">
          Your city's best indie cafes, found.
        </h1>

        {/* Search row */}
        <form
          className="mt-12 max-w-2xl flex flex-col sm:flex-row"
          onSubmit={(e) => e.preventDefault()}
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
              className="w-full border-2 border-[#1A1715] border-r-0 rounded-none bg-white font-mono text-sm text-[#1A1715] placeholder:text-[#1A1715]/40 pl-10 pr-4 py-4 outline-none focus:ring-2 focus:ring-[#1A1715] focus:ring-inset"
            />
          </div>
          <Link
            to="/directory"
            data-testid="hero-browse-button"
            className="border-2 border-[#1A1715] bg-[#1A1715] text-[#F5F2EB] hover:bg-transparent hover:text-[#1A1715] font-mono text-[11px] uppercase tracking-widest px-8 py-4 transition-colors duration-150 whitespace-nowrap inline-flex items-center justify-center gap-2"
          >
            Browse directory <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </form>
      </section>

      {/* ────────────────────────────────────────────────────────────
          SECTION 3 — BREW COMPASS CTA (BOTTOM)
      ──────────────────────────────────────────────────────────── */}
      <section className="border-t-2 border-[#1A1715] max-w-7xl mx-auto px-6 py-16">
        <div className="border-2 border-[#1A1715] bg-[#E5E2DA] p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
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
