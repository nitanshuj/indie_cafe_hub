import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Globe, X } from "lucide-react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

export const Route = createFileRoute("/brew-compass/coffee-atlas")({
  head: () => ({
    meta: [
      { title: "The Coffee Atlas — World Coffee Origins | Brew School" },
      {
        name: "description",
        content:
          "Explore top coffee-producing countries on an interactive world map. Click country pins to reveal origin profiles, processing methods, and signature flavors.",
      },
    ],
  }),
  component: CoffeeAtlasPage,
});

// ─── Data ────────────────────────────────────────────────────────────────────
interface CoffeeOrigin {
  id: string;
  country: string;
  flag: string;
  region: string;
  coordinates: [number, number]; // [longitude, latitude]
  production: string;
  altitude: string;
  processing: string[];
  varieties: string[];
  flavorNotes: string[];
  bestFor: string;
  funFact: string;
}

const ORIGINS: CoffeeOrigin[] = [
  {
    id: "ethiopia",
    country: "Ethiopia",
    flag: "🇪🇹",
    region: "East Africa",
    coordinates: [39.7823, 9.145], // lng, lat
    production: "~500,000 tonnes/year",
    altitude: "1,500m – 2,200m",
    processing: ["Natural / Dry", "Washed", "Honey"],
    varieties: ["Heirloom Landrace", "Yirgacheffe", "Sidama"],
    flavorNotes: ["Blueberry", "Jasmine", "Bergamot", "Dark Chocolate", "Wine"],
    bestFor: "Pour-over, Filter, Cold Brew",
    funFact:
      "Ethiopia is the birthplace of coffee. Legend says a goat herder named Kaldi discovered coffee around 850 AD.",
  },
  {
    id: "colombia",
    country: "Colombia",
    flag: "🇨🇴",
    region: "South America",
    coordinates: [-74.2973, 4.5709],
    production: "~930,000 tonnes/year",
    altitude: "1,200m – 1,800m",
    processing: ["Washed", "Natural"],
    varieties: ["Caturra", "Castillo", "Colombia"],
    flavorNotes: ["Caramel", "Red Apple", "Panela", "Citrus", "Hazelnut"],
    bestFor: "Espresso, Flat White, Drip",
    funFact:
      "Colombia grows only Arabica and produces coffee all year due to two harvest seasons per year.",
  },
  {
    id: "brazil",
    country: "Brazil",
    flag: "🇧🇷",
    region: "South America",
    coordinates: [-51.9253, -14.235],
    production: "~3,800,000 tonnes/year",
    altitude: "500m – 1,200m",
    processing: ["Natural", "Pulped Natural", "Washed"],
    varieties: ["Bourbon", "Mundo Novo", "Catuaí"],
    flavorNotes: [
      "Dark Chocolate",
      "Peanut",
      "Brown Sugar",
      "Low Acidity",
      "Full Body",
    ],
    bestFor: "Espresso blends, French Press, Moka Pot",
    funFact:
      "Brazil is the world's largest coffee producer, accounting for ~40% of global supply.",
  },
  {
    id: "kenya",
    country: "Kenya",
    flag: "🇰🇪",
    region: "East Africa",
    coordinates: [37.9062, -1.2921],
    production: "~50,000 tonnes/year",
    altitude: "1,400m – 2,000m",
    processing: ["Washed (Double Fermentation)"],
    varieties: ["SL28", "SL34", "Ruiru 11"],
    flavorNotes: ["Blackcurrant", "Grapefruit", "Tomato", "Berry", "Winey"],
    bestFor: "Pour-over, Filter, Black Espresso",
    funFact:
      "Kenya's unique 'double wash' fermentation process produces some of the most intense, wine-like flavors in specialty coffee.",
  },
  {
    id: "yemen",
    country: "Yemen",
    flag: "🇾🇪",
    region: "Middle East",
    coordinates: [48.5164, 15.5527],
    production: "~20,000 tonnes/year",
    altitude: "1,500m – 2,500m",
    processing: ["Natural / Dry (ancient method)"],
    varieties: ["Mocha", "Ismaili", "Tufahi"],
    flavorNotes: ["Chocolate", "Wild Berry", "Earthy", "Spice", "Wine"],
    bestFor: "Turkish Coffee, Espresso, Drip",
    funFact:
      "Yemen is where coffee was first commercially cultivated. The port city of Mocha gave its name to chocolate-coffee drinks.",
  },
  {
    id: "guatemala",
    country: "Guatemala",
    flag: "🇬🇹",
    region: "Central America",
    coordinates: [-90.2308, 15.7835],
    production: "~230,000 tonnes/year",
    altitude: "1,500m – 1,700m",
    processing: ["Washed", "Natural"],
    varieties: ["Bourbon", "Caturra", "Typica"],
    flavorNotes: [
      "Dark Chocolate",
      "Brown Sugar",
      "Spice",
      "Stone Fruit",
      "Medium Acidity",
    ],
    bestFor: "Espresso, Cappuccino, Drip",
    funFact:
      "Guatemala has 8 distinct coffee-growing regions, each producing a uniquely different cup profile.",
  },
  {
    id: "indonesia",
    country: "Indonesia",
    flag: "🇮🇩",
    region: "Southeast Asia",
    coordinates: [113.9213, -0.7893],
    production: "~660,000 tonnes/year",
    altitude: "1,000m – 1,500m",
    processing: ["Wet-Hulled (Giling Basah)", "Natural", "Washed"],
    varieties: ["Sumatra Mandheling", "Java", "Sulawesi"],
    flavorNotes: ["Cedar", "Earthy", "Dark Chocolate", "Tobacco", "Herbal"],
    bestFor: "French Press, Espresso Blends, Moka Pot",
    funFact:
      "Indonesia's unique 'wet-hulling' process gives Sumatran coffee its distinctively full body and low acidity.",
  },
  {
    id: "india",
    country: "India",
    flag: "🇮🇳",
    region: "South Asia",
    coordinates: [78.9629, 20.5937],
    production: "~390,000 tonnes/year",
    altitude: "600m – 1,600m",
    processing: ["Washed", "Natural", "Monsoon Malabar"],
    varieties: ["Arabica S795", "Robusta", "Chandragiri"],
    flavorNotes: [
      "Chocolate",
      "Spice",
      "Earthy",
      "Low Acidity",
      "Full Body",
    ],
    bestFor: "Espresso blends, Filter Coffee (South Indian style)",
    funFact:
      "India's 'Monsoon Malabar' process exposes beans to monsoon winds for 3-4 months, creating a uniquely low-acid, heavy-body coffee.",
  },
];

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// ─── Passport Stamp card ──────────────────────────────────────────────────────
function PassportStamp({
  origin,
  onClose,
}: {
  origin: CoffeeOrigin;
  onClose: () => void;
}) {
  return (
    <div className="bg-white border-2 border-dashed border-cafe-border rounded-2xl overflow-hidden shadow-xl animate-fade-in">
      <div className="bg-cafe-primary px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{origin.flag}</span>
          <div>
            <p className="text-white font-outfit font-semibold text-lg leading-tight">
              {origin.country}
            </p>
            <p className="text-white/70 text-xs font-work-sans">
              {origin.region}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors p-1 rounded-full cursor-pointer"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-cafe-bg rounded-xl p-3 space-y-0.5">
            <p className="text-[10px] uppercase tracking-wider font-bold text-cafe-primary font-work-sans">
              Production
            </p>
            <p className="text-xs font-semibold text-cafe-heading font-outfit">
              {origin.production}
            </p>
          </div>
          <div className="bg-cafe-bg rounded-xl p-3 space-y-0.5">
            <p className="text-[10px] uppercase tracking-wider font-bold text-cafe-primary font-work-sans">
              Altitude
            </p>
            <p className="text-xs font-semibold text-cafe-heading font-outfit">
              {origin.altitude}
            </p>
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-cafe-heading font-work-sans mb-1.5">
            Processing Methods
          </p>
          <div className="flex flex-wrap gap-1.5">
            {origin.processing.map((p) => (
              <span
                key={p}
                className="text-[10px] bg-[#FDE4DD] text-cafe-primary font-semibold font-work-sans px-2 py-0.5 rounded-full"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-cafe-heading font-work-sans mb-1.5">
            Varieties Grown
          </p>
          <div className="flex flex-wrap gap-1.5">
            {origin.varieties.map((v) => (
              <span
                key={v}
                className="text-[10px] bg-cafe-bg border border-cafe-border text-cafe-body font-work-sans px-2 py-0.5 rounded-full"
              >
                {v}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-cafe-heading font-work-sans mb-1.5">
            Signature Flavor Notes
          </p>
          <div className="flex flex-wrap gap-1.5">
            {origin.flavorNotes.map((n) => (
              <span
                key={n}
                className="text-[10px] bg-amber-50 border border-amber-200 text-amber-800 font-work-sans px-2 py-0.5 rounded-full"
              >
                {n}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-2 bg-cafe-bg/60 border border-cafe-border rounded-xl p-3">
          <Globe
            size={13}
            className="text-cafe-primary mt-0.5 flex-shrink-0"
            strokeWidth={1.5}
          />
          <div>
            <p className="text-[10px] font-bold text-cafe-heading font-work-sans uppercase tracking-wide mb-0.5">
              Best For
            </p>
            <p className="text-xs text-cafe-body font-work-sans">
              {origin.bestFor}
            </p>
          </div>
        </div>

        <div className="border-t border-cafe-border pt-3">
          <p className="text-[10px] font-bold text-cafe-primary font-work-sans uppercase tracking-wider mb-1">
            Did You Know?
          </p>
          <p className="text-xs text-cafe-body font-work-sans leading-relaxed italic">
            {origin.funFact}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function CoffeeAtlasPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeOrigin = ORIGINS.find((o) => o.id === activeId) ?? null;
  const handlePinClick = (id: string) =>
    setActiveId((prev) => (prev === id ? null : id));

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 sm:py-16 space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-work-sans text-cafe-muted">
        <Link
          to="/brew-compass"
          className="hover:text-cafe-primary transition-colors"
        >
          Brew School
        </Link>
        <span>/</span>
        <span className="text-cafe-heading font-medium">
          The Coffee Atlas
        </span>
      </nav>

      {/* Header */}
      <section className="space-y-4 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] font-semibold text-cafe-primary font-work-sans">
          Module 6
        </p>
        <h1 className="text-4xl sm:text-5xl font-light text-cafe-heading font-outfit leading-tight">
          The Coffee Atlas
        </h1>
        <p className="text-base text-cafe-body font-work-sans leading-relaxed">
          Coffee grows within the "Bean Belt" — a tropical band between the
          Tropics of Cancer and Capricorn. Click any pin on the map to reveal
          that country's origin passport.
        </p>
      </section>

      {/* Map + Passport */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 bg-white border border-cafe-border rounded-2xl overflow-hidden shadow-sm p-4">
          <div className="bg-[#BFDBFE] rounded-xl overflow-hidden relative">
             <ComposableMap
              projectionConfig={{
                scale: 147,
              }}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#E2D4CC"
                      stroke="#C0A898"
                      strokeWidth={0.5}
                      className="hover:fill-stone-300 outline-none transition-colors duration-200"
                    />
                  ))
                }
              </Geographies>
              {ORIGINS.map((origin) => {
                 const isActive = activeId === origin.id;
                 return (
                  <Marker
                    key={origin.id}
                    coordinates={origin.coordinates}
                    onClick={() => handlePinClick(origin.id)}
                    className="cursor-pointer focus:outline-none"
                  >
                     {isActive && (
                      <circle
                        r={12}
                        fill="rgba(224,107,92,0.3)"
                        className="animate-ping origin-center"
                      />
                    )}
                    <circle
                      r={4}
                      fill={isActive ? "#E67E6B" : "#4A2C11"}
                      stroke="#fff"
                      strokeWidth={1.5}
                      className="transition-colors"
                    />
                  </Marker>
                 )
              })}
            </ComposableMap>
            <span
              className="absolute right-3 top-3 text-[10px] font-bold text-amber-700/70 font-work-sans bg-white/70 backdrop-blur-sm px-2 py-1 rounded-full pointer-events-none"
            >
              ☀ Bean Belt
            </span>
          </div>

          <p className="text-center text-[10px] text-cafe-muted font-work-sans mt-3 flex items-center justify-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#4A2C11] align-middle" />
            Click a pin to open the origin passport
          </p>
        </div>

        <div className="lg:col-span-1">
          {activeOrigin ? (
            <PassportStamp
              origin={activeOrigin}
              onClose={() => setActiveId(null)}
            />
          ) : (
            <div className="bg-white border-2 border-dashed border-cafe-border rounded-2xl p-10 text-center space-y-3">
              <Globe
                size={32}
                strokeWidth={1}
                className="text-cafe-border mx-auto"
              />
              <p className="text-sm font-semibold text-cafe-heading font-outfit">
                Select a country
              </p>
              <p className="text-xs text-cafe-muted font-work-sans">
                Click any map pin to reveal the origin's passport — production
                data, processing methods, and signature flavor notes.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Country grid */}
      <section className="space-y-6">
        <h2 className="text-xl font-medium text-cafe-heading font-outfit">
          All Origins
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ORIGINS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => handlePinClick(o.id)}
              className={`text-left p-4 rounded-2xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer ${
                activeId === o.id
                  ? "border-cafe-primary ring-2 ring-cafe-primary/20 bg-[#FDE4DD]/30"
                  : "border-cafe-border bg-white"
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-2xl">{o.flag}</span>
                <div>
                  <p className="text-sm font-semibold text-cafe-heading font-outfit leading-tight">
                    {o.country}
                  </p>
                  <p className="text-[10px] text-cafe-muted font-work-sans">
                    {o.region}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {o.flavorNotes.slice(0, 3).map((n) => (
                  <span
                    key={n}
                    className="text-[10px] bg-cafe-bg text-cafe-body font-work-sans px-1.5 py-0.5 rounded-full border border-cafe-border"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Module nav */}
      <div className="flex items-center justify-between pt-4 border-t border-cafe-border">
        <Link
          to="/brew-compass/bean-roast-spectrum"
          className="inline-flex items-center gap-2 text-sm text-cafe-body hover:text-cafe-heading font-work-sans transition-colors"
        >
          <ArrowLeft size={15} /> Bean &amp; Roast Spectrum
        </Link>
        <Link
          to="/brew-compass"
          className="inline-flex items-center gap-2 text-sm text-cafe-primary hover:text-cafe-primary-hover font-semibold font-work-sans transition-colors"
        >
          Back to Brew School Hub <Globe size={14} />
        </Link>
      </div>
    </main>
  );
}
