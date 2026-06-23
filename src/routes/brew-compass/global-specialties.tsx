import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/brew-compass/global-specialties")({
  head: () => ({
    meta: [
      { title: "Iconic Global Coffee Specialties | Brew School" },
      {
        name: "description",
        content:
          "Explore traditional global coffee recipes: Turkish Cezve, Vietnamese phin drip, and Algerian Mazagran. Learn their histories and visual layers.",
      },
    ],
  }),
  component: GlobalSpecialtiesPage,
});

// ─── Data ────────────────────────────────────────────────────────────────────
interface SpecialtyLayer {
  name: string;
  height: string;
  bg: string;
}

interface SpecialtyDrink {
  name: string;
  origin: string;
  tagline: string;
  description: string;
  accentColor: string;
  textAccent: string;
  imageUrl: string;
  layers: SpecialtyLayer[];
  isDark?: boolean;
  countryCodes?: string[];
}

const GLOBAL_DRINKS: SpecialtyDrink[] = [
  {
    name: "Turkish Coffee",
    origin: "Turkey & Yemen",
    tagline: "Ancient Cezve extraction.",
    description:
      "Finely powdered coffee beans simmered in a copper cezve pot, served unfiltered. The grounds settle at the bottom of the cup, creating an incredibly rich, thick, and intense texture.",
    accentColor: "from-[#FDF2E9] to-[#F5CBA7]",
    textAccent: "text-amber-900",
    imageUrl: "https://res.cloudinary.com/daon1coiv/image/upload/v1782142058/Turkish-Coffee_ibniu9.jpg",
    countryCodes: ["TR", "YE"],
    layers: [
      { name: "Silt / Coffee Grounds", height: "20%", bg: "bg-[#27150C]" },
      { name: "Thick Unfiltered Coffee", height: "65%", bg: "bg-[#3E2723]" },
      { name: "Velvety Crema Foam", height: "15%", bg: "bg-[#8D6E63]/70" },
    ],
  },
  {
    name: "Vietnamese Cà Phê Sữa Đá",
    origin: "Vietnam",
    tagline: "Slow phin drip over condensed milk.",
    description:
      "Strong Robusta coffee brewed slowly through a metal phin filter directly onto a thick layer of sweetened condensed milk, then stirred and poured over crushed ice.",
    accentColor: "from-[#E8F8F5] to-[#A3E4D7]",
    textAccent: "text-teal-900",
    imageUrl: "https://res.cloudinary.com/daon1coiv/image/upload/v1782142291/Vietnamese_C%C3%A0_Ph%C3%AA_S%E1%BB%AFa_%C4%90%C3%A1_eq1ygm.jpg",
    countryCodes: ["VN"],
    layers: [
      { name: "Crushed Ice", height: "20%", bg: "bg-white/40" },
      { name: "Strong Robusta Brew", height: "55%", bg: "bg-[#3E2723]/90" },
      { name: "Sweetened Condensed Milk", height: "25%", bg: "bg-amber-100" },
    ],
  },
  {
    name: "Mazagran",
    origin: "Algeria & Portugal",
    tagline: "The original iced lemon coffee.",
    description:
      "Originating in 1840s Algeria, French soldiers mixed cold coffee with water and lemon juice. The Portuguese adaptation swaps water for lemonade or iced tea, creating a sweet, citrusy pick-me-up.",
    accentColor: "from-[#FEF9E7] to-[#F9E79F]",
    textAccent: "text-amber-800",
    imageUrl: "https://res.cloudinary.com/daon1coiv/image/upload/v1782137523/Mazagran_coffee_Algeria_Portugal_wanbdw.png",
    countryCodes: ["DZ", "PT"],
    layers: [
      { name: "Ice Cubes", height: "15%", bg: "bg-white/30" },
      { name: "Lemon Slice & Juice / Soda", height: "25%", bg: "bg-yellow-200/50" },
      { name: "Sweetened Cold Espresso", height: "60%", bg: "bg-[#3E2723]/80" },
    ],
  },
  {
    name: "Café de Olla",
    origin: "Mexico",
    tagline: "Spiced clay-pot brew.",
    description:
      "Brewed in a clay pot and spiced with cinnamon and unrefined cane sugar (piloncillo).",
    accentColor: "from-[#FDF2E9] to-[#E5D3C3]",
    textAccent: "text-amber-800",
    imageUrl: "https://res.cloudinary.com/daon1coiv/image/upload/v1782251179/Caf%C3%A9_de_Olla_-_Mexico_oooujt.png",
    countryCodes: ["MX"],
    layers: [
      { name: "Cane Sugar & Cinnamon Sediment", height: "15%", bg: "bg-[#3d2314]" },
      { name: "Cinnamon Spiced Coffee", height: "85%", bg: "bg-[#5c3821]" },
    ],
  },
  {
    name: "Café Cubano",
    origin: "Cuba",
    tagline: "Extremely strong, sweet espresso.",
    description:
      "Extremely strong, dark-roasted espresso whisked directly with sugar to create a thick, sweet foam (espuma) on top.",
    accentColor: "from-[#FFF5F5] to-[#FED7D7]",
    textAccent: "text-red-900",
    imageUrl: "https://res.cloudinary.com/daon1coiv/image/upload/v1782251179/Cafe_Cubano_Cuba_qodrhp.png",
    countryCodes: ["CU"],
    layers: [
      { name: "Intense Espresso", height: "70%", bg: "bg-[#1c0f0d]" },
      { name: "Espuma (Sweet Sugar Foam)", height: "30%", bg: "bg-[#d4a373]" },
    ],
  },
  {
    name: "Bicerin",
    origin: "Italy",
    tagline: "Three distinct layers of Turin tradition.",
    description:
      "A traditional Turin drink featuring distinct, unmixed layers of espresso, hot chocolate, and whipped cream.",
    accentColor: "from-[#FDFEFE] to-[#EAEDED]",
    textAccent: "text-stone-700",
    imageUrl: "https://res.cloudinary.com/daon1coiv/image/upload/v1782251179/Bicerin_Italy_dnxxa2.png",
    countryCodes: ["IT"],
    layers: [
      { name: "Rich Hot Chocolate", height: "40%", bg: "bg-[#2b1712]" },
      { name: "Strong Espresso", height: "35%", bg: "bg-[#4a2e2b]" },
      { name: "Heavy Whipped Cream", height: "25%", bg: "bg-[#fdfaf6]" },
    ],
  },
  {
    name: "Cortado",
    origin: "Spain",
    tagline: "Perfectly balanced espresso and milk.",
    description:
      "A shot of espresso cut with roughly an equal amount of warm, untextured milk to reduce acidity.",
    accentColor: "from-[#F9EBEA] to-[#F2D7D5]",
    textAccent: "text-rose-900",
    imageUrl: "https://res.cloudinary.com/daon1coiv/image/upload/v1782252607/Cortado_teas1i.jpg",
    countryCodes: ["ES"],
    layers: [
      { name: "Espresso", height: "50%", bg: "bg-[#3e2723]" },
      { name: "Warm Untextured Milk", height: "50%", bg: "bg-[#f5eade]" },
    ],
  },
  {
    name: "Frappé",
    origin: "Greece",
    tagline: "Deeply frothy iced instant coffee.",
    description:
      "Instant coffee, water, and sugar shaken until deeply frothy, then poured over ice.",
    accentColor: "from-[#EBF5FB] to-[#D4E6F1]",
    textAccent: "text-blue-900",
    imageUrl: "https://res.cloudinary.com/daon1coiv/image/upload/v1782252607/Greek_Frapp%C3%A9_2_yv7gct.png",
    countryCodes: ["GR"],
    layers: [
      { name: "Ice & Cold Coffee Mix", height: "40%", bg: "bg-[#4b3621]" },
      { name: "Deep Coffee Foam", height: "60%", bg: "bg-[#c6a07e]" },
    ],
  },
  {
    name: "Kaffeost",
    origin: "Sweden & Finland",
    tagline: "Coffee poured over bread-cheese.",
    description:
      "Hot black coffee poured over chunks of mild, baked bread-cheese.",
    accentColor: "from-[#FEF9E7] to-[#FCF3CF]",
    textAccent: "text-yellow-900",
    imageUrl: "https://res.cloudinary.com/daon1coiv/image/upload/v1782251180/Kaffeost_Sweden_Finland_ita4x4.png",
    countryCodes: ["SE", "FI"],
    layers: [
      { name: "Baked Bread-Cheese Chunks", height: "35%", bg: "bg-[#f9e7b9]" },
      { name: "Hot Black Coffee", height: "65%", bg: "bg-[#2a1708]" },
    ],
  },
  {
    name: "Pharisäer",
    origin: "Germany",
    tagline: "Rum-spiked coffee under whipped cream.",
    description:
      "Strong dark coffee spiked with rum and hidden under a thick cap of whipped cream.",
    accentColor: "from-[#FBEEE6] to-[#F5CBA7]",
    textAccent: "text-orange-950",
    imageUrl: "https://res.cloudinary.com/daon1coiv/image/upload/v1782251179/Pharis%C3%A4er_Germany_jul5zm.png",
    countryCodes: ["DE"],
    layers: [
      { name: "Rum-Spiked Dark Coffee", height: "75%", bg: "bg-[#2b170e]" },
      { name: "Whipped Cream Cap", height: "25%", bg: "bg-[#fafafa]" },
    ],
  },
  {
    name: "Flat White",
    origin: "Australia / New Zealand",
    tagline: "Velvety micro-foamed espresso.",
    description:
      "Espresso paired with velvety micro-foamed milk, featuring a higher coffee-to-milk ratio than a standard latte.",
    accentColor: "from-[#FAF5EF] to-[#EFE3D3]",
    textAccent: "text-amber-950",
    imageUrl: "https://res.cloudinary.com/daon1coiv/image/upload/v1782252606/Flat_White_k6k0ez.jpg",
    countryCodes: ["AU", "NZ"],
    layers: [
      { name: "Bold Espresso", height: "35%", bg: "bg-[#381e13]" },
      { name: "Velvety Microfoam Milk", height: "65%", bg: "bg-[#f6ebdc]" },
    ],
  },
  {
    name: "Kopi Joss",
    origin: "Indonesia",
    tagline: "Charcoal-infused hot brew.",
    description:
      "A street-style hot black coffee made famous by dropping a piece of glowing, red-hot charcoal directly into the cup.",
    accentColor: "from-[#F2F3F4] to-[#D5D8DC]",
    textAccent: "text-slate-800",
    imageUrl: "https://res.cloudinary.com/daon1coiv/image/upload/v1782251179/Kopi_Joss_Indonesia_vus2po.png",
    countryCodes: ["ID"],
    layers: [
      { name: "Glowing Red-Hot Charcoal", height: "20%", bg: "bg-[#e65f2b]" },
      { name: "Hot Sweetened Black Coffee", height: "80%", bg: "bg-[#150a06]" },
    ],
  },
  {
    name: "Yuanyang",
    origin: "Hong Kong",
    tagline: "Coffee and milk tea fusion.",
    description:
      "A harmonious, half-and-half blend of strong coffee and Hong Kong-style milk tea.",
    accentColor: "from-[#FEF5E7] to-[#FDEBD0]",
    textAccent: "text-amber-900",
    imageUrl: "https://res.cloudinary.com/daon1coiv/image/upload/v1782251181/Yuanyang_Hong_Kong_ygvbvz.png",
    countryCodes: ["HK"],
    layers: [
      { name: "Hong Kong-style Milk Tea", height: "50%", bg: "bg-[#d7a15c]" },
      { name: "Strong Coffee", height: "50%", bg: "bg-[#3b2219]" },
    ],
  },
  {
    name: "Indian Filter Coffee",
    origin: "India",
    tagline: "Chicory-infused frothy brew.",
    description:
      "A traditional South Indian beverage made by mixing frothed and boiled milk with the decoction obtained by brewing finely ground coffee powder blended with chicory in a traditional Indian filter, served in a tumbler and dabarah.",
    accentColor: "from-[#FDEDEC] to-[#FADBD8]",
    textAccent: "text-red-950",
    imageUrl: "https://res.cloudinary.com/daon1coiv/image/upload/v1782251661/Indian-Filter-Coffee_fb4hyl.jpg",
    countryCodes: ["IN"],
    layers: [
      { name: "Chicory Decoction", height: "30%", bg: "bg-[#321c13]" },
      { name: "Hot Frothed Milk & Foam", height: "70%", bg: "bg-[#eedac3]" },
    ],
  },
  {
    name: "Café Touba",
    origin: "Senegal",
    tagline: "Deeply spiced pepper coffee.",
    description:
      "A deeply spiced coffee brewed with cloves and grains of Selim (a local spice similar to black pepper).",
    accentColor: "from-[#EAFAF1] to-[#D5F5E3]",
    textAccent: "text-emerald-950",
    imageUrl: "https://res.cloudinary.com/daon1coiv/image/upload/v1782251180/Caf%C3%A9_Touba_Senegal_qn9crm.png",
    countryCodes: ["SN"],
    layers: [
      { name: "Spiced Black Coffee", height: "90%", bg: "bg-[#21110a]" },
      { name: "Grains of Selim & Clove Sediment", height: "10%", bg: "bg-[#120703]" },
    ],
  },
  {
    name: "Qahwa",
    origin: "Saudi Arabia",
    tagline: "Cardamom and saffron light brew.",
    description:
      "A lightly roasted, yellowish coffee heavily spiced with cardamom, saffron, and occasionally rose water.",
    accentColor: "from-[#FEF9E7] to-[#F9E79F]",
    textAccent: "text-yellow-800",
    imageUrl: "https://res.cloudinary.com/daon1coiv/image/upload/v1782251662/Qahwa_Saudi_Arabia_miwawx.png",
    countryCodes: ["SA"],
    layers: [
      { name: "Saffron & Rose Water infusion", height: "20%", bg: "bg-[#ffd54f]/50" },
      { name: "Light Cardamom Spiced Brew", height: "80%", bg: "bg-[#d8c395]" },
    ],
  },
];

// ─── Glass card ──────────────────────────────────────────────────────────────
function SpecialtyCard({ drink }: { drink: SpecialtyDrink }) {
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
      "Assembling...",
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
      {/* Left side: Content & anatomy */}
      <div className="flex-1 p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start">
        {/* Text */}
        <div className="flex-1 flex flex-col h-full min-h-[160px]">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <p className={`text-[10px] uppercase tracking-[0.15em] font-bold font-work-sans ${drink.textAccent}`}>
              {drink.origin}
            </p>
            {drink.countryCodes && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 bg-black/5 rounded font-work-sans text-cafe-body/80 border border-black/5">
                {drink.countryCodes.join(" / ")}
              </span>
            )}
          </div>
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

        {/* Cup Visual */}
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
                className={`w-full transition-all duration-700 ease-in-out ${layer.bg}`}
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
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function GlobalSpecialtiesPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12 sm:py-16 space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-work-sans text-cafe-muted">
        <Link to="/brew-compass" className="hover:text-cafe-primary transition-colors">
          Brew School
        </Link>
        <span>/</span>
        <span className="text-cafe-heading font-medium">Global Specialties</span>
      </nav>

      {/* Header */}
      <section className="space-y-4 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] font-semibold text-cafe-primary font-work-sans">
          Module 4
        </p>
        <h1 className="text-4xl sm:text-5xl font-light text-cafe-heading font-outfit leading-tight">
          Iconic Global Coffee Specialties
        </h1>
        <p className="text-base text-cafe-body font-work-sans leading-relaxed">
          Embark on a global journey to explore the traditional coffee specialties that define different coffee cultures.
          From cezve-brewed unfiltered cups in Turkey to the refreshing lemon-spiked Algerian Mazagran, discover how regional
          ingredients and history shape the daily cup.
        </p>
      </section>

      {/* Grid (1 card per row) */}
      <section
        className="grid grid-cols-1 gap-8"
        aria-label="Global coffee specialties cards"
      >
        {GLOBAL_DRINKS.map((drink) => (
          <SpecialtyCard key={drink.name} drink={drink} />
        ))}
      </section>

      {/* Module nav */}
      <div className="flex items-center justify-between pt-6 border-t border-cafe-border">
        <Link
          to="/brew-compass/black-coffee"
          className="inline-flex items-center gap-2 text-sm text-cafe-body hover:text-cafe-heading font-work-sans transition-colors"
        >
          <ArrowLeft size={15} /> Black Coffee Techniques
        </Link>
        <Link
          to="/brew-compass/connoisseur"
          className="inline-flex items-center gap-2 text-sm text-cafe-primary hover:text-cafe-primary-hover font-semibold font-work-sans transition-colors"
        >
          Next: Connoisseur Corner <ArrowRight size={15} />
        </Link>
      </div>
    </main>
  );
}
