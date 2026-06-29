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

export function IndexCard({ cafe, index, className = "" }: Props) {
  const displayImage = cafe.image && cafe.image.trim() !== "" ? cafe.image : testImages[index % 3];
  const bgGradient = bgGradients[index % 6];
  const isEven = index % 2 === 0;

  const cardContent = (
    <>
      {/* Tab marker on top border (folder/file tab style) */}
      <div 
        className={`absolute -top-7 h-7 px-4 border-2 border-b-0 border-[#1A1715] bg-[#F5F2EB] font-mono text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 select-none ${
          isEven ? "left-6" : "right-6"
        }`}
        style={{
          clipPath: "polygon(0 100%, 8px 0, calc(100% - 8px) 0, 100% 100%)"
        }}
      >
        <span className="text-[#1A1715]/40">// FILE:</span>
        <span className="text-[#1A1715]">NO. {String(index + 1).padStart(2, "0")}</span>
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

      {/* Text container — 50% width on desktop, styled like lined notebook/index card */}
      <div className={`w-full md:w-1/2 flex flex-col justify-between bg-gradient-to-br ${bgGradient} md:h-full relative overflow-hidden`}>
        {/* Lined notebook overlay style (subtle grid/lines background) */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]" 
             style={{ backgroundImage: "linear-gradient(#1A1715 1px, transparent 1px)", backgroundSize: "100% 24px" }} 
        />

        {/* Dog-eared corner visual effect */}
        <div 
          className="absolute top-0 right-0 w-8 h-8 border-b-2 border-l-2 border-[#1A1715] bg-[#F5F2EB] pointer-events-none transition-transform group-hover:scale-105"
          style={{
            clipPath: "polygon(100% 0, 0 0, 0 100%)",
            transformOrigin: "top right"
          }}
        />

        {/* Card body */}
        <div className="flex flex-col justify-between p-6 flex-grow overflow-hidden relative">
          
          {/* Red margin line on the left side of contents */}
          <div className="absolute left-[18px] top-0 bottom-0 w-[1px] bg-red-400 opacity-60" />

          {/* Content padded to the right of red margin line */}
          <div className="pl-4">
            {/* Badges row */}
            <div className="flex items-center gap-2 flex-wrap mb-2">
              {cafe.wifi && (
                <span className="rounded-none border border-[#1A1715]/40 bg-transparent text-[#1A1715]/75 font-mono text-[8px] uppercase tracking-widest px-1.5 py-0.5 inline-flex items-center gap-1">
                  <Wifi size={8} strokeWidth={1.5} /> WIFI
                </span>
              )}
            </div>

            {/* Cafe name — Handwritten style with rotation */}
            <h3 className="font-handwritten text-3xl font-bold text-[#1A1715] tracking-wide leading-tight line-clamp-1 py-1 transform -rotate-1 origin-left">
              {cafe.name}
            </h3>

            {/* Location + Hours — monospace data style */}
            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[9px] text-[#1A1715]/60 font-mono uppercase tracking-wider">
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
          <div className="mt-4 pl-4 flex flex-wrap gap-1.5 overflow-hidden">
            {cafe.tags.map((t) => (
              <span
                key={t}
                className="text-[8px] text-[#1A1715]/60 border border-[#1A1715]/20 rounded-none px-1.5 py-0.5 font-mono uppercase tracking-wider"
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

  const wrapperClass = `group flex flex-col md:flex-row w-full h-auto md:h-80 border-2 border-[#1A1715] bg-transparent rounded-none overflow-visible transition-colors duration-150 relative mt-7 ${
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
