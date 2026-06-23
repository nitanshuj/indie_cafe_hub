import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Snowflake, Zap } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/brew-compass/chilled-bar")({
  head: () => ({
    meta: [
      { title: "The Chilled Bar — Iced & Cold Coffee Guide | Brew School" },
      {
        name: "description",
        content:
          "Discover iced espressos, shaken drinks, and cold brew. Interactive cold coffee anatomy with glassmorphism cards and real photos.",
      },
    ],
  }),
  component: ChilledBarPage,
});

// ─── Data ────────────────────────────────────────────────────────────────────
type AnimationType = "shake" | "dissolve" | "pour";

interface ColdLayer {
  name: string;
  /** percentage height of the glass (bottom-up) */
  height: string;
  /** base bg class */
  bg: string;
  /** bg class to transition INTO on hover (optional) */
  hoverBg?: string;
  /** whether this layer dissolves/rises on hover */
  dissolves?: boolean;
}

interface ColdDrink {
  name: string;
  origin: string;
  tagline: string;
  description: string;
  animation: AnimationType;
  layers: ColdLayer[];
  accentColor: string;
  textAccent: string;
  imageUrl: string;
  isDark?: boolean;
}

const COLD_DRINKS: ColdDrink[] = [
  {
    name: "Iced Latte",
    origin: "Global",
    tagline: "The cold classic.",
    description:
      "Cold milk poured over ice with a double shot of espresso. Refreshing and approachable.",
    animation: "pour",
    accentColor: "from-[#FFF8F0] to-[#FFE4CC]",
    textAccent: "text-amber-800",
    imageUrl: "https://res.cloudinary.com/daon1coiv/image/upload/v1782142290/Iced-Cappucino_le8u7r.jpg",
    layers: [
      { name: "Ice", height: "15%", bg: "bg-white/40", hoverBg: "bg-white/60" },
      { name: "Cold Milk", height: "60%", bg: "bg-[#FFF3E0]" },
      { name: "Espresso", height: "25%", bg: "bg-[#3E2723]/90" },
    ],
  },
  {
    name: "Cold Brew",
    origin: "USA",
    tagline: "12-hour patience.",
    description:
      "Coffee steeped in cold water for 12-24 hours. Naturally sweet, smooth, and low-acid.",
    animation: "pour",
    accentColor: "from-[#292524] to-[#1C1917]",
    textAccent: "text-amber-400",
    imageUrl: "https://res.cloudinary.com/daon1coiv/image/upload/v1782142290/Cold-Brew-Coffee_xjgswt.jpg",
    isDark: true,
    layers: [
      { name: "Ice", height: "15%", bg: "bg-white/20" },
      { name: "Cold Brew Concentrate", height: "85%", bg: "bg-[#2D1810]/80" },
    ],
  },
  {
    name: "Shaken Espresso",
    origin: "Starbucks / Modern",
    tagline: "Shake it up.",
    description:
      "Espresso and ice shaken vigorously until frothy and chilled, then poured over milk and brown sugar syrup.",
    animation: "shake",
    accentColor: "from-[#FEF3C7] to-[#FDE68A]",
    textAccent: "text-amber-800",
    imageUrl: "https://res.cloudinary.com/daon1coiv/image/upload/v1782142290/Shaken_Espresso_g4icgg.jpg",
    layers: [
      { name: "Ice", height: "15%", bg: "bg-white/50" },
      { name: "Oat Milk", height: "40%", bg: "bg-amber-50" },
      {
        name: "Shaken Espresso",
        height: "45%",
        bg: "bg-[#78350F]/80",
        hoverBg: "bg-amber-300/80",
        dissolves: true,
      },
    ],
  },
  {
    name: "Iced Cappuccino",
    origin: "Italy / Global",
    tagline: "Classic, chilled.",
    description:
      "The iconic thirds of espresso, milk, and foam — served over ice for a refreshing summer version of the Italian staple.",
    animation: "pour",
    accentColor: "from-[#F0F9FF] to-[#E0F2FE]",
    textAccent: "text-blue-800",
    imageUrl: "https://res.cloudinary.com/daon1coiv/image/upload/v1782142290/Iced-Cappucino_le8u7r.jpg",
    layers: [
      { name: "Ice", height: "15%", bg: "bg-white/50" },
      { name: "Steamed Milk", height: "30%", bg: "bg-[#FFF3E0]" },
      { name: "Espresso", height: "35%", bg: "bg-[#3E2723]/80" },
      { name: "Foam", height: "20%", bg: "bg-white/80" },
    ],
  },
];

// ─── Glass card ──────────────────────────────────────────────────────────────
function GlassCard({ drink }: { drink: ColdDrink }) {
  const isShake = drink.animation === "shake";
  const isDissolve = drink.animation === "dissolve";

  // Dynamic text color classes based on isDark flag
  const headingColor = drink.isDark ? "text-white" : "text-cafe-heading";
  const bodyColor = drink.isDark ? "text-stone-300" : "text-cafe-body";
  const mutedColor = drink.isDark ? "text-stone-400" : "text-cafe-muted";

  const [pouredCount, setPouredCount] = useState(drink.layers.length);
  const [isBrewing, setIsBrewing] = useState(false);
  const [currentStepText, setCurrentStepText] = useState("");

  const handleBrew = () => {
    if (isBrewing) return;
    setIsBrewing(true);
    setPouredCount(0);
    setCurrentStepText("Chilling cup...");

    const steps = [
      "Adding ice...",
      ...drink.layers.map((l) => `Pouring ${l.name}...`),
      "Enjoy! ☕✨"
    ];

    let stepIdx = 0;
    setCurrentStepText(steps[stepIdx]);

    const runStep = () => {
      setTimeout(() => {
        stepIdx++;
        if (stepIdx <= drink.layers.length) {
          setPouredCount(stepIdx);
          setCurrentStepText(steps[stepIdx]);
          runStep();
        } else {
          setCurrentStepText(steps[stepIdx]);
          setIsBrewing(false);
          setTimeout(() => {
            setCurrentStepText("");
          }, 2500);
        }
      }, 700);
    };

    runStep();
  };

  return (
    <div
      className={`group relative bg-gradient-to-b ${drink.accentColor} border border-white/20 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row`}
    >
      {/* Left side: Text & Interactive anatomy */}
      <div className="flex-1 p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start">
        {/* Text Details */}
        <div className="flex-1 flex flex-col h-full min-h-[160px]">
          <p className={`text-[10px] uppercase tracking-[0.15em] font-bold font-work-sans mb-1.5 ${drink.textAccent}`}>
            {drink.origin}
          </p>
          <h3 className={`text-2xl font-bold font-outfit mb-1.5 ${headingColor}`}>
            {drink.name}
          </h3>
          <p className={`text-xs italic font-work-sans mb-3 ${drink.textAccent}`}>
            {drink.tagline}
          </p>
          <p className={`text-sm font-work-sans leading-relaxed flex-1 ${bodyColor}`}>
            {drink.description}
          </p>

          {/* Layer key */}
          <div className="mt-6 flex flex-col gap-2">
            {[...drink.layers].reverse().map((l, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={`w-3.5 h-3.5 rounded-sm inline-block flex-shrink-0 ${l.bg} border border-white/30`} />
                <span className={`text-[12px] font-work-sans ${mutedColor}`}>{l.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Glass Visual */}
        <div className="relative flex-shrink-0 w-28 flex flex-col items-center justify-center self-center bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
          {currentStepText && (
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-cafe-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap shadow animate-bounce z-20">
              {currentStepText}
            </div>
          )}
          <div className="relative w-16 h-40 rounded-b-2xl rounded-t-lg overflow-hidden border-2 border-white/60 bg-white/5 shadow-inner flex flex-col-reverse">
            {drink.layers.slice(0, pouredCount).map((layer, i) => (
              <div
                key={i}
                title={layer.name}
                className={[
                  "w-full transition-all duration-700 ease-in-out",
                  layer.bg,
                  isShake && layer.dissolves
                    ? `group-hover:${layer.hoverBg ?? layer.bg} group-hover:opacity-85`
                    : "",
                  isDissolve && layer.dissolves
                    ? "group-hover:-translate-y-4 group-hover:opacity-50 group-hover:blur-[2px]"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{ height: layer.height }}
              />
            ))}
          </div>
          <span className={`text-[10px] uppercase tracking-wider font-bold mt-2 font-work-sans ${mutedColor}`}>
            Anatomy
          </span>
          <button
            onClick={handleBrew}
            disabled={isBrewing}
            className="mt-2.5 px-3 py-1 bg-white hover:bg-cafe-primary-light text-cafe-primary border border-cafe-primary-light/50 disabled:opacity-50 text-[10px] font-bold font-work-sans rounded-xl transition-all cursor-pointer shadow-sm hover:shadow"
          >
            {isBrewing ? "Brewing..." : "Brew Drink"}
          </button>
        </div>
      </div>

      {/* Right side: Photo */}
      <div className="w-full md:w-[45%] h-64 md:h-auto min-h-[300px] relative overflow-hidden border-t md:border-t-0 md:border-l border-white/20">
        <img
          src={drink.imageUrl}
          alt={drink.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Animation badges */}
        {isShake && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-amber-500 text-white text-[10px] font-bold font-work-sans px-3 py-1 rounded-full shadow-sm">
            <Zap size={11} /> Shake effect
          </div>
        )}
      </div>

      {/* Shake ring overlay */}
      {isShake && (
        <div className="absolute inset-0 pointer-events-none rounded-2xl ring-0 group-hover:ring-4 ring-amber-300/40 transition-all duration-300" />
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function ChilledBarPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12 sm:py-16 space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-work-sans text-cafe-muted">
        <Link to="/brew-compass" className="hover:text-cafe-primary transition-colors">
          Brew School
        </Link>
        <span>/</span>
        <span className="text-cafe-heading font-medium">The Chilled Bar</span>
      </nav>

      {/* Header */}
      <section className="space-y-4 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] font-semibold text-cafe-primary font-work-sans">
          Module 2
        </p>
        <h1 className="text-4xl sm:text-5xl font-light text-cafe-heading font-outfit leading-tight">
          The Chilled Bar — The Basic Cold Coffees
        </h1>
        <p className="text-base text-cafe-body font-work-sans leading-relaxed">
          From the 12-hour cold brew to the shaken espresso frenzy, cold coffee
          is one of the most dynamic categories in specialty coffee. Hover the
          cards to see the layered physics in action.
        </p>
      </section>

      {/* Card Grid (1 card per row) */}
      <section
        className="grid grid-cols-1 gap-8"
        aria-label="Cold coffee drink cards"
      >
        {COLD_DRINKS.map((drink) => (
          <GlassCard key={drink.name} drink={drink} />
        ))}
      </section>

      {/* Module nav */}
      <div className="flex items-center justify-between pt-6 border-t border-cafe-border">
        <Link
          to="/brew-compass/menu-decoder"
          className="inline-flex items-center gap-2 text-sm text-cafe-body hover:text-cafe-heading font-work-sans transition-colors"
        >
          <ArrowLeft size={15} /> Menu Decoder
        </Link>
        <Link
          to="/brew-compass/black-coffee"
          className="inline-flex items-center gap-2 text-sm text-cafe-primary hover:text-cafe-primary-hover font-semibold font-work-sans transition-colors"
        >
          Next: Black Coffee Brewing Techniques <ArrowRight size={15} />
        </Link>
      </div>
    </main>
  );
}
