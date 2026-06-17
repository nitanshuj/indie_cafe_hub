import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ArrowRight } from "lucide-react";
import { Header, Footer } from "@/components/site-chrome";
import { CafeCard } from "@/components/cafe-card";
import { cafes } from "@/lib/cafes";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Indie Cafe Hub — Bengaluru's best independent cafes" },
      { name: "description", content: "A curated directory of independent specialty coffee cafes in Bengaluru, hand-picked for nomads and coffee lovers." },
      { property: "og:title", content: "Indie Cafe Hub — Bengaluru" },
      { property: "og:description", content: "Find laptop-friendly, specialty coffee cafes across Bengaluru." },
      { property: "og:image", content: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200&q=80" },
    ],
  }),
  component: Index,
});

const marqueeItems = ["LAPTOP FRIENDLY", "SPECIALTY COFFEE", "LOCAL BAKERY", "FAST WIFI", "INDEPENDENT", "BENGALURU"];

function Index() {
  const featured = cafes.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#FFF7F5]">
      <Header />

      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 sm:pt-28 sm:pb-24 text-center">
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#E67E6B] font-work-sans">
            A Bengaluru cafe directory
          </p>
          <h1 className="mt-6 text-5xl sm:text-6xl tracking-tight font-light text-[#2D2422] font-outfit max-w-3xl mx-auto leading-[1.05]">
            Your city's best indie cafes, found.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-[#6B5C58] font-work-sans max-w-xl mx-auto">
            Hand-picked corners of Bengaluru for specialty coffee, slow mornings, and focused work — no chains, no clutter.
          </p>

          <form
            className="mt-10 max-w-xl mx-auto flex flex-col sm:flex-row gap-3"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="relative flex-1">
              <Search size={18} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A3938F]" />
              <input
                type="search"
                placeholder="Search by name or neighborhood…"
                data-testid="hero-search-input"
                className="w-full bg-white border border-[#F5EBE9] rounded-xl focus:ring-2 focus:ring-[#E67E6B]/30 focus:border-[#E67E6B] placeholder:text-[#A3938F] pl-11 pr-4 py-3 outline-none font-work-sans"
              />
            </div>
            <Link
              to="/directory"
              data-testid="hero-browse-button"
              className="bg-[#E67E6B] text-white hover:bg-[#D96C5A] px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 font-work-sans font-medium inline-flex items-center justify-center gap-2"
            >
              Browse directory <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
          </form>
        </div>

        <div className="relative border-y border-[#F5EBE9] bg-white/40 overflow-hidden py-4">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} className="text-xs uppercase tracking-[0.2em] font-semibold text-[#E67E6B] mx-8 font-work-sans">
                {item} •
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 sm:py-28">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#E67E6B] font-work-sans">Featured this month</p>
            <h2 className="mt-3 text-3xl sm:text-4xl tracking-tight font-medium text-[#2D2422] font-outfit">
              Where Bengaluru is going right now
            </h2>
          </div>
          <Link
            to="/directory"
            data-testid="featured-see-all-link"
            className="text-[#E67E6B] hover:text-[#D96C5A] font-work-sans font-medium inline-flex items-center gap-2"
          >
            See all <ArrowRight size={16} strokeWidth={1.5} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-6">
          <CafeCard cafe={featured[0]} className="md:col-span-8 lg:col-span-8" imageHeightClass="h-80" />
          <CafeCard cafe={featured[1]} className="md:col-span-8 lg:col-span-4" imageHeightClass="h-80" />
          <CafeCard cafe={featured[2]} className="md:col-span-4 lg:col-span-4" imageHeightClass="h-56" />
          <CafeCard cafe={featured[3]} className="md:col-span-4 lg:col-span-4" imageHeightClass="h-56" />
          <CafeCard cafe={featured[4]} className="md:col-span-8 lg:col-span-4" imageHeightClass="h-56" />
        </div>
      </section>

      <Footer />
    </div>
  );
}
