import { Link } from "@tanstack/react-router";
import { Wifi, Clock, MapPin, Globe } from "lucide-react";
import type { Cafe } from "@/lib/cafes";

const testImages = [
  "https://res.cloudinary.com/daon1coiv/image/upload/v1782757916/hario_v60_cover_thgzej.png",
  "https://res.cloudinary.com/daon1coiv/image/upload/v1782757916/espress_machine_cover_a7gurc.png",
  "https://res.cloudinary.com/daon1coiv/image/upload/v1782757916/moka_pot_cover_c1co7p.png",
];

const bgGradients = [
  "from-[#FFF8F2] to-[#FFE8D0]", // Peach/Apricot
  "from-[#F0F9FF] to-[#DBEAFE]", // Soft ice blue
  "from-[#FFF5F3] to-[#FFE4DE]", // Soft peach/coral red
  "from-[#F5F3FF] to-[#EDE9FE]", // Soft lavender
  "from-[#F0FDF4] to-[#DCFCE7]", // Soft mint/green
  "from-[#F8FAFC] to-[#F1F5F9]", // Cool slate grey
];

type Props = {
  cafe: Cafe;
  index: number;
  className?: string;
};

export function LabelCard({ cafe, index, className = "" }: Props) {
  const displayImage = cafe.image && cafe.image.trim() !== "" ? cafe.image : testImages[index % 3];
  const bgGradient = bgGradients[index % 6];
  const isEven = index % 2 === 0;

  const cardContent = (
    <>
      {/* Small Punched Hole + String Graphic (Top Left Corner of the whole card) */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 z-20 pointer-events-none select-none">
        {/* The loop string */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="transform -rotate-45 opacity-60">
          <path d="M2 12C2 12 8 4 14 12C20 20 22 12 22 12" stroke="#1A1715" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        {/* The hole */}
        <div className="w-3.5 h-3.5 rounded-full bg-[#F5F2EB] border-2 border-[#1A1715]" />
      </div>

      {/* Image container — 50% width on desktop, alternating border */}
      <div className={`w-full md:w-1/2 overflow-hidden border-b-2 md:border-b-0 ${isEven ? "md:border-r-2" : "md:border-l-2"} border-[#1A1715] h-64 md:h-full`}>
        <img
          src={displayImage}
          alt={`Interior of ${cafe.name}`}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </div>

      {/* Text container — 50% width on desktop, flex column to keep Details at bottom */}
      <div className={`w-full md:w-1/2 flex flex-col justify-between bg-gradient-to-br ${bgGradient} md:h-full relative overflow-hidden`}>
        {/* Kraft-style card body */}
        <div className="flex flex-col justify-between p-6 flex-grow overflow-hidden relative">
          
          <div className="pt-2">
            {/* Top Tag Header Row */}
            <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
              <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#1A1715]/40 select-none">
                [ REGISTRY ID: #{1000 + index} ]
              </span>
              {cafe.wifi && (
                <span className="rounded-none border border-[#1A1715] bg-transparent text-[#1A1715] font-mono text-[8px] uppercase tracking-widest px-1.5 py-0.5 inline-flex items-center gap-1">
                  <Wifi size={8} strokeWidth={1.5} /> WIFI
                </span>
              )}
            </div>

            {/* Cafe name — Rubber Stamp Style Box */}
            <div className="inline-block transform -rotate-1.5 origin-left mb-3">
              <h3 className="font-space-grotesk text-lg font-black uppercase text-[#1A1715] tracking-wide border-2 border-[#1A1715] px-3 py-1 bg-[#F5F2EB]/40 shadow-[1px_1px_0px_#1A1715]">
                {cafe.name}
              </h3>
            </div>

            {/* Location + Hours — monospace data style */}
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[9px] text-[#1A1715]/60 font-mono uppercase tracking-wider">
              <span className="inline-flex items-center gap-1">
                <MapPin size={9} strokeWidth={1.5} />
                {cafe.neighborhood}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock size={9} strokeWidth={1.5} />
                {cafe.hours}
              </span>
              {(cafe.city_name || cafe.country_name) && (
                <span className="inline-flex items-center gap-1">
                  <Globe size={9} strokeWidth={1.5} />
                  {[cafe.city_name, cafe.country_name].filter(Boolean).join(", ")}
                </span>
              )}
            </div>

            {/* Blurb — clamped to 3 lines */}
            <p className="mt-3 text-[#3A3532] font-sans leading-relaxed text-xs line-clamp-3">{cafe.blurb}</p>
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-1.5 overflow-hidden">
            {cafe.tags.map((t) => (
              <span
                key={t}
                className="text-[8px] text-[#1A1715]/60 border border-[#1A1715]/20 rounded-none px-1.5 py-0.5 font-mono uppercase tracking-wider bg-[#F5F2EB]/20"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* DETAILS bar */}
        <div className="border-t-2 border-[#1A1715] py-3 text-center text-[10px] font-mono uppercase tracking-[0.2em] text-[#1A1715] bg-transparent group-hover:bg-[#1A1715] group-hover:text-[#F5F2EB] transition-colors duration-150 relative z-10">
          Details →
        </div>
      </div>
    </>
  );

  const wrapperClass = `group flex flex-col md:flex-row w-full h-auto md:h-80 border-2 border-[#1A1715] bg-transparent rounded-none overflow-hidden transition-colors duration-150 relative ${
    isEven ? "md:flex-row" : "md:flex-row-reverse"
  } ${className}`;

  return (
    <Link
      to="/cafes/$cafeId"
      params={{ cafeId: cafe.id }}
      data-testid={`cafe-card-link-${cafe.id}`}
      className={wrapperClass}
    >
      {cardContent}
    </Link>
  );
}
