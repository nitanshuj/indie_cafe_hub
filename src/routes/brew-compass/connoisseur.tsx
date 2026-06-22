import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Crown, Star } from "lucide-react";

export const Route = createFileRoute("/brew-compass/connoisseur")({
  head: () => ({
    meta: [
      { title: "Connoisseur Corner — Rare & Premium Coffees | Brew School" },
      {
        name: "description",
        content:
          "Discover the world's rarest and most sought-after coffees — Kopi Luwak, Panama Geisha, Jamaica Blue Mountain, and more.",
      },
    ],
  }),
  component: ConnoisseurPage,
});

// ─── Data ────────────────────────────────────────────────────────────────────
interface PremiumCoffee {
  id: string;
  name: string;
  origin: string;
  priceRange: string;
  rarity: number; // 1–5
  description: string;
  tastingNotes: string[];
  story: string;
  imageUrl: string;
  accent: string;
}

const PREMIUM_COFFEES: PremiumCoffee[] = [
  {
    id: "geisha",
    name: "Panama Geisha",
    origin: "Boquete, Panama",
    priceRange: "$50–$600 / 100g",
    rarity: 5,
    description:
      "Widely considered the pinnacle of specialty coffee, the Geisha (or Gesha) variety produces an extraordinarily complex, almost tea-like cup that has shattered auction records and redefined expectations of what coffee can taste like.",
    tastingNotes: ["Jasmine", "Bergamot", "Peach", "Tropical Fruit", "Honey"],
    story:
      "Originally from Ethiopia, the Geisha variety was brought to Central America in the 1950s. Hacienda La Esmeralda in Panama's highlands began producing it commercially in 2004, winning the Best of Panama auction — and the specialty coffee world was never the same.",
    imageUrl: "https://res.cloudinary.com/daon1coiv/image/upload/v1782158439/Panama_Geisha_yl61de.png",
    accent: "from-amber-800 to-amber-900",
  },
  {
    id: "blue-mountain",
    name: "Jamaica Blue Mountain",
    origin: "Blue Mountains, Jamaica",
    priceRange: "$30–$120 / 100g",
    rarity: 4,
    description:
      "Grown at elevations between 1,800m and 2,200m in the cool, misty Blue Mountains of Jamaica, this coffee is protected by geographical indication and subject to strict quality control. Japan imports nearly 80% of the entire crop.",
    tastingNotes: ["Mild Sweetness", "Herbal", "Nutty", "Zero Bitterness", "Velvety"],
    story:
      "Coffee was introduced to Jamaica in 1728. The Blue Mountain micro-climate — high altitude, rich volcanic soil, consistent rainfall, and cool nights — creates a cup so perfectly balanced it's used as the benchmark for 'perfect mild coffee'.",
    imageUrl: "https://res.cloudinary.com/daon1coiv/image/upload/v1782158987/Jamaican_Blue_Mountain_juhxys.png",
    accent: "from-blue-900 to-slate-900",
  },
  {
    id: "kopi-luwak",
    name: "Kopi Luwak",
    origin: "Indonesia (Sumatra, Bali, Java)",
    priceRange: "$20–$100 / 100g",
    rarity: 5,
    description:
      "The world's most famous novelty coffee. Asian palm civets consume ripe coffee cherries, and the beans pass through their digestive system, during which proteolytic enzymes alter the bean's proteins, reducing bitterness and creating a uniquely smooth, earthy cup.",
    tastingNotes: ["Smooth", "Earthy", "Low Bitterness", "Dark Chocolate", "Musty"],
    story:
      "During Dutch colonial rule in Indonesia, local farmers were forbidden from picking coffee for themselves. They discovered civets were eating the cherries, and began collecting and processing the passed beans — and Kopi Luwak was born. Ethical wild-source versions command a premium.",
    imageUrl: "https://res.cloudinary.com/daon1coiv/image/upload/v1782158987/Kopi-Luwak_t8fd6u.png",
    accent: "from-stone-800 to-stone-900",
  },
  {
    id: "kona",
    name: "Hawaiian Kona",
    origin: "Kona, Big Island, Hawaii",
    priceRange: "$25–$70 / 100g",
    rarity: 3,
    description:
      "Grown on the volcanic slopes of Mauna Loa and Hualalai on Hawaii's Big Island, Kona coffee benefits from rich volcanic mineral soil, afternoon cloud cover, and a unique tropical micro-climate. One of the few coffees grown in the USA.",
    tastingNotes: ["Bright Acidity", "Nutty", "Brown Sugar", "Stone Fruit", "Mild"],
    story:
      "Coffee arrived in Hawaii in 1828. Today Kona's 600+ small farms are tightly regulated — only coffee grown in the North and South Kona districts can legally bear the name. Beware of blends marketed as 'Kona' — they may contain as little as 10% genuine beans.",
    imageUrl: "https://res.cloudinary.com/daon1coiv/image/upload/v1782159349/Hawaiian_Kona_jnvdlo.png",
    accent: "from-orange-900 to-red-950",
  },
];

// ─── Scroll-fade hook ─────────────────────────────────────────────────────────
function useFadeInOnScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

// ─── Coffee entry ─────────────────────────────────────────────────────────────
function CoffeeEntry({ coffee, index }: { coffee: PremiumCoffee; index: number }) {
  const { ref, visible } = useFadeInOnScroll();
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      {/* Full-width hero */}
      <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden mb-8">
        <img
          src={coffee.imageUrl}
          alt={coffee.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-8">
          <div className="flex items-center gap-2 mb-3">
            <Crown size={14} className="text-amber-400" strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-amber-400 font-work-sans">
              Premium Origin
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-medium text-white font-outfit mb-2">
            {coffee.name}
          </h2>
          <p className="text-sm text-white/70 font-work-sans">{coffee.origin}</p>
        </div>
        {/* Price badge */}
        <div className="absolute top-5 right-5 bg-black/60 backdrop-blur-md border border-white/10 text-amber-300 text-xs font-semibold font-work-sans px-3 py-1.5 rounded-xl">
          {coffee.priceRange}
        </div>
      </div>

      {/* Content grid */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${isEven ? "" : "lg:flex-row-reverse"}`}>
        {/* Description + story */}
        <div className="space-y-5">
          {/* Rarity stars */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                strokeWidth={1.5}
                className={i < coffee.rarity ? "text-amber-400 fill-amber-400" : "text-white/20"}
              />
            ))}
            <span className="text-xs text-white/50 font-work-sans ml-2">Rarity</span>
          </div>
          <p className="text-sm text-white/80 font-work-sans leading-relaxed">
            {coffee.description}
          </p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-2">
            <p className="text-xs font-bold text-amber-400 font-work-sans uppercase tracking-wider mb-2">
              Origin Story
            </p>
            <p className="text-sm text-white/70 font-work-sans leading-relaxed italic">
              {coffee.story}
            </p>
          </div>
        </div>

        {/* Tasting notes + gradient visual */}
        <div className="space-y-5">
          <div className={`h-40 rounded-2xl bg-gradient-to-br ${coffee.accent} flex items-center justify-center`}>
            <div className="text-center space-y-2 px-6">
              <Crown size={28} strokeWidth={1} className="text-amber-300 mx-auto" />
              <p className="text-sm font-outfit font-medium text-white">{coffee.name}</p>
              <p className="text-[10px] text-white/60 font-work-sans">{coffee.origin}</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <p className="text-xs font-bold text-amber-400 font-work-sans uppercase tracking-wider mb-3">
              Tasting Notes
            </p>
            <div className="flex flex-wrap gap-2">
              {coffee.tastingNotes.map((note) => (
                <span
                  key={note}
                  className="text-xs font-work-sans text-white/80 px-3 py-1 rounded-full border border-white/10 bg-white/5"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function ConnoisseurPage() {
  return (
    <div className="bg-[#1C1917] min-h-screen">
      <main className="max-w-6xl mx-auto px-6 py-12 sm:py-16 space-y-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-work-sans text-white/40">
          <Link to="/brew-compass" className="hover:text-amber-400 transition-colors">
            Brew School
          </Link>
          <span>/</span>
          <span className="text-white/70 font-medium">Connoisseur Corner</span>
        </nav>

        {/* Header */}
        <section className="space-y-5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-semibold font-work-sans border border-amber-500/20">
            <Crown size={12} strokeWidth={1.5} />
            Module 5
          </div>
          <h1 className="text-4xl sm:text-5xl font-light text-white font-outfit leading-tight">
            Connoisseur Corner
          </h1>
          <p className="text-base text-white/60 font-work-sans leading-relaxed">
            The rarest, most celebrated, and most expensive coffees in the
            world. Each with a story, a geography, and a flavour profile that
            pushes the boundaries of what coffee can be.
          </p>
        </section>

        {/* Entries */}
        <div className="space-y-28">
          {PREMIUM_COFFEES.map((coffee, i) => (
            <CoffeeEntry key={coffee.id} coffee={coffee} index={i} />
          ))}
        </div>

        {/* Module nav */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <Link
            to="/brew-compass/black-coffee"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white font-work-sans transition-colors"
          >
            <ArrowLeft size={15} /> Black Coffee Methods
          </Link>
          <Link
            to="/brew-compass/bean-roast-spectrum"
            className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 font-semibold font-work-sans transition-colors"
          >
            Next: Bean & Roast Spectrum <ArrowRight size={15} />
          </Link>
        </div>
      </main>
    </div>
  );
}
