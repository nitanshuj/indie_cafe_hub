import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";

export const Route = createFileRoute("/brew-compass/menu-decoder")({
  head: () => ({
    meta: [
      { title: "The Menu Decoder — Espresso Drink Anatomy | Brew School" },
      {
        name: "description",
        content:
          "Understand the espresso-to-milk anatomy of every coffee shop drink. Hover over each card to watch the layers pour.",
      },
    ],
  }),
  component: MenuDecoderPage,
});

// ─── Data ────────────────────────────────────────────────────────────────────
interface Layer {
  name: string;
  /** target height as a percentage string e.g. "60%" */
  target: string;
  /** tailwind bg class */
  bg: string;
  /** additional classes e.g. border-top for foam separation */
  extra?: string;
  /** whether this layer animates in (false = always visible as the base) */
  animates: boolean;
  /** delay class for sequential pour */
  delay?: string;
}

interface Drink {
  name: string;
  tagline: string;
  description: string;
  /** base (espresso) always-visible height as a % string */
  espressoHeight: string;
  layers: Layer[];
  /** extra wide card in bento grid */
  wide?: boolean;
}

const DRINKS: Drink[] = [
  {
    name: "Espresso",
    tagline: "Pure. Intense.",
    description:
      "A concentrated shot brewed under 9 bars of pressure. The building block of every espresso drink.",
    espressoHeight: "100%",
    layers: [],
  },
  {
    name: "Macchiato",
    tagline: "Marked by foam.",
    description:
      "An espresso 'stained' with a small dollop of velvety milk foam on top.",
    espressoHeight: "80%",
    layers: [
      {
        name: "Milk Foam",
        target: "20%",
        bg: "bg-[#FFFDF9]",
        extra: "border-t-2 border-[#E5E7EB]",
        animates: true,
        delay: "",
      },
    ],
  },
  {
    name: "Cortado",
    tagline: "Equal harmony.",
    description:
      "Equal parts espresso and warm steamed milk, cutting the acidity without diluting the strength.",
    espressoHeight: "50%",
    layers: [
      {
        name: "Steamed Milk",
        target: "50%",
        bg: "bg-[#FFF3E0]",
        animates: true,
        delay: "",
      },
    ],
  },
  {
    name: "Flat White",
    tagline: "Silky & strong.",
    description:
      "Espresso with velvety microfoam milk. Less milk than a latte, stronger flavour, smoother texture.",
    espressoHeight: "30%",
    layers: [
      {
        name: "Steamed Milk",
        target: "60%",
        bg: "bg-[#FFF3E0]",
        animates: true,
        delay: "",
      },
      {
        name: "Milk Foam",
        target: "10%",
        bg: "bg-[#FFFDF9]",
        extra: "border-t-2 border-[#E5E7EB]",
        animates: true,
        delay: "delay-300",
      },
    ],
  },
  {
    name: "Latte",
    tagline: "Gentle & milky.",
    description:
      "Espresso with generous steamed milk and a whisper of foam. The most popular espresso drink worldwide.",
    espressoHeight: "20%",
    layers: [
      {
        name: "Steamed Milk",
        target: "60%",
        bg: "bg-[#FFF3E0]",
        animates: true,
        delay: "",
      },
      {
        name: "Milk Foam",
        target: "20%",
        bg: "bg-[#FFFDF9]",
        extra: "border-t-2 border-[#E5E7EB]",
        animates: true,
        delay: "delay-300",
      },
    ],
  },
  {
    name: "Cappuccino",
    tagline: "The classic third.",
    description:
      "One-third espresso, one-third steamed milk, one-third thick cloud-like foam. The Italian original.",
    espressoHeight: "33%",
    layers: [
      {
        name: "Steamed Milk",
        target: "33%",
        bg: "bg-[#FFF3E0]",
        animates: true,
        delay: "",
      },
      {
        name: "Milk Foam",
        target: "34%",
        bg: "bg-[#FFFDF9]",
        extra: "border-t-2 border-[#E5E7EB]",
        animates: true,
        delay: "delay-300",
      },
    ],
  },
  {
    name: "Americano",
    tagline: "Diluted strength.",
    description:
      "Espresso diluted with hot water, creating a drip-coffee-strength drink with an espresso flavour profile.",
    espressoHeight: "20%",
    layers: [
      {
        name: "Hot Water",
        target: "80%",
        bg: "bg-[#DBEAFE]",
        animates: true,
        delay: "",
      },
    ],
    wide: true,
  },
];

// ─── Layer Proportion Legend ──────────────────────────────────────────────────
const LEGEND = [
  { label: "Espresso", bg: "bg-[#3E2723]" },
  { label: "Steamed Milk", bg: "bg-[#FFF3E0] border border-[#E5E7EB]" },
  { label: "Milk Foam", bg: "bg-[#FFFDF9] border border-[#E5E7EB]" },
  { label: "Hot Water", bg: "bg-[#DBEAFE] border border-blue-200" },
];

// ─── Card ────────────────────────────────────────────────────────────────────
function DrinkCard({ drink }: { drink: Drink }) {
  return (
    <div
      className={`group relative bg-white border border-cafe-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col ${drink.wide ? "sm:col-span-2 lg:col-span-1" : ""}`}
    >
      {/* Cup Visual */}
      <div className="relative h-36 mx-6 mt-6 rounded-xl overflow-hidden border border-cafe-border bg-[#FAF6F4] shadow-inner">
        {/* Espresso base — always visible */}
        <div
          className="absolute bottom-0 left-0 w-full bg-[#3E2723] transition-none"
          style={{ height: drink.espressoHeight }}
        />
        {/* Animated layers */}
        {drink.layers.map((layer) => (
          <div
            key={layer.name}
            className={`absolute bottom-0 left-0 w-full ${layer.bg} ${layer.extra ?? ""} transition-all duration-500 ease-in-out ${layer.delay ?? ""} h-0 group-hover:h-[var(--target)]`}
            style={{ "--target": layer.target } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Text */}
      <div className="px-6 py-5 flex-1 flex flex-col">
        <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-cafe-primary font-work-sans mb-1">
          {drink.tagline}
        </p>
        <h3 className="text-lg font-semibold text-[#2D2422] font-outfit mb-2">
          {drink.name}
        </h3>
        <p className="text-xs text-[#6B5C58] font-work-sans leading-relaxed flex-1">
          {drink.description}
        </p>

        {/* Layer proportions row */}
        <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#3E2723] inline-block" />
            <span className="text-[10px] text-cafe-muted font-work-sans">
              {drink.espressoHeight} Espresso
            </span>
          </div>
          {drink.layers.map((l) => (
            <div key={l.name} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-sm inline-block ${l.bg}`} />
              <span className="text-[10px] text-cafe-muted font-work-sans">
                {l.target} {l.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hover hint */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="bg-cafe-primary/10 text-cafe-primary text-[9px] font-semibold font-work-sans px-2 py-0.5 rounded-full">
          Pouring…
        </span>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function MenuDecoderPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12 sm:py-16 space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-work-sans text-cafe-muted">
        <Link to="/brew-compass" className="hover:text-cafe-primary transition-colors">
          Brew School
        </Link>
        <span>/</span>
        <span className="text-cafe-heading font-medium">The Menu Decoder</span>
      </nav>

      {/* Header */}
      <section className="space-y-4 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] font-semibold text-cafe-primary font-work-sans">
          Module 1
        </p>
        <h1 className="text-4xl sm:text-5xl font-light text-cafe-heading font-outfit leading-tight">
          The Menu Decoder
        </h1>
        <p className="text-base text-cafe-body font-work-sans leading-relaxed">
          Hover over any card to watch the drink's layers pour in — espresso
          first, then steamed milk, then foam. Each layer rises to its exact
          proportion so you can see exactly what's in your cup.
        </p>

        {/* Hint */}
        <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#FDE4DD]/60 border border-[#FDE4DD] rounded-xl text-xs font-work-sans text-[#E67E6B]">
          <Info size={13} strokeWidth={2} />
          Hover any card to trigger the pour animation
        </div>
      </section>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4">
        {LEGEND.map((l) => (
          <div key={l.label} className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-sm inline-block ${l.bg}`} />
            <span className="text-xs text-cafe-body font-work-sans">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Bento Grid */}
      <section
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        aria-label="Coffee drink cards"
      >
        {DRINKS.map((drink) => (
          <DrinkCard key={drink.name} drink={drink} />
        ))}
      </section>

      {/* Find in directory CTA */}
      <section className="bg-white border border-cafe-border rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-cafe-heading font-outfit">
            Ready to try one?
          </h2>
          <p className="text-sm text-cafe-body font-work-sans">
            Search our directory for indie cafes near you that serve your new
            favourite drink.
          </p>
        </div>
        <Link
          to="/directory"
          className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-2.5 bg-cafe-primary hover:bg-cafe-primary-hover text-white rounded-xl font-work-sans font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5"
        >
          Explore the Directory <ArrowRight size={15} strokeWidth={2} />
        </Link>
      </section>

      {/* Module nav */}
      <div className="flex items-center justify-between pt-4 border-t border-cafe-border">
        <Link
          to="/brew-compass"
          className="inline-flex items-center gap-2 text-sm text-cafe-body hover:text-cafe-heading font-work-sans transition-colors"
        >
          <ArrowLeft size={15} /> Back to Brew School
        </Link>
        <Link
          to="/brew-compass/chilled-bar"
          className="inline-flex items-center gap-2 text-sm text-cafe-primary hover:text-cafe-primary-hover font-semibold font-work-sans transition-colors"
        >
          Next: The Chilled Bar <ArrowRight size={15} />
        </Link>
      </div>
    </main>
  );
}
