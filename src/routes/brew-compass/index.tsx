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
import { Header, Footer } from "@/components/site-chrome";

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
  component: BrewSchoolHubPage,
});

const MODULES = [
  {
    to: "/brew-compass/menu-decoder",
    icon: Coffee,
    label: "The Menu Decoder - The Basic Coffees",
    sublabel: "The Basic Coffees",
    description:
      "Decode every drink on the coffee shop menu. Visualize the exact anatomy of each cup — espresso to foam — with an interactive layer-pour animation that shows you what's actually in your glass.",
    accent: "bg-[#1A1D24]",
    border: "border-[#2A2E37] hover:border-[#00F0FF]",
    iconBg: "bg-[#00F0FF]/15 border border-[#00F0FF]/30",
    iconColor: "text-[#00F0FF]",
    badge: "Start Here",
    badgeColor: "bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[#00F0FF]",
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
    accent: "bg-[#1A1D24]",
    border: "border-[#2A2E37] hover:border-[#00F0FF]",
    iconBg: "bg-[#00F0FF]/15 border border-[#00F0FF]/30",
    iconColor: "text-[#00F0FF]",
    badge: "Cool & Refreshing",
    badgeColor: "bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[#00F0FF]",
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
    accent: "bg-[#1A1D24]",
    border: "border-[#2A2E37] hover:border-[#00F0FF]",
    iconBg: "bg-[#00F0FF]/15 border border-[#00F0FF]/30",
    iconColor: "text-[#00F0FF]",
    badge: "Techniques",
    badgeColor: "bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[#00F0FF]",
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
    accent: "bg-[#1A1D24]",
    border: "border-[#2A2E37] hover:border-[#00F0FF]",
    iconBg: "bg-[#00F0FF]/15 border border-[#00F0FF]/30",
    iconColor: "text-[#00F0FF]",
    badge: "World Tour",
    badgeColor: "bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[#00F0FF]",
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
    accent: "bg-[#1A1D24]",
    border: "border-[#2A2E37] hover:border-[#FFC857]",
    iconBg: "bg-[#FFC857]/15 border border-[#FFC857]/30",
    iconColor: "text-[#FFC857]",
    badge: "Premium",
    badgeColor: "bg-[#FFC857]/15 border border-[#FFC857]/30 text-[#FFC857]",
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
    accent: "bg-[#1A1D24]",
    border: "border-[#2A2E37] hover:border-[#00F0FF]",
    iconBg: "bg-[#00F0FF]/15 border border-[#00F0FF]/30",
    iconColor: "text-[#00F0FF]",
    badge: "Interactive",
    badgeColor: "bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[#00F0FF]",
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
    accent: "bg-[#1A1D24]",
    border: "border-[#2A2E37] hover:border-[#00F0FF]",
    iconBg: "bg-[#00F0FF]/15 border border-[#00F0FF]/30",
    iconColor: "text-[#00F0FF]",
    badge: "World Map",
    badgeColor: "bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[#00F0FF]",
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
    accent: "bg-[#1A1D24]",
    border: "border-[#2A2E37] hover:border-[#00F0FF]",
    iconBg: "bg-[#00F0FF]/15 border border-[#00F0FF]/30",
    iconColor: "text-[#00F0FF]",
    badge: "Pairings",
    badgeColor: "bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[#00F0FF]",
    imageUrl:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=900",
    imageAlt: "Pouring milk into coffee",
  },
] as const;

function BrewSchoolHubPage() {
  return (
    <div className="min-h-screen bg-[#0F1115]">
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-12 sm:py-20 space-y-20">
        {/* Hero */}
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1A1D24] border border-[#2A2E37] text-[10px] font-mono uppercase tracking-widest text-[#00F0FF]">
            <Compass size={14} className="animate-spin-slow" />
            <span>BREW_SCHOOL.CONFIG</span>
          </div>
          <h1 className="text-4xl sm:text-5xl tracking-widest font-black text-cafe-heading font-outfit uppercase leading-tight">
            NAVIGATE YOUR COFFEE JOURNEY.
          </h1>
          <p className="text-xs text-cafe-body leading-relaxed font-mono uppercase tracking-wider max-w-2xl mx-auto">
            SYS_LEARN: WHETHER YOU'RE DECODING A MENU FOR THE FIRST TIME OR GRAPHING EXTRACTED SINGLE-ORIGINS — THIS MODULE DIRECTORY FACILITATES TECHNICAL COFFEE APPRECIATION.
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
                className={`group relative flex flex-col sm:flex-row items-stretch rounded-none overflow-hidden border ${mod.border} transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] min-h-[200px] sm:min-h-[220px] bg-[#1A1D24]`}
                data-testid={`hub-module-${mod.label.toLowerCase().replace(/\s+/g, "-")}`}
                aria-label={`Go to ${mod.label}`}
              >
                {/* ── LEFT: text content ──────────────────────────────── */}
                <div
                  className={`relative flex flex-col justify-between p-8 sm:p-10 ${mod.accent} flex-1 min-w-0`}
                >
                  {/* Top row: module number + badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-none flex items-center justify-center ${mod.iconBg}`}
                      >
                        <Icon size={18} className={mod.iconColor} />
                      </div>
                      <span
                        className="text-[10px] font-bold uppercase tracking-widest font-mono text-cafe-muted"
                      >
                        MODULE_0{index + 1}
                      </span>
                    </div>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border font-mono ${mod.badgeColor}`}
                    >
                      {mod.badge}
                    </span>
                  </div>

                  {/* Text body */}
                  <div className="flex-1 space-y-2 mb-6">
                    <p
                      className="text-[9px] uppercase tracking-[0.18em] font-bold font-mono text-cafe-primary"
                    >
                      {mod.sublabel}
                    </p>
                    <h2
                      className="text-xl sm:text-2xl font-bold font-outfit uppercase tracking-wider text-cafe-heading"
                    >
                      {mod.label}
                    </h2>
                    <p
                      className="text-xs leading-relaxed font-mono text-cafe-body lowercase"
                    >
                      {mod.description}
                    </p>
                  </div>

                  {/* CTA */}
                  <div
                    className="inline-flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-widest text-cafe-primary transition-all duration-200 group-hover:gap-3"
                  >
                    DEPLOY MODULE
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-200 group-hover:translate-x-1.5"
                    />
                  </div>
                </div>

                {/* ── RIGHT: photo ─────────────────────────────────────── */}
                <div className="relative w-full sm:w-80 lg:w-96 flex-shrink-0 overflow-hidden min-h-[200px] sm:min-h-0 border-l border-[#2A2E37]">
                  <img
                    src={mod.imageUrl}
                    alt={mod.imageAlt}
                    className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 transition-transform duration-500 ease-out group-hover:scale-105 group-hover:grayscale-0"
                    loading="lazy"
                  />
                </div>
              </Link>
            );
          })}
        </section>
      </main>
      <Footer />
    </div>
  );
}
