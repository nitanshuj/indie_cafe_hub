import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Compass,
  Coffee,
  Snowflake,
  Beaker,
  Crown,
  Flame,
  Globe,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/brew-compass/")({
  head: () => ({
    meta: [
      { title: "Brew School Hub — Navigate Your Coffee Journey" },
      {
        name: "description",
        content:
          "Your guide to understanding coffee — from espresso anatomy to world origins, roasts, and premium single-origins.",
      },
    ],
  }),
  component: BrewSchoolHub,
});

const MODULES = [
  {
    to: "/brew-compass/menu-decoder",
    icon: Coffee,
    label: "The Menu Decoder - The Basic Coffees",
    sublabel: "The Basic Coffees",
    description:
      "Decode every drink on the coffee shop menu. Visualize the exact anatomy of each cup — espresso to foam — with an interactive layer-pour animation that shows you what's actually in your glass.",
    accent: "from-[#FFF8F2] to-[#FFE8D0]",
    border: "border-[#FFD6B0]",
    iconBg: "bg-[#4A2C11]",
    iconColor: "text-white",
    badge: "Start Here",
    badgeColor: "bg-[#4A2C11] text-white",
    imageUrl:
      "https://res.cloudinary.com/daon1coiv/image/upload/v1782155491/Module-1-The_Menu_Decoder_hpv1qa.jpg",
    imageAlt: "Espresso being poured",
  },
  {
    to: "/brew-compass/chilled-bar",
    icon: Snowflake,
    label: "The Chilled Bar",
    sublabel: "The Basic Cold Coffees",
    description:
      "Iced espressos, shaken drinks, Vietnamese cà phê sữa đá, and cold brew. Discover the science and story behind cold coffee — from the world's oldest iced drink to the modern shaken espresso.",
    accent: "from-[#F0F9FF] to-[#DBEAFE]",
    border: "border-[#BFDBFE]",
    iconBg: "bg-[#0369A1]",
    iconColor: "text-white",
    badge: "Cool & Refreshing",
    badgeColor: "bg-[#0369A1] text-white",
    imageUrl:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=900",
    imageAlt: "Iced coffee with ice cubes",
  },
  {
    to: "/brew-compass/black-coffee",
    icon: Beaker,
    label: "Black Coffee Brewing Techniques",
    sublabel: "Brew Techniques",
    description:
      "V60, Chemex, French Press, AeroPress, Moka Pot, and Kalita Wave — step-by-step guides with brew parameters, grind sizes, and temperatures for every major black coffee brewing method.",
    accent: "from-[#FFF5F3] to-[#FFE4DE]",
    border: "border-[#FECDC4]",
    iconBg: "bg-cafe-primary",
    iconColor: "text-white",
    badge: "Techniques",
    badgeColor: "bg-cafe-primary text-white",
    imageUrl:
      "https://res.cloudinary.com/daon1coiv/image/upload/v1782155255/black-coffee-cover_pgsfqq.jpg",
    imageAlt: "French press brewing",
  },
  {
    to: "/brew-compass/global-specialties",
    icon: Globe,
    label: "Iconic Global Coffee Specialties",
    sublabel: "Global Treasures",
    description:
      "Travel the world through its coffee. From the rich and thick Turkish Coffee to the historic Algerian Mazagran, explore the iconic regional specialties that define global coffee cultures.",
    accent: "from-[#F5F3FF] to-[#EDE9FE]",
    border: "border-[#DDD6FE]",
    iconBg: "bg-purple-700",
    iconColor: "text-white",
    badge: "World Tour",
    badgeColor: "bg-purple-700 text-white",
    imageUrl:
      "https://res.cloudinary.com/daon1coiv/image/upload/v1782155492/Module-4-Iconic-Global-Coffee-Specialities_vfl9bt.jpg",
    imageAlt: "Turkish coffee set",
  },
  {
    to: "/brew-compass/connoisseur",
    icon: Crown,
    label: "Connoisseur Corner",
    sublabel: "Premium & Rare",
    description:
      "Kopi Luwak, Jamaica Blue Mountain, Panama Geisha, Hawaiian Kona. Explore the origin stories and tasting profiles of the world's rarest, most sought-after, and most expensive coffees.",
    accent: "from-[#292524] to-[#1C1917]",
    border: "border-[#44403C]",
    iconBg: "bg-amber-500",
    iconColor: "text-white",
    badge: "Premium",
    badgeColor: "bg-amber-500 text-white",
    dark: true,
    imageUrl:
      "https://res.cloudinary.com/daon1coiv/image/upload/v1782156145/Module_4_-_Connoisseur_Corner_cemahl.png",
    imageAlt: "Premium specialty coffee",
  },
  {
    to: "/brew-compass/bean-roast-spectrum",
    icon: Flame,
    label: "Bean & Roast Spectrum",
    sublabel: "Arabica vs Robusta",
    description:
      "Compare Arabica and Robusta species side-by-side in a detailed specs table. Then drag the interactive roast slider to watch a coffee bean darken and see how heat transforms acidity, body, and flavour in real time.",
    accent: "from-[#FFFBEB] to-[#FEF3C7]",
    border: "border-[#FDE68A]",
    iconBg: "bg-amber-700",
    iconColor: "text-white",
    badge: "Interactive",
    badgeColor: "bg-amber-700 text-white",
    imageUrl:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=900",
    imageAlt: "Coffee roasting beans",
  },
  {
    to: "/brew-compass/coffee-atlas",
    icon: Globe,
    label: "The Coffee Atlas",
    sublabel: "Regions & Origins",
    description:
      "Ethiopia, Colombia, Brazil, Kenya, Yemen, Indonesia — explore the world's top coffee-producing nations on an interactive SVG map. Click any pin to reveal the country's full origin passport with processing methods and signature flavour notes.",
    accent: "from-[#F0FDF4] to-[#DCFCE7]",
    border: "border-[#BBF7D0]",
    iconBg: "bg-emerald-700",
    iconColor: "text-white",
    badge: "World Map",
    badgeColor: "bg-emerald-700 text-white",
    imageUrl:
      "https://images.unsplash.com/photo-1523920290228-4f321a939b4c?auto=format&fit=crop&q=80&w=900",
    imageAlt: "Coffee farms on a hillside",
  },
  {
    to: "/brew-compass/milk-types",
    icon: Beaker,
    label: "Types of milks",
    sublabel: "Dairy & Alternatives",
    description:
      "Dairy Milk, Oat Milk, Almond Milk, Soy Milk. Discover how different milks behave when steamed, and how their distinct flavor profiles pair with various coffee beans and roasts.",
    accent: "from-[#F8FAFC] to-[#F1F5F9]",
    border: "border-[#E2E8F0]",
    iconBg: "bg-slate-600",
    iconColor: "text-white",
    badge: "Pairings",
    badgeColor: "bg-slate-600 text-white",
    imageUrl:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=900",
    imageAlt: "Pouring milk into coffee",
  },
] as const;

function BrewSchoolHub() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12 sm:py-20 space-y-20">
      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FDE4DD] text-[#E67E6B] rounded-full text-xs font-semibold font-work-sans">
          <Compass size={14} strokeWidth={1.5} className="animate-spin-slow" />
          <span>The Brew School</span>
        </div>
        <h1 className="text-4xl sm:text-5xl tracking-tight font-light text-cafe-heading font-outfit leading-tight">
          Navigate your coffee journey.
        </h1>
        <p className="text-base text-cafe-body leading-relaxed font-work-sans max-w-2xl mx-auto">
          Whether you're decoding a coffee shop menu for the first time or
          chasing a rare single-origin — the Brew School has a module for every
          stage of your coffee education.
        </p>
      </section>

      {/* Module List — 1 per row */}
      <section className="space-y-8">
        {MODULES.map((mod, index) => {
          const Icon = mod.icon;
          return (
            <Link
              key={mod.to}
              to={mod.to}
              className={`group flex flex-col w-full h-auto sm:h-80 border-2 border-[#1A1715] rounded-none overflow-hidden transition-colors duration-150 ${
                index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
              }`}
              data-testid={`hub-module-${mod.label.toLowerCase().replace(/\s+/g, "-")}`}
              aria-label={`Go to ${mod.label}`}
            >
              {/* ── Content side (50%) ── */}
              <div
                className={`relative flex flex-col justify-between p-6 bg-gradient-to-br ${mod.accent} w-full sm:w-1/2 sm:h-full overflow-hidden`}
              >
                {/* Card body wrapper */}
                <div className="flex flex-col justify-between flex-grow overflow-hidden">
                  <div>
                    {/* Top row: icon + badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-none border border-[#1A1715] flex items-center justify-center ${mod.iconBg} shadow-sm flex-shrink-0`}
                        >
                          <Icon size={14} strokeWidth={1.5} className={mod.iconColor} />
                        </div>
                        <span
                          className={`text-[9px] font-bold uppercase tracking-widest font-work-sans ${mod.dark ? "text-amber-400" : "text-cafe-muted"}`}
                        >
                          Module {index + 1}
                        </span>
                      </div>
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border border-[#1A1715] rounded-none font-work-sans ${mod.badgeColor}`}
                      >
                        {mod.badge}
                      </span>
                    </div>

                    {/* Text content */}
                    <div className="space-y-1">
                      <p
                        className={`text-[9px] uppercase tracking-[0.18em] font-semibold font-work-sans ${mod.dark ? "text-amber-400" : "text-cafe-primary"}`}
                      >
                        {mod.sublabel}
                      </p>
                      <h2
                        className={`text-xl sm:text-2xl font-medium font-outfit leading-snug line-clamp-1 ${mod.dark ? "text-white" : "text-cafe-heading"}`}
                      >
                        {mod.label}
                      </h2>
                      <p
                        className={`text-xs leading-relaxed font-work-sans line-clamp-3 ${mod.dark ? "text-white/65" : "text-cafe-body"}`}
                      >
                        {mod.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom EXPLORE bar inside content column */}
                <div className={`mt-4 border-t border-[#1A1715] -mx-6 -mb-6 py-2.5 text-center text-[10px] font-mono uppercase tracking-[0.25em] transition-colors duration-150 ${
                  mod.dark
                    ? "bg-[#1A1715] text-amber-400 group-hover:bg-amber-400 group-hover:text-[#1A1715]"
                    : "bg-transparent text-cafe-primary group-hover:bg-[#1A1715] group-hover:text-[#F5F2EB]"
                }`}>
                  Explore module →
                </div>
              </div>

              {/* ── Image side (50%) ── */}
              <div className={`relative w-full sm:w-1/2 flex-shrink-0 overflow-hidden h-48 sm:h-full border-t-2 sm:border-t-0 ${index % 2 === 0 ? "sm:border-l-2" : "sm:border-r-2"} border-[#1A1715]`}>
                <img
                  src={mod.imageUrl}
                  alt={mod.imageAlt}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
