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
    name: "Black",
    tagline: "Pure coffee simplicity.",
    description: "Brewed black coffee without any added milk, sugar, or flavorings. Pure drip coffee.",
    espressoHeight: "0%",
    layers: [
      {
        name: "Drip Coffee",
        target: "100%",
        bg: "bg-[#4A2C11]",
        animates: true,
        delay: "",
      },
    ],
  },
  {
    name: "Latte",
    tagline: "Gentle & milky.",
    description: "A rich shot of espresso balanced with a generous amount of steamed milk and topped with a thin layer of foam.",
    espressoHeight: "30%",
    layers: [
      {
        name: "Steamed Milk",
        target: "60%",
        bg: "bg-[#EAD5C3]",
        animates: true,
        delay: "",
      },
      {
        name: "Milk Foam",
        target: "10%",
        bg: "bg-[#FFFFFF]",
        animates: true,
        delay: "delay-300",
      },
    ],
  },
  {
    name: "Cappuccino",
    tagline: "The classic third.",
    description: "An equal blend of espresso, steamed milk, and a thick layer of velvety milk foam.",
    espressoHeight: "33%",
    layers: [
      {
        name: "Steamed Milk",
        target: "33%",
        bg: "bg-[#EAD5C3]",
        animates: true,
        delay: "",
      },
      {
        name: "Milk Foam",
        target: "34%",
        bg: "bg-[#FFFFFF]",
        animates: true,
        delay: "delay-300",
      },
    ],
  },
  {
    name: "Americano",
    tagline: "Diluted strength.",
    description: "A shot of espresso diluted with hot water, giving it a similar strength but different flavor profile to drip coffee.",
    espressoHeight: "33%",
    layers: [
      {
        name: "Hot Water",
        target: "67%",
        bg: "bg-[#93C5FD]",
        animates: true,
        delay: "",
      },
    ],
  },
  {
    name: "Espresso",
    tagline: "Pure. Intense.",
    description: "A concentrated 1oz shot of espresso brewed under high pressure. Fills only the bottom part of the cup.",
    espressoHeight: "30%",
    layers: [],
  },
  {
    name: "Doppio",
    tagline: "Double shot.",
    description: "A double shot of espresso (2oz), providing double the strength and volume of a single shot.",
    espressoHeight: "60%",
    layers: [],
  },
  {
    name: "Cortado",
    tagline: "Equal harmony.",
    description: "Equal parts espresso and warm steamed milk, cut down to reduce acidity while maintaining strength.",
    espressoHeight: "50%",
    layers: [
      {
        name: "Steamed Milk",
        target: "50%",
        bg: "bg-[#EAD5C3]",
        animates: true,
        delay: "",
      },
    ],
  },
  {
    name: "Red Eye",
    tagline: "Extra charge.",
    description: "A standard cup of drip coffee topped with an added shot of espresso for an extra caffeine kick.",
    espressoHeight: "0%",
    layers: [
      {
        name: "Espresso",
        target: "30%",
        bg: "bg-[#2D1B0F]",
        animates: true,
        delay: "",
      },
      {
        name: "Drip Coffee",
        target: "70%",
        bg: "bg-[#4A2C11]",
        animates: true,
        delay: "delay-300",
      },
    ],
  },
  {
    name: "Galão",
    tagline: "Milky Portuguese style.",
    description: "A Portuguese hot drink consisting of espresso and foamed milk, with a higher milk-to-coffee ratio.",
    espressoHeight: "25%",
    layers: [
      {
        name: "Foamed Milk",
        target: "75%",
        bg: "bg-[#EAD5C3]",
        animates: true,
        delay: "",
      },
    ],
  },
  {
    name: "Lungo",
    tagline: "Long pull.",
    description: "A longer-pulled espresso shot, extracting more water through the grounds and filling the cup further.",
    espressoHeight: "60%",
    layers: [],
  },
  {
    name: "Macchiato",
    tagline: "Marked by foam.",
    description: "A single espresso shot 'stained' with a small dollop of velvety milk foam on top.",
    espressoHeight: "80%",
    layers: [
      {
        name: "Milk Foam",
        target: "20%",
        bg: "bg-[#FFFFFF]",
        animates: true,
        delay: "",
      },
    ],
  },
  {
    name: "Mocha",
    tagline: "Sweet chocolate.",
    description: "A decadent combination of espresso, rich chocolate syrup, and steamed milk, topped with light foam.",
    espressoHeight: "30%",
    layers: [
      {
        name: "Chocolate",
        target: "20%",
        bg: "bg-[#5C3A21]",
        animates: true,
        delay: "",
      },
      {
        name: "Steamed Milk",
        target: "40%",
        bg: "bg-[#EAD5C3]",
        animates: true,
        delay: "delay-300",
      },
      {
        name: "Milk Foam",
        target: "10%",
        bg: "bg-[#FFFFFF]",
        animates: true,
        delay: "delay-500",
      },
    ],
  },
  {
    name: "Ristretto",
    tagline: "Short pull.",
    description: "A very short, restricted espresso shot. Concentrated, sweet, and fills only the very bottom of the cup.",
    espressoHeight: "15%",
    layers: [],
  },
  {
    name: "Flat White",
    tagline: "Silky & strong.",
    description: "A double shot of espresso blended with velvety microfoam steamed milk for a strong, smooth coffee.",
    espressoHeight: "33%",
    layers: [
      {
        name: "Steamed Milk",
        target: "67%",
        bg: "bg-[#EAD5C3]",
        animates: true,
        delay: "",
      },
    ],
  },
  {
    name: "Affogato",
    tagline: "Dessert coffee.",
    description: "A scoop of vanilla ice cream drowned in a hot, rich shot of espresso.",
    espressoHeight: "0%",
    layers: [
      {
        name: "Ice Cream",
        target: "60%",
        bg: "bg-[#FFFDD0]",
        animates: true,
        delay: "",
      },
      {
        name: "Espresso",
        target: "40%",
        bg: "bg-[#2D1B0F]",
        animates: true,
        delay: "delay-300",
      },
    ],
  },
  {
    name: "Café au Lait",
    tagline: "French morning classic.",
    description: "Warm brewed drip coffee mixed with an equal amount of warm steamed milk.",
    espressoHeight: "0%",
    layers: [
      {
        name: "Drip Coffee",
        target: "50%",
        bg: "bg-[#4A2C11]",
        animates: true,
        delay: "",
      },
      {
        name: "Steamed Milk",
        target: "50%",
        bg: "bg-[#EAD5C3]",
        animates: true,
        delay: "delay-300",
      },
    ],
  },
  {
    name: "Irish",
    tagline: "Spirited brew.",
    description: "Hot drip coffee combined with Irish whiskey and sugar, topped with a thick layer of fresh cold cream.",
    espressoHeight: "0%",
    layers: [
      {
        name: "Sugar",
        target: "5%",
        bg: "bg-[#ECEBE4]",
        animates: true,
        delay: "",
      },
      {
        name: "Whiskey",
        target: "15%",
        bg: "bg-[#C27D38]",
        animates: true,
        delay: "delay-200",
      },
      {
        name: "Drip Coffee",
        target: "60%",
        bg: "bg-[#4A2C11]",
        animates: true,
        delay: "delay-400",
      },
      {
        name: "Whipped Cream",
        target: "20%",
        bg: "bg-[#FFFFFF]",
        animates: true,
        delay: "delay-600",
      },
    ],
  },
];

// ─── Layer Proportion Legend ──────────────────────────────────────────────────
const LEGEND = [
  { label: "Espresso", bg: "bg-[#2D1B0F]" },
  { label: "Drip Coffee", bg: "bg-[#4A2C11] border border-[#D6CFCB]" },
  { label: "Steamed Milk", bg: "bg-[#EAD5C3] border border-[#D6CFCB]" },
  { label: "Foam / Cream", bg: "bg-[#FFFFFF] border border-[#D6CFCB]" },
  { label: "Chocolate", bg: "bg-[#5C3A21] border border-[#D6CFCB]" },
  { label: "Ice Cream", bg: "bg-[#FFFDD0] border border-[#D6CFCB]" },
  { label: "Whiskey", bg: "bg-[#C27D38] border border-[#D6CFCB]" },
  { label: "Hot Water", bg: "bg-[#93C5FD] border border-blue-300" },
];

// ─── Card ────────────────────────────────────────────────────────────────────
const COLOR_MAP: Record<string, string> = {
  "bg-[#3E2723]": "#2D1B0F",
  "bg-[#2D1B0F]": "#2D1B0F",
  "bg-[#FFF3E0]": "#EAD5C3",
  "bg-[#EAD5C3]": "#EAD5C3",
  "bg-[#FFFDF9]": "#FFFFFF",
  "bg-[#FFFFFF]": "#FFFFFF",
  "bg-[#DBEAFE]": "#93C5FD",
  "bg-[#93C5FD]": "#93C5FD",
  "bg-[#4A2C11]": "#4A2C11",
  "bg-[#5C3A21]": "#5C3A21",
  "bg-[#FFFDD0]": "#FFFDD0",
  "bg-[#C27D38]": "#C27D38",
  "bg-[#ECEBE4]": "#ECEBE4",
};

function DrinkCard({ drink }: { drink: Drink }) {
  const clipId = `cup-clip-${drink.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;

  return (
    <div
      className={`group relative bg-white border border-cafe-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col ${drink.wide ? "sm:col-span-2 lg:col-span-1" : ""}`}
    >
      {/* Cup Visual */}
      <div className="relative h-36 mx-6 mt-6 flex items-center justify-between px-8 bg-[#8A9992] rounded-xl border border-white/10 shadow-inner">
        <div className="flex-shrink-0 flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className="w-24 h-24 overflow-visible"
          >
            <defs>
              <clipPath id={clipId}>
                {/* Inside of the cup for fluid matching */}
                <path
                  d="M 30,12 L 34,76 C 34.5,82 40,84 50,84 C 60,84 65.5,82 66,76 L 70,12 Z"
                />
              </clipPath>
            </defs>

            {/* Masked Liquid Layers */}
            <g clipPath={`url(#${clipId})`}>
              {/* Background of the inside of cup (behind liquids) */}
              <rect x="0" y="0" width="100" height="100" fill="transparent" />

              {/* Render Espresso base at the bottom */}
              {(() => {
                const espressoH = parseFloat(drink.espressoHeight);
                const yPos = 100 - espressoH;
                return (
                  <rect
                    x="0"
                    y={yPos}
                    width="100"
                    height={espressoH}
                    fill="#2D1B0F"
                  />
                );
              })()}

              {/* Render cumulative animated layers */}
              {(() => {
                let cumulativeHeight = parseFloat(drink.espressoHeight);
                return drink.layers.map((layer) => {
                  const layerH = parseFloat(layer.target);
                  const bottomY = 100 - cumulativeHeight;
                  const topY = bottomY - layerH;
                  cumulativeHeight += layerH;

                  const fillHex = COLOR_MAP[layer.bg] || "#E5E7EB";

                  return (
                    <rect
                      key={layer.name}
                      x="0"
                      y={topY}
                      width="100"
                      height={layerH}
                      fill={fillHex}
                      className={`transform origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-in-out ${layer.delay ?? ""}`}
                    />
                  );
                });
              })()}
            </g>

            {/* Cup wireframe stroke */}
            {/* White mug outline (lip, walls, bottom, and handle) */}
            <path
              d="M 28,12 L 33.5,76 C 34.5,84 40,86 50,86 C 60,86 65.5,84 66.5,76 L 72,12"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* White cup lip ellipse top */}
            <ellipse
              cx="50"
              cy="12"
              rx="22"
              ry="2"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            {/* White mug handle */}
            <path
              d="M 69.5,28 C 80,28 80,60 67.5,60"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Proportions Text next to the image */}
        <div className="flex flex-col justify-center space-y-1.5 text-[11px] font-work-sans text-white/80">
          {parseFloat(drink.espressoHeight) > 0 && (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#2D1B0F] inline-block border border-white/20" />
              <span className="font-semibold text-white">{drink.espressoHeight}</span>
              <span>Espresso</span>
            </div>
          )}
          {drink.layers.map((l) => (
            <div key={l.name} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-sm inline-block border border-white/20"
                style={{ backgroundColor: COLOR_MAP[l.bg] || "#E5E7EB" }}
              />
              <span className="font-semibold text-white">{l.target}</span>
              <span>{l.name}</span>
            </div>
          ))}
        </div>
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
      </div>

      {/* Hover hint */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="bg-white/20 text-white text-[9px] font-semibold font-work-sans px-2 py-0.5 rounded-full">
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
        <span className="text-cafe-heading font-medium">The Menu Decoder - The Basic Coffees</span>
      </nav>

      {/* Header */}
      <section className="space-y-4 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] font-semibold text-cafe-primary font-work-sans">
          Module 1
        </p>
        <h1 className="text-4xl sm:text-5xl font-light text-cafe-heading font-outfit leading-tight">
          The Menu Decoder - The Basic Coffees
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
