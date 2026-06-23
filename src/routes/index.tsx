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

const marqueeItems = [
  "LAPTOP FRIENDLY",
  "SPECIALTY COFFEE",
  "LOCAL BAKERY",
  "FAST WIFI",
  "INDEPENDENT",
  "WORLDWIDE",
];

function Index() {
  const { featured } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-cafe-bg">
      <Header />

      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 sm:pt-28 sm:pb-24 text-center">
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-cafe-primary font-work-sans">
            A global specialty cafe directory
          </p>
          <h1 className="mt-6 text-5xl sm:text-6xl tracking-tight font-light text-cafe-heading font-outfit max-w-3xl mx-auto leading-[1.05]">
            Your city's best indie cafes, found.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-cafe-body font-work-sans max-w-xl mx-auto">
            Hand-picked corners of the world for specialty coffee, slow mornings, and focused work —
            no chains, no clutter.
          </p>

          <form
            className="mt-10 max-w-xl mx-auto flex flex-col sm:flex-row gap-3"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="relative flex-1">
              <Search
                size={18}
                strokeWidth={1.5}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-cafe-muted"
              />
              <input
                type="search"
                placeholder="Search by name or neighborhood…"
                data-testid="hero-search-input"
                className="w-full bg-white border border-[#F5EBE9] rounded-xl focus:ring-2 focus:ring-cafe-primary/30 focus:border-cafe-primary placeholder:text-cafe-muted pl-11 pr-4 py-3 outline-none font-work-sans"
              />
            </div>
            <Link
              to="/directory"
              data-testid="hero-browse-button"
              className="bg-cafe-primary text-white hover:bg-cafe-primary-hover px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 font-work-sans font-medium inline-flex items-center justify-center gap-2"
            >
              Browse directory <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
          </form>

          <div className="mt-12 max-w-2xl mx-auto">
            <div className="bg-cafe-primary-light/30 backdrop-blur-md border border-cafe-primary-light rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-left shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex gap-4 items-start">
                <div className="bg-cafe-primary-light text-cafe-primary p-3.5 rounded-2xl flex-shrink-0">
                  <Compass size={28} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="font-outfit font-semibold text-lg text-cafe-heading">
                    Wanna know more about coffee?
                  </h3>
                  <p className="mt-1 text-sm text-cafe-body font-work-sans leading-relaxed">
                    Decode drink menus, understand roast profiles, and explore origin regions with <strong>The Brew Compass</strong>.
                  </p>
                </div>
              </div>
              <Link
                to="/brew-compass"
                data-testid="hero-brew-compass-cta"
                className="bg-cafe-primary hover:bg-cafe-primary-hover text-white px-5 py-2.5 rounded-xl font-work-sans font-semibold text-sm transition-all whitespace-nowrap flex items-center gap-1.5 hover:-translate-y-0.5"
              >
                <span>Open Compass</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        <div className="relative border-y border-cafe-border bg-white/40 overflow-hidden py-4">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
              <span
                key={i}
                className="text-xs uppercase tracking-[0.2em] font-semibold text-cafe-primary mx-8 font-work-sans"
              >
                {item} •
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 sm:py-28">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-cafe-primary font-work-sans">
              Featured this month
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl tracking-tight font-medium text-cafe-heading font-outfit">
              Where people are going right now
            </h2>
          </div>
          <Link
            to="/directory"
            data-testid="featured-see-all-link"
            className="text-cafe-primary hover:text-cafe-primary-hover font-work-sans font-medium inline-flex items-center gap-2"
          >
            See all <ArrowRight size={16} strokeWidth={1.5} />
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
