import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Flame } from "lucide-react";

export const Route = createFileRoute("/brew-compass/bean-roast-spectrum")({
  head: () => ({
    meta: [
      { title: "Bean & Roast Spectrum — Arabica vs Robusta | Brew School" },
      {
        name: "description",
        content:
          "Compare Arabica and Robusta coffee beans side by side, then drag the interactive roast slider to explore how heat transforms coffee flavour.",
      },
    ],
  }),
  component: BeanRoastSpectrumPage,
});

// ─── Roast data ───────────────────────────────────────────────────────────────
interface RoastStop {
  label: string;
  temp: string;
  beanFill: string;
  beanShadow: string;
  acidity: number;
  body: number;
  sweetness: number;
  bitterness: number;
  notes: string[];
  description: string;
}

const ROAST_STOPS: RoastStop[] = [
  {
    label: "Green / Unroasted",
    temp: "Below 196°C",
    beanFill: "#8BAF72",
    beanShadow: "#6A8A56",
    acidity: 100,
    body: 10,
    sweetness: 30,
    bitterness: 5,
    notes: ["Grassy", "Herbaceous", "Raw Grain", "Hay"],
    description:
      "The raw, unroasted coffee bean. Dense, hard, and greenish. Smells grassy rather than coffee-like. Not suitable for brewing — all flavour potential is still locked inside.",
  },
  {
    label: "Light Roast",
    temp: "196°C – 205°C",
    beanFill: "#C8956A",
    beanShadow: "#A87350",
    acidity: 85,
    body: 30,
    sweetness: 60,
    bitterness: 10,
    notes: ["Floral", "Citrus", "Berry", "Stone Fruit", "Tea-like"],
    description:
      "The first crack occurs around 196°C. Light roasts preserve the bean's origin flavours. High-acidity, light body, and delicate complexity. Ideal for pour-overs like V60 or Chemex.",
  },
  {
    label: "Medium Roast",
    temp: "210°C – 220°C",
    beanFill: "#8C5A35",
    beanShadow: "#6E4427",
    acidity: 55,
    body: 65,
    sweetness: 75,
    bitterness: 35,
    notes: ["Caramel", "Chocolate", "Nuts", "Brown Sugar", "Dried Fruit"],
    description:
      "The sweet spot between origin character and roast flavour. Balanced acidity and sweetness. Caramel and chocolate notes develop here. Great for espresso, flat whites, and lattes.",
  },
  {
    label: "Medium-Dark Roast",
    temp: "225°C – 230°C",
    beanFill: "#5E3320",
    beanShadow: "#452415",
    acidity: 30,
    body: 80,
    sweetness: 50,
    bitterness: 65,
    notes: ["Dark Chocolate", "Roasted Nuts", "Spice", "Toffee", "Cedar"],
    description:
      "Oils begin to surface on the bean. The second crack starts around 225°C. Roasty, bittersweet character dominates. Good for espresso blends and milk-based drinks.",
  },
  {
    label: "Dark Roast",
    temp: "230°C – 245°C",
    beanFill: "#2E1810",
    beanShadow: "#1A0C06",
    acidity: 10,
    body: 95,
    sweetness: 20,
    bitterness: 90,
    notes: ["Smoke", "Dark Chocolate", "Charcoal", "Tar", "Bold Spice"],
    description:
      "The second crack is fully passed. Bean oils are visible on the surface. Very low acidity, heavy body. Intense, bold flavour that holds up to milk. Origin characteristics are mostly lost to roast.",
  },
];

// Helper to interpolate between two hex colors
function interpolateColor(color1: string, color2: string, factor: number): string {
  const r1 = parseInt(color1.substring(1, 3), 16);
  const g1 = parseInt(color1.substring(3, 5), 16);
  const b1 = parseInt(color1.substring(5, 7), 16);

  const r2 = parseInt(color2.substring(1, 3), 16);
  const g2 = parseInt(color2.substring(3, 5), 16);
  const b2 = parseInt(color2.substring(5, 7), 16);

  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));

  const rHex = r.toString(16).padStart(2, "0");
  const gHex = g.toString(16).padStart(2, "0");
  const bHex = b.toString(16).padStart(2, "0");

  return `#${rHex}${gHex}${bHex}`;
}

// ─── Arabica vs Robusta data ──────────────────────────────────────────────────
const BEAN_COMPARISON = [
  { spec: "Species", arabica: "Coffea arabica", robusta: "Coffea canephora" },
  { spec: "Caffeine Content", arabica: "1.2% – 1.5%", robusta: "2.2% – 2.7%" },
  { spec: "Acidity", arabica: "High — bright & complex", robusta: "Low — flat & bitter" },
  { spec: "Sugar Content", arabica: "~6–9%", robusta: "~3–7%" },
  { spec: "Flavour Profile", arabica: "Fruity, Floral, Delicate", robusta: "Earthy, Harsh, Nutty" },
  { spec: "Body", arabica: "Light to Medium", robusta: "Heavy, Thick" },
  { spec: "Growing Altitude", arabica: "600m – 2,000m", robusta: "0m – 800m" },
  { spec: "Climate Sensitivity", arabica: "Very sensitive (prone to disease)", robusta: "Hardy & disease-resistant" },
  { spec: "Crop Yield", arabica: "Lower", robusta: "Higher (2x)" },
  { spec: "Price", arabica: "Premium", robusta: "Commodity" },
  { spec: "Best For", arabica: "Specialty, pour-over, single origin", robusta: "Espresso blends, instant coffee" },
  { spec: "Global Market Share", arabica: "~60%", robusta: "~40%" },
];

// ─── Bean SVG ─────────────────────────────────────────────────────────────────
function CoffeeBeanSVG({ fill, shadow }: { fill: string; shadow: string }) {
  return (
    <svg
      viewBox="0 0 120 160"
      xmlns="http://www.w3.org/2000/svg"
      className="w-28 h-40 drop-shadow-xl transition-all duration-300 ease-out mx-auto"
      aria-hidden="true"
    >
      {/* Main bean shape */}
      <ellipse cx="60" cy="80" rx="48" ry="68" fill={fill} />
      {/* Shadow side */}
      <ellipse cx="70" cy="85" rx="28" ry="55" fill={shadow} opacity="0.4" />
      {/* Center crease */}
      <path
        d="M60 18 Q55 80 60 142"
        stroke={shadow}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Highlight */}
      <ellipse cx="44" cy="55" rx="10" ry="18" fill="white" opacity="0.12" />
    </svg>
  );
}

// ─── Stat bar ─────────────────────────────────────────────────────────────────
function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-work-sans">
        <span className="text-cafe-body">{label}</span>
        <span className="font-semibold text-cafe-heading">{value}%</span>
      </div>
      <div className="h-2 bg-cafe-bg rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function BeanRoastSpectrumPage() {
  const [sliderValue, setSliderValue] = useState(25); // 0 to 100 continuous slider

  // Interpolate state properties based on sliderValue (0 to 100)
  const getInterpolatedRoast = (value: number) => {
    // 5 stops, each covers 25 points: 0, 25, 50, 75, 100
    const stepSize = 100 / (ROAST_STOPS.length - 1);
    const index = Math.floor(value / stepSize);
    const stop1 = ROAST_STOPS[index];
    const stop2 = ROAST_STOPS[Math.min(index + 1, ROAST_STOPS.length - 1)];
    const factor = (value % stepSize) / stepSize;

    // Nearest stop for discrete values like description and title
    const nearestIndex = Math.round(value / stepSize);
    const nearestStop = ROAST_STOPS[nearestIndex];

    const beanFill = interpolateColor(stop1.beanFill, stop2.beanFill, factor);
    const beanShadow = interpolateColor(stop1.beanShadow, stop2.beanShadow, factor);
    const acidity = Math.round(stop1.acidity + factor * (stop2.acidity - stop1.acidity));
    const body = Math.round(stop1.body + factor * (stop2.body - stop1.body));
    const sweetness = Math.round(stop1.sweetness + factor * (stop2.sweetness - stop1.sweetness));
    const bitterness = Math.round(stop1.bitterness + factor * (stop2.bitterness - stop1.bitterness));

    return {
      label: nearestStop.label,
      temp: nearestStop.temp,
      description: nearestStop.description,
      notes: nearestStop.notes,
      beanFill,
      beanShadow,
      acidity,
      body,
      sweetness,
      bitterness,
    };
  };

  const roast = getInterpolatedRoast(sliderValue);

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 sm:py-16 space-y-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-work-sans text-cafe-muted">
        <Link to="/brew-compass" className="hover:text-cafe-primary transition-colors">
          Brew School
        </Link>
        <span>/</span>
        <span className="text-cafe-heading font-medium">Bean & Roast Spectrum</span>
      </nav>

      {/* Header */}
      <section className="space-y-4 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] font-semibold text-cafe-primary font-work-sans">
          Module 6
        </p>
        <h1 className="text-4xl sm:text-5xl font-light text-cafe-heading font-outfit leading-tight">
          Bean & Roast Spectrum
        </h1>
        <p className="text-base text-cafe-body font-work-sans leading-relaxed">
          Compare the two dominant coffee species and drag the roast slider to
          see how temperature transforms a single bean's colour, flavour, and
          chemistry in real time.
        </p>
      </section>

      {/* ── Arabica vs Robusta Table ── */}
      <section className="space-y-6">
        <div className="border-b border-cafe-border pb-3 flex items-center gap-3">
          <h2 className="text-2xl font-medium text-cafe-heading font-outfit">
            Arabica vs Robusta
          </h2>
        </div>

        <div className="bg-white border border-cafe-border rounded-2xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-3 bg-cafe-bg/60 border-b border-cafe-border px-4 py-3 text-xs font-bold font-work-sans text-cafe-heading uppercase tracking-wider">
            <span>Characteristic</span>
            <span className="text-cafe-primary text-center">Arabica</span>
            <span className="text-center text-slate-600">Robusta</span>
          </div>
          {BEAN_COMPARISON.map((row, i) => (
            <div
              key={row.spec}
              className={`grid grid-cols-3 px-4 py-3.5 text-xs font-work-sans border-b border-cafe-border/50 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-cafe-bg/30"}`}
            >
              <span className="font-semibold text-cafe-heading">{row.spec}</span>
              <span className="text-cafe-body text-center">{row.arabica}</span>
              <span className="text-cafe-body text-center">{row.robusta}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Interactive Roast Slider ── */}
      <section className="space-y-8">
        <div className="border-b border-cafe-border pb-3 flex items-center gap-3">
          <Flame size={20} strokeWidth={1.5} className="text-cafe-primary" />
          <h2 className="text-2xl font-medium text-cafe-heading font-outfit">
            The Roast Spectrum
          </h2>
        </div>

        <p className="text-sm text-cafe-body font-work-sans max-w-xl">
          Drag the continuous slider below to dynamically roast the coffee bean. Notice how it smoothly transforms from light green to cinnamon and dark chocolate brown.
        </p>

        {/* Slider + Bean visual */}
        <div className="bg-white border border-cafe-border rounded-2xl p-8 shadow-sm space-y-8">
          {/* Bean + profile side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Animated bean SVG */}
            <div className="flex flex-col items-center gap-4">
              <div className="h-44 flex items-center justify-center">
                <CoffeeBeanSVG fill={roast.beanFill} shadow={roast.beanShadow} />
              </div>
              <div className="text-center space-y-1">
                <p className="text-lg font-semibold text-cafe-heading font-outfit">
                  {roast.label}
                </p>
                <p className="text-xs text-cafe-muted font-work-sans">{roast.temp}</p>
              </div>
            </div>

            {/* Profile stats */}
            <div className="space-y-5">
              <div className="space-y-3">
                <StatBar label="Acidity" value={roast.acidity} color="bg-yellow-400" />
                <StatBar label="Body" value={roast.body} color="bg-amber-700" />
                <StatBar label="Sweetness" value={roast.sweetness} color="bg-rose-400" />
                <StatBar label="Bitterness" value={roast.bitterness} color="bg-stone-600" />
              </div>

              {/* Tasting notes */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-cafe-heading font-work-sans uppercase tracking-wider">
                  Tasting Notes
                </p>
                <div className="flex flex-wrap gap-2">
                  {roast.notes.map((note) => (
                    <span
                      key={note}
                      className="text-[10px] font-work-sans text-cafe-body px-2.5 py-1 rounded-full border border-cafe-border bg-cafe-bg"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-cafe-body font-work-sans leading-relaxed">
                {roast.description}
              </p>
            </div>
          </div>

          {/* The slider */}
          <div className="space-y-3 pt-4">
            {/* Gradient track label */}
            <div className="relative">
              <div className="h-4 rounded-full bg-gradient-to-r from-[#8BAF72] via-[#C8956A] via-[#8C5A35] via-[#5E3320] to-[#2E1810] shadow-inner" />
            </div>
            <input
              id="roast-slider"
              type="range"
              min={0}
              max={100}
              step={1}
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="w-full h-2 appearance-none rounded-full cursor-pointer accent-cafe-primary bg-transparent -mt-2"
              aria-label="Roast level slider"
            />
            <div className="flex justify-between text-[10px] text-cafe-muted font-work-sans font-semibold">
              <span>Green (0%)</span>
              <span>Light (25%)</span>
              <span>Medium (50%)</span>
              <span>Med-Dark (75%)</span>
              <span>Dark (100%)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Module nav */}
      <div className="flex items-center justify-between pt-4 border-t border-cafe-border">
        <Link
          to="/brew-compass/connoisseur"
          className="inline-flex items-center gap-2 text-sm text-cafe-body hover:text-cafe-heading font-work-sans transition-colors"
        >
          <ArrowLeft size={15} /> Connoisseur Corner
        </Link>
        <Link
          to="/brew-compass/coffee-atlas"
          className="inline-flex items-center gap-2 text-sm text-cafe-primary hover:text-cafe-primary-hover font-semibold font-work-sans transition-colors"
        >
          Next: The Coffee Atlas <ArrowRight size={15} />
        </Link>
      </div>
    </main>
  );
}
