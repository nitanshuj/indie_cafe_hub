import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

export const Route = createFileRoute("/brew-compass/black-coffee")({
  head: () => ({
    meta: [
      { title: "Black Coffee Brewing Methods — Brew School | Indie Coffee Hub" },
      {
        name: "description",
        content:
          "Step-by-step guides to every major black coffee brewing method: French Press, Drip Maker, Espresso, Moka Pot, V60, Chemex, AeroPress, and Siphon.",
      },
    ],
  }),
  component: BlackCoffeePage,
});

// ─── Data ────────────────────────────────────────────────────────────────────
interface BrewSpec {
  label: string;
  value: string;
}

interface BrewStep {
  step: number;
  title: string;
  body: string;
}

interface BrewMethod {
  id: string;
  name: string;
  origin: string;
  category: string;
  tagline: string;
  description: string;
  specs: BrewSpec[];
  steps: BrewStep[];
  imageUrl: string;
  cupProfile: string;
}

const METHODS: BrewMethod[] = [
  {
    id: "french-press",
    name: "French Press",
    origin: "France / Italy, 1929",
    category: "Immersion",
    tagline: "Full immersion, full body.",
    description:
      "One of the oldest and most popular brewing methods. Grounds steep directly in hot water, and a metal mesh plunger separates them. Oils and fine particles remain, creating a rich, heavy-bodied cup.",
    specs: [
      { label: "Grind Size", value: "Coarse" },
      { label: "Water Temp", value: "90–94°C" },
      { label: "Brew Ratio", value: "1:12 – 1:14" },
      { label: "Brew Time", value: "4 minutes" },
    ],
    steps: [
      { step: 1, title: "Preheat the press", body: "Pour hot water into the French Press and swirl, then discard." },
      { step: 2, title: "Add coffee", body: "Add 30g of coarsely ground coffee for a 400ml brew." },
      { step: 3, title: "Add water", body: "Pour all the water at once, ensuring all grounds are saturated. Do not stir." },
      { step: 4, title: "Steep for 4 minutes", body: "Place the lid (plunger up) and let it steep for exactly 4 minutes." },
      { step: 5, title: "Plunge slowly", body: "Apply slow, steady pressure to the plunger over 20–30 seconds. Pour immediately to stop extraction." },
    ],
    imageUrl: "https://res.cloudinary.com/daon1coiv/image/upload/v1782142057/french_press_ke6fkt.jpg",
    cupProfile: "Heavy body, earthy richness. Robust, full-flavoured, and warming.",
  },
  {
    id: "electric-drip",
    name: "Electric Drip Coffee Maker",
    origin: "Germany / USA, 1954",
    category: "Automatic Filter",
    tagline: "Consistent convenience.",
    description:
      "The standard home brewer, refined. Modern specialty drip machines precisely control water temperature and dispersion to extract clean, balanced coffee at scale.",
    specs: [
      { label: "Grind Size", value: "Medium" },
      { label: "Water Temp", value: "92–96°C" },
      { label: "Brew Ratio", value: "1:15 – 1:16" },
      { label: "Brew Time", value: "4–6 minutes" },
    ],
    steps: [
      { step: 1, title: "Insert paper filter", body: "Place paper filter in basket and rinse with hot water to rinse filter taste." },
      { step: 2, title: "Add coffee", body: "Add medium ground coffee to the basket (e.g., 30g for 500ml water)." },
      { step: 3, title: "Fill tank", body: "Fill the water reservoir with fresh, cold filtered water." },
      { step: 4, title: "Brew", body: "Start the machine, letting the water drip through into the carafe." },
      { step: 5, title: "Serve", body: "Remove the carafe immediately after brew ends to prevent burning on the heating plate." },
    ],
    imageUrl: "https://res.cloudinary.com/daon1coiv/image/upload/v1782139631/Breville-Precision-Brewer_wqfm1r.png",
    cupProfile: "Balanced, clean, light-to-medium body. Consistent and familiar.",
  },
  {
    id: "espresso",
    name: "Espresso Machine",
    origin: "Italy, 1901",
    category: "Pressure",
    tagline: "The golden extraction.",
    description:
      "Nine bars of pressure force hot water through a compacted bed of finely ground coffee in under 30 seconds. The result is a concentrated, complex shot topped with crema.",
    specs: [
      { label: "Grind Size", value: "Fine" },
      { label: "Water Temp", value: "90–93°C" },
      { label: "Brew Ratio", value: "1:2 (e.g., 18g in, 36g out)" },
      { label: "Brew Time", value: "25–30 seconds" },
    ],
    steps: [
      { step: 1, title: "Prep the basket", body: "Wipe the portafilter clean and dry. Add 18g of fine coffee." },
      { step: 2, title: "Tamp", body: "Distribute grounds evenly and tamp firmly and level." },
      { step: 3, title: "Flush", body: "Run a short burst of water through the group head to clear old grounds." },
      { step: 4, title: "Pull shot", body: "Insert portafilter and start brewing immediately. Aim for 36g of espresso." },
      { step: 5, title: "Clean", body: "Knock out the spent puck and wipe the basket clean." },
    ],
    imageUrl: "https://res.cloudinary.com/daon1coiv/image/upload/v1782142057/Espresso_vm5zrr.jpg",
    cupProfile: "Extremely intense, viscous, and syrupy. Concentrated acidity and sweetness.",
  },
  {
    id: "moka-pot",
    name: "Moka Pot",
    origin: "Italy, 1933",
    category: "Stovetop Pressure",
    tagline: "Italy in a pot.",
    description:
      "Designed by Alfonso Bialetti, the Moka Pot uses steam pressure from boiling water in the lower chamber to force extraction upward through coffee grounds into the top chamber.",
    specs: [
      { label: "Grind Size", value: "Fine-Medium" },
      { label: "Water Temp", value: "Boiling (from kettle)" },
      { label: "Brew Ratio", value: "1:7 – 1:10" },
      { label: "Brew Time", value: "5–7 minutes" },
    ],
    steps: [
      { step: 1, title: "Fill the boiler", body: "Fill the lower chamber with hot water to just below the safety valve." },
      { step: 2, title: "Load the basket", body: "Fill the filter basket with fine-medium ground coffee. Level off without tamping." },
      { step: 3, title: "Assemble and heat", body: "Screw the top and bottom tightly. Place on medium heat." },
      { step: 4, title: "Listen and watch", body: "Coffee will gurgle up through the spout. Remove from heat when the sound becomes sputtery." },
      { step: 5, title: "Serve immediately", body: "Stir the coffee in the upper chamber before pouring." },
    ],
    imageUrl: "https://res.cloudinary.com/daon1coiv/image/upload/v1782142057/Moka-pot_wltqqh.jpg",
    cupProfile: "Bold, bittersweet, espresso-adjacent. Heavy-bodied with roasty intensity.",
  },
  {
    id: "v60",
    name: "Hario V60",
    origin: "Japan, 2004",
    category: "Pour-Over",
    tagline: "The barista's canvas.",
    description:
      "The V60's iconic 60° angled cone with spiral internal ribs guides water flow through coffee, giving the brewer maximum control over extraction. Ideal for light roasts.",
    specs: [
      { label: "Grind Size", value: "Medium-Fine" },
      { label: "Water Temp", value: "92–96°C" },
      { label: "Brew Ratio", value: "1:15 – 1:17" },
      { label: "Brew Time", value: "3–4 minutes" },
    ],
    steps: [
      { step: 1, title: "Rinse the filter", body: "Place the paper filter and rinse with hot water to remove paper taste and pre-heat vessel." },
      { step: 2, title: "Add coffee", body: "Add 15g of medium-fine ground coffee. Shake gently to level." },
      { step: 3, title: "Bloom", body: "Pour 30ml of water. Wait 30–45 seconds for bloom." },
      { step: 4, title: "Pour in pulses", body: "Pour water in 3–4 clockwise spiral pulses, maintaining water level." },
      { step: 5, title: "Drawdown", body: "Allow water to drain completely. Total time should be 3–4 minutes." },
    ],
    imageUrl: "https://res.cloudinary.com/daon1coiv/image/upload/v1782142057/Hario-V60_igdmu6.jpg",
    cupProfile: "Clean, tea-like body. Bright acidity, floral and fruit forward.",
  },
  {
    id: "chemex",
    name: "Chemex",
    origin: "USA, 1941",
    category: "Pour-Over",
    tagline: "Science meets craft.",
    description:
      "Invented by chemist Peter Schlumbohm, the Chemex's hourglass form and thick proprietary filters produce one of the cleanest, most sediment-free cups.",
    specs: [
      { label: "Grind Size", value: "Medium-Coarse" },
      { label: "Water Temp", value: "93–96°C" },
      { label: "Brew Ratio", value: "1:16 – 1:17" },
      { label: "Brew Time", value: "4–5 minutes" },
    ],
    steps: [
      { step: 1, title: "Position the filter", body: "Fold the Chemex paper filter into a cone with the triple-folded side facing the spout." },
      { step: 2, title: "Rinse and preheat", body: "Pour hot water through filter to rinse and warm glass. Discard water." },
      { step: 3, title: "Add coffee", body: "Add 36g of medium-coarse ground coffee (for a 6-cup brew)." },
      { step: 4, title: "Bloom pour", body: "Add 72ml of water and wait 45 seconds for bloom." },
      { step: 5, title: "Continuous pour", body: "Pour steadily in a circular motion, keeping water 1cm from rim." },
    ],
    imageUrl: "https://res.cloudinary.com/daon1coiv/image/upload/v1782142056/Chemex_qbti8z.jpg",
    cupProfile: "Exceptionally clean and crisp. Complex floral notes, bright citrus acidity.",
  },
  {
    id: "kalita-wave",
    name: "Kalita Wave",
    origin: "Japan",
    category: "Pour-Over",
    tagline: "Forgiving consistency.",
    description:
      "The Kalita Wave's flat bottom with three small drain holes distributes water flow evenly across the coffee bed, making it much more forgiving than the V60 while still producing a clear, balanced cup.",
    specs: [
      { label: "Grind Size", value: "Medium" },
      { label: "Water Temp", value: "91–94°C" },
      { label: "Brew Ratio", value: "1:15 – 1:16" },
      { label: "Brew Time", value: "3–4 minutes" },
    ],
    steps: [
      { step: 1, title: "Rinse the Wave filter", body: "Place the proprietary Wave filter and rinse with hot water. The wavy edges keep it off the walls for even flow." },
      { step: 2, title: "Add coffee", body: "Add 20g of medium ground coffee. Shake to level." },
      { step: 3, title: "Bloom", body: "Pour 40g of water for a 30-second bloom." },
      { step: 4, title: "Pour in 3 phases", body: "Pour in three equal intervals, letting the water draw down slightly between each pour." },
      { step: 5, title: "Enjoy", body: "Total brew time should be 3–4 minutes. The flat bottom ensures a balanced, consistent extraction." },
    ],
    imageUrl: "https://res.cloudinary.com/daon1coiv/image/upload/v1782142057/Kalita_Wave_w1wm2c.jpg",
    cupProfile: "Balanced and sweet. Medium body, consistent extraction, gentle acidity.",
  },
  {
    id: "aeropress",
    name: "AeroPress",
    origin: "USA, 2005",
    category: "Immersion + Pressure",
    tagline: "Coffee's Swiss Army knife.",
    description:
      "Invented by Alan Adler, the AeroPress uses immersion and air pressure to brew a concentrated, smooth cup in under 2 minutes.",
    specs: [
      { label: "Grind Size", value: "Medium-Fine" },
      { label: "Water Temp", value: "80–90°C" },
      { label: "Brew Ratio", value: "1:12 – 1:16" },
      { label: "Brew Time", value: "1–2 minutes" },
    ],
    steps: [
      { step: 1, title: "Insert and rinse filter", body: "Insert a paper micro-filter into the cap and rinse. Attach cap to chamber." },
      { step: 2, title: "Add coffee and water", body: "Add 15g of medium-fine coffee. Pour 200ml of water at 85°C." },
      { step: 3, title: "Stir", body: "Stir vigorously for 10 seconds to ensure even saturation." },
      { step: 4, title: "Insert plunger", body: "Insert the plunger and create a seal. Let steep for 60–90 seconds." },
      { step: 5, title: "Press", body: "Apply steady downward pressure over 20–30 seconds until you hear a hiss." },
    ],
    imageUrl: "https://res.cloudinary.com/daon1coiv/image/upload/v1782142056/aero-press_nk4l9e.jpg",
    cupProfile: "Smooth, low-acid, concentrated. Highly customizable.",
  },
  {
    id: "siphon",
    name: "Siphon Coffee Brewing",
    origin: "Germany / France, 1840s",
    category: "Vacuum / Vapor Pressure",
    tagline: "The theatrical laboratory.",
    description:
      "Vapor pressure forces boiling water up from the lower flask into the upper chamber where coffee grounds steep. Removing the heat source creates a vacuum, drawing the brewed coffee down through a filter.",
    specs: [
      { label: "Grind Size", value: "Medium" },
      { label: "Water Temp", value: "92–95°C" },
      { label: "Brew Ratio", value: "1:15" },
      { label: "Brew Time", value: "3–4 minutes" },
    ],
    steps: [
      { step: 1, title: "Assemble filter", body: "Soak cloth filter in hot water, place inside upper chamber, and hook to the tube." },
      { step: 2, title: "Heat water", body: "Fill lower flask with hot water, light the burner underneath." },
      { step: 3, title: "Mount chamber", body: "Once water begins to rise, partially insert upper chamber. Once boiling, seal it fully." },
      { step: 4, title: "Brew", body: "Add 20g of medium grounds to rising water. Stir gently and steep for 60 seconds." },
      { step: 5, title: "Drawdown", body: "Turn off the burner. The cooling air below will suck the coffee down through the filter." },
    ],
    imageUrl: "https://res.cloudinary.com/daon1coiv/image/upload/v1782140053/Siphon_Coffee_Maker_bh37if.png",
    cupProfile: "Extremely clean, hot, and tea-like with high flavor clarity and zero sediment.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function SpecTable({ specs }: { specs: BrewSpec[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 font-mono text-xs uppercase tracking-wider">
      {specs.map((s) => (
        <div
          key={s.label}
          className="bg-[#0F1115] border border-[#2A2E37] rounded-none p-3 text-left"
        >
          <p className="text-[9px] font-bold text-cafe-primary mb-1">
            {s.label.replace(/\s+/g, "_")}
          </p>
          <p className="text-xs font-bold text-cafe-heading">{s.value}</p>
        </div>
      ))}
    </div>
  );
}

function MethodCard({ method }: { method: BrewMethod }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="group relative bg-[#1A1D24] border border-[#2A2E37] rounded-none overflow-hidden transition-all duration-300 hover:border-[#00F0FF] hover:shadow-[0_0_15px_rgba(0,240,255,0.1)] flex flex-col md:flex-row">
      {/* Left side: Content */}
      <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-widest text-cafe-muted">
            <span className="bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[#00F0FF] px-2.5 py-0.5 rounded-none font-bold">
              {method.category}
            </span>
            <span>ORIGIN // {method.origin}</span>
          </div>

          <h2 className="text-2xl font-bold text-cafe-heading font-outfit uppercase mt-4 tracking-wider">
            {method.name}
          </h2>
          <p className="text-xs text-cafe-primary font-mono mt-1 mb-4 uppercase tracking-wider">
            &gt; CLASSIFICATION: {method.tagline}
          </p>
          <p className="text-xs text-cafe-body font-mono leading-relaxed lowercase">
            {method.description}
          </p>

          {/* Cup profile banner */}
          <div className="mt-4 bg-[#0F1115] border border-[#2A2E37] rounded-none p-3 flex items-start gap-2.5">
            <Sparkles size={14} className="text-[#FFC857] mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-cafe-heading font-bold font-mono leading-snug uppercase tracking-wider">
              PROFILE // {method.cupProfile}
            </p>
          </div>

          {/* Brew parameters */}
          <SpecTable specs={method.specs} />
        </div>

        {/* Expandable step-by-step guide */}
        <div className="mt-6 border-t border-[#2A2E37] pt-4">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between text-[10px] font-bold text-[#00F0FF] hover:text-[#00C8D6] transition-colors py-1 cursor-pointer font-mono uppercase tracking-widest"
          >
            <span>Step-by-Step Guide</span>
            {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          
          {isOpen && (
            <ol className="mt-4 space-y-4 border-l border-[#2A2E37] pl-4 transition-all duration-300">
              {method.steps.map((s) => (
                <li key={s.step} className="text-xs font-mono">
                  <div className="flex items-center gap-2 font-bold text-cafe-heading uppercase tracking-wider">
                    <span className="text-[9px] bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] w-5 h-5 rounded-none flex items-center justify-center">
                      0{s.step}
                    </span>
                    <span>{s.title}</span>
                  </div>
                  <p className="text-cafe-body leading-relaxed mt-1.5 pl-7 lowercase">
                    {s.body}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      {/* Right side: Photo */}
      <div className="w-full md:w-[45%] h-64 md:h-auto min-h-[350px] relative overflow-hidden border-t md:border-t-0 md:border-l border-[#2A2E37]">
        <img
          src={method.imageUrl}
          alt={method.name}
          className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-black/60 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function BlackCoffeePage() {
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
          <span className="text-cafe-heading font-medium">BLACK_COFFEE_METHODS.CFG</span>
        </nav>

        {/* Page Header */}
        <section className="space-y-4 max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-cafe-primary font-mono">
            MODULE_03 // EXTRACTION_PARAMETERS
          </p>
          <h1 className="text-3xl sm:text-5xl font-black text-cafe-heading font-outfit leading-tight uppercase tracking-wider">
            BLACK COFFEE BREWING TECHNIQUES
          </h1>
          <p className="text-xs text-cafe-body font-mono leading-relaxed uppercase tracking-wider">
            COMPILE BREW PARAMETERS. READOUT GUIDES TO ALL MAJOR BLACK COFFEE EXTRACTIONS: AUTOMATIC FILTER SYSTEMS, POUR-OVER INDUCTION, PRESSURE-DRIVEN CHAMBERS AND LABORATORY VACUUMS.
          </p>
        </section>

        {/* Grid of Methods (1 card per row) */}
        <section
          className="grid grid-cols-1 gap-8"
          aria-label="Black coffee brewing methods"
        >
          {METHODS.map((method) => (
            <MethodCard key={method.id} method={method} />
          ))}
        </section>

        {/* Module nav */}
        <div className="flex items-center justify-between pt-6 border-t border-[#2A2E37]">
          <Link
            to="/brew-compass/chilled-bar"
            className="inline-flex items-center gap-2 text-xs text-cafe-body hover:text-cafe-primary font-mono uppercase tracking-widest transition-colors"
          >
            <ArrowLeft size={14} /> CHILLED_BAR
          </Link>
          <Link
            to="/brew-compass/global-specialties"
            className="inline-flex items-center gap-2 text-xs text-cafe-primary hover:text-[#00C8D6] font-bold font-mono uppercase tracking-widest transition-colors"
          >
            NEXT: GLOBAL_SPECIALTIES <ArrowRight size={14} />
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
