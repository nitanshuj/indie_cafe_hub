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
    label: "The Menu Decoder",
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
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=900",
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
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=900",
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
      "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=900",
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
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=900",
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
      <section className="space-y-5">
        {MODULES.map((mod, index) => {
          const Icon = mod.icon;
          return (
            <Link
              key={mod.to}
              to={mod.to}
              className={`group relative flex flex-col sm:flex-row items-stretch rounded-2xl overflow-hidden border ${mod.border} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 min-h-[200px] sm:min-h-[220px]`}
              data-testid={`hub-module-${mod.label.toLowerCase().replace(/\s+/g, "-")}`}
              aria-label={`Go to ${mod.label}`}
            >
              {/* ── LEFT: text content ──────────────────────────────── */}
              <div
                className={`relative flex flex-col justify-between p-8 sm:p-10 bg-gradient-to-br ${mod.accent} flex-1 min-w-0`}
              >
                {/* Top row: module number + badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${mod.iconBg} shadow-md flex-shrink-0`}
                    >
                      <Icon size={18} strokeWidth={1.5} className={mod.iconColor} />
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest font-work-sans ${mod.dark ? "text-amber-400" : "text-cafe-muted"}`}
                    >
                      Module {index + 1}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full font-work-sans ${mod.badgeColor}`}
                  >
                    {mod.badge}
                  </span>
                </div>

                {/* Text body */}
                <div className="flex-1 space-y-2 mb-6">
                  <p
                    className={`text-[10px] uppercase tracking-[0.18em] font-semibold font-work-sans ${mod.dark ? "text-amber-400" : "text-cafe-primary"}`}
                  >
                    {mod.sublabel}
                  </p>
                  <h2
                    className={`text-2xl sm:text-3xl font-medium font-outfit leading-snug ${mod.dark ? "text-white" : "text-cafe-heading"}`}
                  >
                    {mod.label}
                  </h2>
                  <p
                    className={`text-sm leading-relaxed font-work-sans max-w-md ${mod.dark ? "text-white/65" : "text-cafe-body"}`}
                  >
                    {mod.description}
                  </p>
                </div>

                {/* CTA */}
                <div
                  className={`inline-flex items-center gap-2 text-sm font-semibold font-work-sans transition-all duration-200 group-hover:gap-3 ${mod.dark ? "text-amber-400" : "text-cafe-primary"}`}
                >
                  Explore module
                  <ArrowRight
                    size={15}
                    strokeWidth={2}
                    className="transition-transform duration-200 group-hover:translate-x-1.5"
                  />
                </div>
              </div>

              {/* ── RIGHT: photo ─────────────────────────────────────── */}
              <div className="relative w-full sm:w-80 lg:w-96 flex-shrink-0 overflow-hidden min-h-[200px] sm:min-h-0">
                <img
                  src={mod.imageUrl}
                  alt={mod.imageAlt}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                {/* Subtle left-edge gradient blend into card bg */}
                <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white/20 to-transparent" />
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
