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
      className={`group relative bg-[#1A1D24] border border-[#2A2E37] rounded-none overflow-hidden transition-all duration-300 hover:border-[#00F0FF] hover:shadow-[0_0_15px_rgba(0,240,255,0.1)] flex flex-col ${drink.wide ? "sm:col-span-2 lg:col-span-1" : ""}`}
    >
      {/* Terminal Title bar */}
      <div className="bg-[#080A0D]/50 border-b border-[#2A2E37] px-4 py-2 flex items-center justify-between text-[9px] font-mono text-cafe-muted uppercase tracking-widest">
        <span>STRAT_DECODE: {drink.name}</span>
        <span className="text-[#00F0FF] group-hover:animate-pulse">● ONLINE</span>
      </div>

      {/* Cup Visual */}
      <div className="relative h-36 mx-4 mt-4 flex items-center justify-between px-6 bg-[#0F1115] border border-[#2A2E37]">
        <div className="flex-shrink-0 flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className="w-20 h-20 overflow-visible"
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
            <path
              d="M 28,12 L 33.5,76 C 34.5,84 40,86 50,86 C 60,86 65.5,84 66.5,76 L 72,12"
              fill="none"
              stroke="#E0E0E0"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Cup lip ellipse top */}
            <ellipse
              cx="50"
              cy="12"
              rx="22"
              ry="2"
              fill="none"
              stroke="#E0E0E0"
              strokeWidth="2"
            />
            {/* Mug handle */}
            <path
              d="M 69.5,28 C 80,28 80,60 67.5,60"
              fill="none"
              stroke="#E0E0E0"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Proportions Text next to the image */}
        <div className="flex flex-col justify-center space-y-1 text-[9px] font-mono text-cafe-muted uppercase tracking-wider">
          {parseFloat(drink.espressoHeight) > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#2D1B0F] inline-block border border-[#2A2E37]" />
              <span className="font-bold text-cafe-heading">{drink.espressoHeight}</span>
              <span>ESPRESSO</span>
            </div>
          )}
          {drink.layers.map((l) => (
            <div key={l.name} className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 inline-block border border-[#2A2E37]"
                style={{ backgroundColor: COLOR_MAP[l.bg] || "#E5E7EB" }}
              />
              <span className="font-bold text-cafe-heading">{l.target}</span>
              <span>{l.name.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Text */}
      <div className="px-4 py-5 flex-1 flex flex-col">
        <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-cafe-primary font-mono mb-1">
          &gt; {drink.tagline}
        </p>
        <h3 className="text-md font-bold text-cafe-heading font-outfit uppercase tracking-wider mb-2">
          {drink.name}
        </h3>
        <p className="text-[11px] text-cafe-body font-mono leading-relaxed flex-1 lowercase">
          {drink.description}
        </p>
      </div>

      {/* Hover hint */}
      <div className="absolute top-10 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] text-[8px] font-bold font-mono px-2 py-0.5 uppercase tracking-widest">
          POURING…
        </span>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function MenuDecoderPage() {
  return (
    <div className="min-h-screen bg-[#0F1115]">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-12 sm:py-16 space-y-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-cafe-muted">
          <Link to="/brew-compass" className="hover:text-cafe-primary transition-colors">
            BREW_SCHOOL
          </Link>
          <span>/</span>
          <span className="text-cafe-heading font-medium">MENU_DECODER.EXE</span>
        </nav>

        {/* Header */}
        <section className="space-y-4 max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-cafe-primary font-mono">
            MODULE_01 // ANATOMY_MATRIX
          </p>
          <h1 className="text-3xl sm:text-5xl font-black text-cafe-heading font-outfit leading-tight uppercase tracking-wider">
            THE MENU DECODER // ESPRESSO DRINK ANATOMY
          </h1>
          <p className="text-xs text-cafe-body font-mono leading-relaxed uppercase tracking-wider">
            DECONSTRUCT BEVERAGE COMPOSITION. TRIGGER HOVER INPUTS TO ACTIVATE FLUID POUR SIMULATIONS. EACH STRATA RISES TO MATH-CALCULATED PARAMETERS INDICATING EXACT LIQUID RATIOS.
          </p>

          {/* Hint */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFC857]/5 border border-[#FFC857]/30 text-[9px] font-mono text-[#FFC857] uppercase tracking-wider">
            <Info size={12} />
            HINT: TRIGGER HOVER STATE ON CARDS TO EXECUTE FLUID EXTRACTION ANIMATIONS.
          </div>
        </section>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 border-y border-[#2A2E37] py-4">
          {LEGEND.map((l) => (
            <div key={l.label} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-none inline-block ${l.bg.replace("border-white/20", "border-[#2A2E37]")}`} />
              <span className="text-[10px] text-cafe-body font-mono uppercase tracking-wider">{l.label}</span>
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
        <section className="bg-[#1A1D24] border border-[#2A2E37] p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-1">
            <h2 className="text-xs font-bold text-cafe-heading font-mono uppercase tracking-widest">
              DEPLOY FINDINGS IN THE FIELD?
            </h2>
            <p className="text-[10px] text-cafe-muted font-mono uppercase tracking-wider">
              RUN LOCATOR QUERIES ON INDEPENDENT STATIONS HARBORING THESE EXACT BEVERAGE SPECIFICATIONS.
            </p>
          </div>
          <Link
            to="/directory"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-[#00F0FF] hover:bg-[#00C8D6] text-[#0F1115] hover:shadow-[0_0_12px_rgba(0,240,255,0.4)] transition-all font-mono font-bold text-xs uppercase tracking-widest"
          >
            RUN SEARCH MATRIX <ArrowRight size={14} />
          </Link>
        </section>

        {/* Module nav */}
        <div className="flex items-center justify-between pt-4 border-t border-[#2A2E37]">
          <Link
            to="/brew-compass"
            className="inline-flex items-center gap-2 text-xs text-cafe-body hover:text-cafe-primary font-mono uppercase tracking-widest transition-colors"
          >
            <ArrowLeft size={14} /> BACK_TO_SCHOOL
          </Link>
          <Link
            to="/brew-compass/chilled-bar"
            className="inline-flex items-center gap-2 text-xs text-cafe-primary hover:text-[#00C8D6] font-bold font-mono uppercase tracking-widest transition-colors"
          >
            NEXT: CHILLED_BAR <ArrowRight size={14} />
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
