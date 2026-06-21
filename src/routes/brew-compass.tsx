import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Header, Footer } from "@/components/site-chrome";
import {
  Coffee,
  BookOpen,
  Sliders,
  Compass,
  ArrowRight,
  Sparkles,
  Flame,
  Globe,
  Info,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/brew-compass")({
  head: () => ({
    meta: [
      { title: "The Brew Compass — Coffee Education Hub" },
      {
        name: "description",
        content: "Explore the anatomy of espresso drinks, coffee brewing methods, roasts, and bean flavor origins.",
      },
    ],
  }),
  component: BrewCompass,
});

interface Layer {
  name: string;
  percent: number;
  color: string;
  textColor: string;
}

interface Drink {
  name: string;
  description: string;
  layers: Layer[];
}

const DRINKS: Drink[] = [
  {
    name: "Espresso",
    description: "A concentrated shot of coffee brewed under high pressure. The building block of all espresso drinks.",
    layers: [
      { name: "Espresso", percent: 100, color: "bg-[#4A2C11]", textColor: "text-white" },
    ],
  },
  {
    name: "Macchiato",
    description: "A shot of espresso marked with a small dollop of velvety milk foam.",
    layers: [
      { name: "Espresso", percent: 80, color: "bg-[#4A2C11]", textColor: "text-white" },
      { name: "Milk Foam", percent: 20, color: "bg-[#FFFDF9] border-t border-[#F5EBE9]", textColor: "text-[#6B5C58]" },
    ],
  },
  {
    name: "Cortado",
    description: "Equal parts espresso and warm steamed milk, creating a perfectly balanced flavor profile with reduced acidity.",
    layers: [
      { name: "Espresso", percent: 50, color: "bg-[#4A2C11]", textColor: "text-white" },
      { name: "Steamed Milk", percent: 50, color: "bg-[#F5E6CA]", textColor: "text-[#6B5C58]" },
    ],
  },
  {
    name: "Flat White",
    description: "Strong espresso combined with silky microfoam steamed milk, characterized by a smooth, velvety texture.",
    layers: [
      { name: "Espresso", percent: 35, color: "bg-[#4A2C11]", textColor: "text-white" },
      { name: "Steamed Milk", percent: 55, color: "bg-[#F5E6CA]", textColor: "text-[#6B5C58]" },
      { name: "Milk Foam", percent: 10, color: "bg-[#FFFDF9]", textColor: "text-[#6B5C58]" },
    ],
  },
  {
    name: "Latte",
    description: "A milder espresso drink composed of steamed milk, topped with a thin layer of foam.",
    layers: [
      { name: "Espresso", percent: 20, color: "bg-[#4A2C11]", textColor: "text-white" },
      { name: "Steamed Milk", percent: 70, color: "bg-[#F5E6CA]", textColor: "text-[#6B5C58]" },
      { name: "Milk Foam", percent: 10, color: "bg-[#FFFDF9]", textColor: "text-[#6B5C58]" },
    ],
  },
  {
    name: "Cappuccino",
    description: "An airy classic with equal parts espresso, steamed milk, and a thick, cloud-like layer of milk foam.",
    layers: [
      { name: "Espresso", percent: 33, color: "bg-[#4A2C11]", textColor: "text-white" },
      { name: "Steamed Milk", percent: 33, color: "bg-[#F5E6CA]", textColor: "text-[#6B5C58]" },
      { name: "Milk Foam", percent: 34, color: "bg-[#FFFDF9]", textColor: "text-[#6B5C58]" },
    ],
  },
  {
    name: "Americano",
    description: "Espresso shots diluted with hot water, yielding a strength similar to drip coffee but with a distinct flavor profile.",
    layers: [
      { name: "Espresso", percent: 33, color: "bg-[#4A2C11]", textColor: "text-white" },
      { name: "Hot Water", percent: 67, color: "bg-[#E0F2FE]", textColor: "text-[#0369a1]" },
    ],
  },
];

interface BrewMethod {
  name: string;
  description: string;
  cupProfile: string;
  imageUrl: string;
  fullCircleQuery: string;
}

interface BrewCategory {
  title: string;
  intro: string;
  methods: BrewMethod[];
}

const BREW_CATEGORIES: Record<string, BrewCategory> = {
  immersion: {
    title: "Immersion",
    intro: "Coffee grounds sit in water for a period of time, extracting slowly and yielding a full-bodied, rich cup.",
    methods: [
      {
        name: "French Press",
        description: "A classic brewer using a metal mesh filter. Allows coffee oils and fine particles to pass through, delivering maximum body and earthy depth.",
        cupProfile: "Heavy body, rich mouthfeel, robust and comforting.",
        imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=600",
        fullCircleQuery: "French Press",
      },
      {
        name: "Aeropress",
        description: "A rapid, versatile plunger system. Uses air pressure to push water through coffee and a paper filter, producing a clean yet concentrated cup.",
        cupProfile: "Smooth, low acidity, highly customizable body.",
        imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600",
        fullCircleQuery: "Aeropress",
      },
    ],
  },
  pourover: {
    title: "Pour-Over (Drip)",
    intro: "Hot water flows through a bed of coffee and a paper filter, resulting in a clean, tea-like, and highly aromatic extraction.",
    methods: [
      {
        name: "Hario V60",
        description: "A 60-degree cone-shaped dripper with spiral ribs. Requires precise pouring technique to showcase the coffee's bright acidity and nuanced notes.",
        cupProfile: "Light, tea-like body, clean and flavor-forward.",
        imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600",
        fullCircleQuery: "V60",
      },
      {
        name: "Chemex",
        description: "An elegant, hourglass-shaped glass brewer utilizing ultra-thick paper filters that trap bitter compounds and sediment.",
        cupProfile: "Exceptionally clean, crisp acidity, complex floral tones.",
        imageUrl: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&q=80&w=600",
        fullCircleQuery: "Chemex",
      },
      {
        name: "Kalita Wave",
        description: "A flat-bottomed dripper with three small holes. Promotes a more even, forgiving extraction with balanced sweetness.",
        cupProfile: "Consistent, sweet, medium-body clarity.",
        imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600",
        fullCircleQuery: "Kalita",
      },
    ],
  },
  pressure: {
    title: "Pressure",
    intro: "Water is forced through finely ground coffee under pressure, extracting rapidly to yield a dense, intense, and syrupy cup.",
    methods: [
      {
        name: "Espresso Machine",
        description: "Forces water at 9 bars of pressure through a compacted puck of coffee. Delivers highly concentrated liquid topped with aromatic crema.",
        cupProfile: "Highly intense, syrup-like body, complex and bold.",
        imageUrl: "https://images.unsplash.com/photo-151097252790b-af4f902c2127?auto=format&fit=crop&q=80&w=600",
        fullCircleQuery: "Espresso",
      },
      {
        name: "Moka Pot",
        description: "A stovetop brewer that uses steam pressure to force bubbling hot water upwards through coffee grounds.",
        cupProfile: "Heavy, bittersweet, espresso-adjacent intensity.",
        imageUrl: "https://images.unsplash.com/photo-1517088455889-bfa75135412c?auto=format&fit=crop&q=80&w=600",
        fullCircleQuery: "Moka Pot",
      },
    ],
  },
};

function BrewCompass() {
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(DRINKS[0]);

  const allMethods = Object.values(BREW_CATEGORIES)
    .flatMap((cat) => cat.methods)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-cafe-bg">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12 sm:py-16 space-y-24">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FDE4DD] text-[#E67E6B] rounded-full text-xs font-semibold font-work-sans">
            <Compass size={14} strokeWidth={1.5} className="animate-spin-slow" />
            <span>The Brew Compass</span>
          </div>
          <h1 className="text-4xl sm:text-5xl tracking-tight font-light text-cafe-heading font-outfit leading-tight">
            Navigate your coffee journey.
          </h1>
          <p className="text-base text-cafe-body leading-relaxed font-work-sans">
            Whether decoding coffee shop menus, fine-tuning your home brewing setup, or understanding the origin notes in your favorite beans — explore the craft behind every cup.
          </p>
        </section>

        {/* Section A: The Menu Decoder */}
        <section className="space-y-10">
          <div className="border-b border-cafe-border pb-4">
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-cafe-primary font-work-sans">
              Section A
            </p>
            <h2 className="mt-2 text-3xl font-medium text-cafe-heading font-outfit">
              The Menu Decoder
            </h2>
            <p className="mt-1 text-sm text-cafe-body font-work-sans">
              Understand the espresso-to-milk anatomy behind your favorite coffee shop orders.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Bento Tetris Grid */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {DRINKS.map((drink) => {
                const isSelected = selectedDrink?.name === drink.name;
                return (
                  <button
                    key={drink.name}
                    type="button"
                    onClick={() => setSelectedDrink(drink)}
                    className={`text-left rounded-2xl p-6 bg-white border transition-all duration-300 hover:scale-105 ${
                      isSelected
                        ? "border-cafe-primary ring-2 ring-cafe-primary/20 shadow-md"
                        : "border-cafe-border hover:border-cafe-primary/50 shadow-sm"
                    }`}
                  >
                    <h3 className="font-outfit font-semibold text-lg text-cafe-heading mb-4">
                      {drink.name}
                    </h3>

                    {/* CSS Layer Cake Visual */}
                    <div className="relative h-28 w-full rounded-xl border border-cafe-border overflow-hidden bg-cafe-bg/40 flex flex-col-reverse shadow-inner">
                      {drink.layers.map((layer, index) => (
                        <div
                          key={index}
                          className={`${layer.color} transition-all duration-500`}
                          style={{ height: `${layer.percent}%` }}
                          title={`${layer.name}: ${layer.percent}%`}
                        />
                      ))}
                    </div>

                    <p className="mt-4 text-xs text-cafe-muted font-work-sans line-clamp-2">
                      {drink.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Selected Detail Panel */}
            <div className="lg:col-span-4 bg-white border border-cafe-border rounded-2xl p-8 space-y-6 shadow-sm sticky top-28 self-start">
              {selectedDrink ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-cafe-primary font-work-sans">
                      Anatomy Breakdown
                    </span>
                    <h3 className="text-2xl font-semibold text-cafe-heading font-outfit">
                      {selectedDrink.name}
                    </h3>
                  </div>

                  <p className="text-sm leading-relaxed text-cafe-body font-work-sans">
                    {selectedDrink.description}
                  </p>

                  <div className="space-y-3">
                    <span className="text-xs font-semibold text-cafe-heading font-work-sans block">
                      Proportions
                    </span>
                    <div className="space-y-2">
                      {selectedDrink.layers.map((layer, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <span className={`w-3.5 h-3.5 rounded-full ${layer.color} border border-cafe-border`} />
                          <div className="flex-1 flex justify-between text-xs font-work-sans">
                            <span className="text-cafe-body">{layer.name}</span>
                            <span className="font-semibold text-cafe-heading">{layer.percent}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-cafe-border flex justify-between items-center">
                    <span className="text-xs text-cafe-muted font-work-sans">Find this serving on Indie Cafe Hub</span>
                    <Link
                      to="/directory"
                      search={{ query: selectedDrink.name }}
                      className="text-cafe-primary hover:text-cafe-primary-hover transition-colors inline-flex items-center gap-1.5 text-xs font-semibold font-work-sans"
                    >
                      Search Cafes <ArrowRight size={14} strokeWidth={1.5} />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-cafe-muted font-work-sans">
                  Select a drink to inspect its layers.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Section B: The Brew Guide */}
        <section className="space-y-10">
          <div className="border-b border-cafe-border pb-4">
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-cafe-primary font-work-sans">
              Section B
            </p>
            <h2 className="mt-2 text-3xl font-medium text-cafe-heading font-outfit">
              The Brew Guide
            </h2>
            <p className="mt-1 text-sm text-cafe-body font-work-sans">
              Explore the distinct methodologies of coffee preparation and how water extracts flavor.
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full space-y-8">
            <div className="flex justify-center">
              <TabsList className="bg-white border border-cafe-border rounded-xl p-1 shadow-sm gap-1 flex flex-wrap max-w-lg w-full">
                <TabsTrigger
                  value="all"
                  className="flex-1 text-xs font-semibold font-work-sans py-2 px-3 rounded-lg data-[state=active]:bg-[#FDE4DD] data-[state=active]:text-[#E67E6B] text-cafe-body transition-all"
                >
                  All Methods
                </TabsTrigger>
                {Object.entries(BREW_CATEGORIES).map(([key, category]) => (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="flex-1 text-xs font-semibold font-work-sans py-2 px-3 rounded-lg data-[state=active]:bg-[#FDE4DD] data-[state=active]:text-[#E67E6B] text-cafe-body transition-all"
                  >
                    {category.title}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value="all" className="space-y-6 animate-fade-in outline-none">
              <div className="max-w-2xl mx-auto text-center mb-10">
                <p className="text-sm italic text-cafe-body font-work-sans leading-relaxed">
                  "Every brewing method, ordered from A to Z, detailing their unique techniques and cup profiles."
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allMethods.map((method) => (
                  <div
                    key={method.name}
                    className="bg-white border border-cafe-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                  >
                    <div className="relative h-48 bg-cafe-bg overflow-hidden border-b border-cafe-border">
                      <img
                        src={method.imageUrl}
                        alt={method.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-cafe-border/50 text-[10px] font-semibold text-cafe-primary font-work-sans">
                        Brew Method
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-outfit font-semibold text-lg text-cafe-heading">
                          {method.name}
                        </h3>
                        <p className="text-xs leading-relaxed text-cafe-body font-work-sans">
                          {method.description}
                        </p>
                      </div>

                      <div className="bg-cafe-bg/40 p-3.5 rounded-xl border border-cafe-border space-y-1 text-xs">
                        <span className="font-bold text-cafe-heading font-work-sans flex items-center gap-1">
                          <Sparkles size={12} className="text-cafe-primary" /> Cup Profile:
                        </span>
                        <span className="text-cafe-body font-work-sans">{method.cupProfile}</span>
                      </div>

                      <Link
                        to="/directory"
                        search={{ query: method.fullCircleQuery }}
                        className="w-full text-center py-2 bg-cafe-bg hover:bg-[#FDE4DD]/40 text-[#E67E6B] rounded-xl font-work-sans font-semibold text-xs transition-all hover:scale-[1.02] inline-flex items-center justify-center gap-1.5 cursor-pointer border border-[#FDE4DD]"
                      >
                        Find cafes serving {method.name}
                        <ArrowRight size={13} strokeWidth={1.5} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {Object.entries(BREW_CATEGORIES).map(([key, category]) => (
              <TabsContent key={key} value={key} className="space-y-6 animate-fade-in outline-none">
                <div className="max-w-2xl mx-auto text-center mb-10">
                  <p className="text-sm italic text-cafe-body font-work-sans leading-relaxed">
                    "{category.intro}"
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {category.methods.map((method) => (
                    <div
                      key={method.name}
                      className="bg-white border border-cafe-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                    >
                      {/* Image container for Cloudinary substitution */}
                      <div className="relative h-48 bg-cafe-bg overflow-hidden border-b border-cafe-border">
                        <img
                          src={method.imageUrl}
                          alt={method.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-cafe-border/50 text-[10px] font-semibold text-cafe-primary font-work-sans">
                          {category.title}
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <h3 className="font-outfit font-semibold text-lg text-cafe-heading">
                            {method.name}
                          </h3>
                          <p className="text-xs leading-relaxed text-cafe-body font-work-sans">
                            {method.description}
                          </p>
                        </div>

                        <div className="bg-cafe-bg/40 p-3.5 rounded-xl border border-cafe-border space-y-1 text-xs">
                          <span className="font-bold text-cafe-heading font-work-sans flex items-center gap-1">
                            <Sparkles size={12} className="text-cafe-primary" /> Cup Profile:
                          </span>
                          <span className="text-cafe-body font-work-sans">{method.cupProfile}</span>
                        </div>

                        <Link
                          to="/directory"
                          search={{ query: method.fullCircleQuery }}
                          className="w-full text-center py-2 bg-cafe-bg hover:bg-[#FDE4DD]/40 text-[#E67E6B] rounded-xl font-work-sans font-semibold text-xs transition-all hover:scale-[1.02] inline-flex items-center justify-center gap-1.5 cursor-pointer border border-[#FDE4DD]"
                        >
                          Find cafes serving {method.name}
                          <ArrowRight size={13} strokeWidth={1.5} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        {/* Section C: The Bean Matrix */}
        <section className="space-y-10">
          <div className="border-b border-cafe-border pb-4">
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-cafe-primary font-work-sans">
              Section C
            </p>
            <h2 className="mt-2 text-3xl font-medium text-cafe-heading font-outfit">
              The Bean Matrix
            </h2>
            <p className="mt-1 text-sm text-cafe-body font-work-sans">
              Master the roasting spectrum and regional origin profiles.
            </p>
          </div>

          <div className="w-full bg-white border border-cafe-border rounded-2xl p-8 space-y-6 shadow-sm">
            <h3 className="font-outfit font-semibold text-xl text-cafe-heading flex items-center gap-2">
              <Flame size={18} strokeWidth={1.5} className="text-cafe-primary" />
              The Roast Spectrum
            </h3>

            <p className="text-xs leading-relaxed text-cafe-body font-work-sans">
              Roasting transforms green coffee beans into the aromatic, brown beans we brew. The roasting level changes both the body and flavor compounds:
            </p>

            {/* CSS Horizontal Gradient Bar */}
            <div className="space-y-1.5">
              <div className="h-4 w-full rounded-full bg-gradient-to-r from-[#D3A280] via-[#85583B] to-[#3B1F0E] shadow-inner" />
              <div className="flex justify-between text-[10px] font-bold text-cafe-muted font-work-sans px-1">
                <span>LIGHT (385°F - 410°F)</span>
                <span>MEDIUM (410°F - 430°F)</span>
                <span>DARK (440°F - 465°F)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="space-y-1 text-xs">
                <span className="font-semibold text-cafe-heading font-work-sans block">Light Roasts</span>
                <span className="text-cafe-body font-work-sans block">
                  Bright, floral, citrus and berry notes. High acidity, lighter body. Preserves the bean's origin characteristics.
                </span>
              </div>
              <div className="space-y-1 text-xs">
                <span className="font-semibold text-cafe-heading font-work-sans block">Medium Roasts</span>
                <span className="text-cafe-body font-work-sans block">
                  Balanced acidity and sweetness. Notes of milk chocolate, nuts, and caramel. The sweet spot of roast & origin.
                </span>
              </div>
              <div className="space-y-1 text-xs">
                <span className="font-semibold text-cafe-heading font-work-sans block">Dark Roasts</span>
                <span className="text-cafe-body font-work-sans block">
                  Low acidity, bold, heavy body. Notes of dark chocolate, smoke, caramel, and spice. Pronounced roast flavor.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section D: Coffee by Region */}
        <section className="space-y-10">
          <div className="border-b border-cafe-border pb-4">
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-cafe-primary font-work-sans">
              Section D
            </p>
            <h2 className="mt-2 text-3xl font-medium text-cafe-heading font-outfit">
              Coffee by region
            </h2>
            <p className="mt-1 text-sm text-cafe-body font-work-sans">
              Discover unique tasting notes and characteristics shaped by geographical microclimates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Latin America */}
            <div className="bg-white border border-cafe-border rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cafe-bg flex items-center justify-center text-cafe-primary border border-cafe-border">
                  <Globe size={18} strokeWidth={1.5} />
                </div>
                <h3 className="font-outfit font-semibold text-lg text-cafe-heading">
                  Latin America
                </h3>
              </div>
              <p className="text-xs text-cafe-body font-work-sans leading-relaxed">
                Known for very approachable, balanced flavors. Frequently features notes of cocoa, toasted nuts, sweet caramel, and soft stone fruits. Typically processed using the washed method for a clean cup.
              </p>
              <div className="bg-cafe-bg/40 p-3.5 rounded-xl border border-cafe-border space-y-1 text-[11px]">
                <span className="font-bold text-cafe-heading font-work-sans">Key Profiles:</span>
                <span className="text-cafe-body font-work-sans block">Nutty, Chocolatey, Sweet, Stone Fruit</span>
              </div>
            </div>

            {/* Africa */}
            <div className="bg-white border border-cafe-border rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cafe-bg flex items-center justify-center text-cafe-primary border border-cafe-border">
                  <Globe size={18} strokeWidth={1.5} />
                </div>
                <h3 className="font-outfit font-semibold text-lg text-cafe-heading">
                  Africa
                </h3>
              </div>
              <p className="text-xs text-cafe-body font-work-sans leading-relaxed">
                Celebrated for vibrant, complex, and tea-like qualities. Expresses intense berry sweetness, bright citrus acidity (like lemon or bergamot), and jasmin-like floral aromas.
              </p>
              <div className="bg-cafe-bg/40 p-3.5 rounded-xl border border-cafe-border space-y-1 text-[11px]">
                <span className="font-bold text-cafe-heading font-work-sans">Key Profiles:</span>
                <span className="text-cafe-body font-work-sans block">Fruity, Citrusy, Floral, Tea-like</span>
              </div>
            </div>

            {/* Asia */}
            <div className="bg-white border border-cafe-border rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cafe-bg flex items-center justify-center text-cafe-primary border border-cafe-border">
                  <Globe size={18} strokeWidth={1.5} />
                </div>
                <h3 className="font-outfit font-semibold text-lg text-cafe-heading">
                  Asia
                </h3>
              </div>
              <p className="text-xs text-cafe-body font-work-sans leading-relaxed">
                Offers full-bodied, earthy, and herbal notes. Highlighted by wet-hulled coffees from Sumatra featuring cedar and spice, and rich, chocolatey, low-acid beans from India (Karnataka).
              </p>
              <div className="bg-cafe-bg/40 p-3.5 rounded-xl border border-cafe-border space-y-1 text-[11px]">
                <span className="font-bold text-cafe-heading font-work-sans">Key Profiles:</span>
                <span className="text-cafe-body font-work-sans block">Earthy, Spicy, Herbal, Cedar, Bold Body</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
