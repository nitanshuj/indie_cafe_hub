import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Sparkles, Coffee } from "lucide-react";

export const Route = createFileRoute("/brew-compass/milk-types")({
  head: () => ({
    meta: [
      { title: "Types of Milks in Specialty Coffee — Dairy & Plant-based | Brew School" },
      {
        name: "description",
        content:
          "Discover how Dairy, Oat, Almond, and Soy milk steam, froth, and pair with espresso. A complete guide to milk texturing and taste profiles.",
      },
    ],
  }),
  component: MilkTypesPage,
});

// ─── Data ────────────────────────────────────────────────────────────────────
interface MilkType {
  name: string;
  category: "Dairy" | "Plant-based";
  bestFor: string;
  flavorProfile: string;
  frothingCapability: "Excellent" | "Great" | "Moderate" | "Difficult";
  frothingScore: number; // out of 5
  description: string;
  accentColor: string;
  borderColor: string;
  specs: { label: string; value: string }[];
}

const MILK_TYPES: MilkType[] = [
  {
    name: "Whole Dairy Milk",
    category: "Dairy",
    bestFor: "Classic Flat Whites, Lattes, & Cappuccinos",
    flavorProfile: "Sweet, creamy, rich, and cohesive.",
    frothingCapability: "Excellent",
    frothingScore: 5,
    accentColor: "from-[#FDFEFE] to-[#F2F4F4]",
    borderColor: "border-[#D5D8DC]",
    description:
      "The gold standard for traditional espresso beverages. Whole milk features the perfect balance of fats (for rich mouthfeel and sweetness) and proteins (for stable, silky microfoam structure). When heated to 60-65°C, lactose breaks down into simple sugars, making it naturally sweet.",
    specs: [
      { label: "Fat Content", value: "3.5%" },
      { label: "Protein Content", value: "3.2%" },
      { label: "Sugar (Lactose)", value: "4.7%" },
      { label: "Steaming Temp", value: "60–65°C" },
    ],
  },
  {
    name: "Barista Oat Milk",
    category: "Plant-based",
    bestFor: "Specialty Plant-based Lattes & Flat Whites",
    flavorProfile: "Neutral, slightly cereal-like, naturally sweet.",
    frothingCapability: "Excellent",
    frothingScore: 5,
    accentColor: "from-[#FAF9F6] to-[#F5ECE1]",
    borderColor: "border-[#E5D7C2]",
    description:
      "The undisputed champion of plant-based milks in specialty cafes. Oat milk has a remarkably neutral profile that lets the origin notes of delicate light roasts shine. Barista formulations include stabilizers (like dipotassium phosphate) to prevent curdling and allow lattes to be poured with high-definition latte art.",
    specs: [
      { label: "Fat Content", value: "3.0%" },
      { label: "Protein Content", value: "1.0%" },
      { label: "Sugar (Natural)", value: "4.0%" },
      { label: "Steaming Temp", value: "55–60°C" },
    ],
  },
  {
    name: "Barista Soy Milk",
    category: "Plant-based",
    bestFor: "Traditional creamy milk drinks",
    flavorProfile: "Nutty, malt-like, slightly sweet.",
    frothingCapability: "Great",
    frothingScore: 4,
    accentColor: "from-[#FDFefe] to-[#FCF3CF]/30",
    borderColor: "border-[#F9E79F]",
    description:
      "The original milk alternative. With protein levels comparable to dairy, soy milk yields a thick, stable, and glossy foam that is easy to steam. However, it is highly sensitive to acidity and temperature. If poured into extremely bright/acidic single-origins, it may curdle unless tempered properly.",
    specs: [
      { label: "Fat Content", value: "2.0%" },
      { label: "Protein Content", value: "3.0%" },
      { label: "Sugar (Added)", value: "2.5%" },
      { label: "Steaming Temp", value: "55–60°C" },
    ],
  },
  {
    name: "Barista Almond Milk",
    category: "Plant-based",
    bestFor: "Iced drinks, nutty espresso pairings",
    flavorProfile: "Distinctly nutty, slightly bitter, clean finish.",
    frothingCapability: "Moderate",
    frothingScore: 3,
    accentColor: "from-[#FFF9F3] to-[#F3E5D8]",
    borderColor: "border-[#E0CBB6]",
    description:
      "A popular low-calorie choice. Almond milk adds a pleasant nutty dimension to dark roasts but contains minimal protein, making texturing difficult. It creates a lighter, thinner microfoam that collapses quickly. For best results, steam gently at lower temperatures to avoid separation.",
    specs: [
      { label: "Fat Content", value: "1.5%" },
      { label: "Protein Content", value: "0.5%" },
      { label: "Sugar", value: "1.5%" },
      { label: "Steaming Temp", value: "50–55°C" },
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function FrothRating({ score }: { score: number }) {
  return (
    <div className="flex gap-1" aria-label={`Frothing score: ${score} out of 5`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={`w-3.5 h-3.5 rounded-full inline-block ${
            s <= score ? "bg-cafe-primary" : "bg-cafe-bg/60 border border-cafe-border"
          }`}
        />
      ))}
    </div>
  );
}

function MilkCard({ milk }: { milk: MilkType }) {
  return (
    <div
      className={`group relative bg-gradient-to-b ${milk.accentColor} border ${milk.borderColor} rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col`}
    >
      <div className="p-6 flex-1 flex flex-col space-y-4">
        {/* Header */}
        <div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase tracking-wider font-bold text-cafe-primary font-work-sans">
              {milk.category}
            </span>
            <span className="text-xs font-semibold text-cafe-muted font-work-sans">
              Temp: {milk.specs.find((s) => s.label === "Steaming Temp")?.value}
            </span>
          </div>
          <h3 className="text-xl font-bold font-outfit text-cafe-heading mt-1">
            {milk.name}
          </h3>
        </div>

        {/* Description */}
        <p className="text-xs text-cafe-body font-work-sans leading-relaxed flex-1">
          {milk.description}
        </p>

        {/* Parameters */}
        <div className="bg-white/40 border border-white/60 rounded-xl p-3.5 space-y-2">
          <div className="flex justify-between text-xs font-work-sans">
            <span className="text-cafe-muted">Flavor:</span>
            <span className="font-semibold text-cafe-heading">{milk.flavorProfile}</span>
          </div>
          <div className="flex justify-between text-xs font-work-sans">
            <span className="text-cafe-muted">Best For:</span>
            <span className="font-semibold text-cafe-heading text-right max-w-[200px] leading-tight">
              {milk.bestFor}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs font-work-sans pt-1 border-t border-cafe-border/30">
            <span className="text-cafe-muted">Frothing Ability:</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-cafe-primary">{milk.frothingCapability}</span>
              <FrothRating score={milk.frothingScore} />
            </div>
          </div>
        </div>

        {/* Nutritional & Chemical breakdown */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          {milk.specs
            .filter((s) => s.label !== "Steaming Temp")
            .map((s) => (
              <div
                key={s.label}
                className="bg-white/60 border border-cafe-border/50 rounded-lg p-2 text-center"
              >
                <p className="text-[9px] uppercase font-bold text-cafe-muted font-work-sans mb-0.5">
                  {s.label.split(" ")[0]}
                </p>
                <p className="text-xs font-bold text-cafe-heading font-outfit">{s.value}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function MilkTypesPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12 sm:py-16 space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-work-sans text-cafe-muted">
        <Link to="/brew-compass" className="hover:text-cafe-primary transition-colors">
          Brew School
        </Link>
        <span>/</span>
        <span className="text-cafe-heading font-medium">Types of Milks</span>
      </nav>

      {/* Header */}
      <section className="space-y-4 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] font-semibold text-cafe-primary font-work-sans">
          Module 8
        </p>
        <h1 className="text-4xl sm:text-5xl font-light text-cafe-heading font-outfit leading-tight">
          Types of Milks
        </h1>
        <p className="text-base text-cafe-body font-work-sans leading-relaxed">
          From full-cream dairy to barricaded oat and almond blends, the choice
          of milk dramatically alters the texture, temperature, and taste profile
          of your espresso drink. Learn how protein and fat ratios govern microfoam stability.
        </p>
      </section>

      {/* Cards Grid */}
      <section
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        aria-label="Milk type cards"
      >
        {MILK_TYPES.map((milk) => (
          <MilkCard key={milk.name} milk={milk} />
        ))}
      </section>

      {/* Module nav */}
      <div className="flex items-center justify-between pt-6 border-t border-cafe-border">
        <Link
          to="/brew-compass/coffee-atlas"
          className="inline-flex items-center gap-2 text-sm text-cafe-body hover:text-cafe-heading font-work-sans transition-colors"
        >
          <ArrowLeft size={15} /> Coffee Atlas
        </Link>
        <Link
          to="/brew-compass"
          className="inline-flex items-center gap-2 text-sm text-cafe-primary hover:text-cafe-primary-hover font-semibold font-work-sans transition-colors"
        >
          Back to Hub <ArrowRight size={15} />
        </Link>
      </div>
    </main>
  );
}
