import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ArrowRight, Compass, ShieldAlert } from "lucide-react";
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
      { title: "Indie Coffee Hub — Precision Cafe Discovery" },
      {
        name: "description",
        content:
          "A brutalist, data-driven specialty cafe locator directory, hand-picked for nomads and coffee developers.",
      },
      { property: "og:title", content: "Indie Coffee Hub [LAB]" },
      {
        property: "og:description",
        content: "Locate laptop-friendly, high-bandwidth specialty coffee nodes.",
      },
    ],
  }),
  component: Index,
});

const marqueeItems = [
  "LAPTOP FRIENDLY //",
  "SPECIALTY COFFEE //",
  "LOCAL ROASTERY //",
  "FAST WIFI //",
  "INDEPENDENT NODE //",
  "WORLDWIDE MATRIX //",
];

function Index() {
  const { featured } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-[#0F1115]">
      <Header />

      <section className="relative overflow-hidden border-b border-[#2A2E37] py-20 sm:py-28">
        {/* Subtle scanline overlay effect */}
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%]" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1A1D24] border border-[#2A2E37] text-[10px] font-mono uppercase tracking-widest text-[#00F0FF] mb-6">
            <Compass size={12} className="animate-spin" />
            SYS_INIT // CAFE_DISCOVERY_MODULE v2.0 // STATUS: ONLINE
          </div>
          
          <h1 className="text-4xl sm:text-6xl tracking-widest font-black text-cafe-heading font-outfit max-w-4xl mx-auto leading-none uppercase">
            PRECISION CAFE DISCOVERY FOR DIGITAL NOMADS.
          </h1>
          
          <div className="mt-6 inline-block bg-[#1A1D24] border border-[#2A2E37] px-4 py-2">
            <span className="font-mono text-[#00F0FF] text-xs sm:text-sm tracking-wider">
              &gt; LOCATING VERIFIED LAPTOP NODES... [████████░░] 84% // SYNC_STATUS: STABLE
            </span>
          </div>

          <p className="mt-8 text-xs leading-relaxed text-cafe-body font-mono max-w-xl mx-auto uppercase tracking-wider">
            HAND-PICKED MATRIX OF INDEPENDENT SPECIALTY COFFEE STATIONS DESIGNED FOR CONCENTRATED WORKFLOWS. ZERO CHAINS. ZERO STATIC.
          </p>

          <form
            className="mt-10 max-w-xl mx-auto flex flex-col sm:flex-row gap-3"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-cafe-muted"
              />
              <input
                type="search"
                placeholder="QUERY BY NAME OR NEIGHBORHOOD…"
                data-testid="hero-search-input"
                className="w-full bg-[#1A1D24]/40 border border-[#2A2E37] rounded-none focus:border-[#00F0FF] focus:shadow-[inset_0_0_8px_rgba(0,240,255,0.2)] placeholder:text-cafe-muted text-[#00F0FF] pl-11 pr-4 py-3 outline-none font-mono text-xs uppercase tracking-wider"
              />
            </div>
            <Link
              to="/directory"
              data-testid="hero-browse-button"
              className="bg-[#00F0FF] text-[#0F1115] hover:bg-[#00C8D6] hover:shadow-[0_0_12px_rgba(0,240,255,0.5)] px-6 py-3 rounded-none transition-all font-mono text-xs font-bold uppercase tracking-widest inline-flex items-center justify-center gap-2"
            >
              RUN SEARCH <ArrowRight size={14} />
            </Link>
          </form>

          <div className="mt-12 max-w-2xl mx-auto">
            <div className="bg-[#1A1D24] border border-[#2A2E37] p-6 flex flex-col md:flex-row items-center justify-between gap-6 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#FFC857]/10 border-l border-b border-[#FFC857]/30 px-2 py-0.5 text-[9px] font-mono text-[#FFC857] uppercase tracking-wider">
                BREW_SCHOOL.CFG
              </div>
              <div className="flex gap-4 items-start">
                <div className="bg-[#00F0FF]/10 text-[#00F0FF] p-3 border border-[#00F0FF]/30 flex-shrink-0">
                  <ShieldAlert size={20} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="font-mono font-bold text-xs uppercase tracking-widest text-cafe-heading">
                    UNABLE TO DECODE BEVERAGE PARAMETERS?
                  </h3>
                  <p className="mt-1 text-[10px] text-cafe-muted font-mono leading-relaxed uppercase tracking-wider">
                    DECONSTRUCT DRINK FORMULAS, EXAMINE HEAT SPECIFICATIONS AND GRAPH ORIGIN VECTORS VIA <strong className="text-cafe-primary">THE BREW COMPASS MODULE</strong>.
                  </p>
                </div>
              </div>
              <Link
                to="/brew-compass"
                data-testid="hero-brew-compass-cta"
                className="bg-transparent border border-cafe-border hover:border-[#00F0FF] hover:text-[#00F0FF] hover:shadow-[inset_0_0_8px_rgba(0,240,255,0.2)] text-[#E0E0E0] px-5 py-2.5 rounded-none font-mono font-bold text-xs uppercase tracking-widest whitespace-nowrap flex items-center gap-1.5 transition-all"
              >
                <span>LAUNCH_COMPASS</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 border-y border-[#2A2E37] bg-[#0A0C0E] overflow-hidden py-3">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
              <span
                key={i}
                className="text-[10px] uppercase tracking-[0.25em] font-bold text-cafe-primary mx-8 font-mono"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 sm:py-28">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12 border-b border-[#2A2E37] pb-6">
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#00F0FF] font-mono">
              FEATURED_NODES // RECORDED_DEVICES
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl tracking-widest font-bold text-cafe-heading font-outfit uppercase">
              HIGH_ACTIVITY FIELD REPORTS
            </h2>
          </div>
          <Link
            to="/directory"
            data-testid="featured-see-all-link"
            className="text-xs text-cafe-primary hover:text-[#00C8D6] font-mono uppercase tracking-widest inline-flex items-center gap-2"
          >
            INDEX_VIEW [ALL] <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-6">
          {featured.map((cafe, i) => {
            let colSpan = "md:col-span-8 lg:col-span-4";
            let heightClass = "h-56";
            if (i === 0) {
              colSpan = "md:col-span-8 lg:col-span-8";
              heightClass = "h-80";
            } else if (i === 1) {
              colSpan = "md:col-span-8 lg:col-span-4";
              heightClass = "h-80";
            }
            return (
              <CafeCard
                key={cafe.id}
                cafe={cafe}
                className={colSpan}
                imageHeightClass={heightClass}
              />
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}
