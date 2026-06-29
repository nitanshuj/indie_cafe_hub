import { Link } from "@tanstack/react-router";
import { Wifi, Clock, MapPin, Globe } from "lucide-react";
import type { Cafe } from "@/lib/cafes";

const testImages = [
  "https://res.cloudinary.com/daon1coiv/image/upload/v1782757916/hario_v60_cover_thgzej.png",
  "https://res.cloudinary.com/daon1coiv/image/upload/v1782757916/espress_machine_cover_a7gurc.png",
  "https://res.cloudinary.com/daon1coiv/image/upload/v1782757916/moka_pot_cover_c1co7p.png",
];

type Props = {
  cafe: Cafe;
  index: number;
  className?: string;
};

export function MagazineCard({ cafe, index, className = "" }: Props) {
  const displayImage = cafe.image && cafe.image.trim() !== "" ? cafe.image : testImages[index % 3];
  
  // Deterministic issue number from index
  const issueNumber = 104 + index;

  return (
    <Link
      to="/cafes/$cafeId"
      params={{ cafeId: cafe.id }}
      data-testid={`cafe-card-link-${cafe.id}`}
      className={`group relative flex flex-col justify-between w-full h-[420px] border-2 border-[#1A1715] bg-[#1A1715] rounded-none overflow-hidden transition-colors duration-150 ${className}`}
    >
      {/* Full-bleed background image */}
      <img
        src={displayImage}
        alt={`Interior of ${cafe.name}`}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
      />

      {/* Dark gradient scrim — bottom-up overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1715] via-[#1A1715]/40 to-transparent" />

      {/* Top row: Issue tag & Featured badge */}
      <div className="relative z-10 flex items-center justify-between p-4 pointer-events-none select-none">
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#F5F2EB] bg-[#1A1715] px-2 py-0.5 border border-[#F5F2EB]/20">
          ISSUE #{issueNumber}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-widest text-[#1A1715] bg-[#F5F2EB] px-2 py-0.5 border-2 border-[#1A1715] font-bold shadow-[2px_2px_0px_#1A1715]">
          FEATURED ★
        </span>
      </div>

      {/* Bottom overlay: Cafe details */}
      <div className="relative z-10 p-6 pt-0 space-y-3">
        {/* Lined category tag */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#F5F2EB]/50">
            // SPECIALTY COFFEE INDEX
          </span>
          <div className="h-[1px] bg-[#F5F2EB]/20 flex-grow" />
        </div>

        {/* Cafe name — Large italic serif font */}
        <h3 className="font-serif-editorial text-3xl sm:text-4xl font-extrabold text-[#F5F2EB] leading-none tracking-tight group-hover:underline decoration-[#F5F2EB]/30 underline-offset-4">
          {cafe.name}
        </h3>

        {/* Monospace location & hours */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-[9px] text-[#F5F2EB]/70 font-mono uppercase tracking-wider">
          <span className="inline-flex items-center gap-1">
            <MapPin size={9} strokeWidth={1.5} className="text-[#F5F2EB]/50" />
            {cafe.neighborhood}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock size={9} strokeWidth={1.5} className="text-[#F5F2EB]/50" />
            {cafe.hours}
          </span>
          {(cafe.city_name || cafe.country_name) && (
            <span className="inline-flex items-center gap-1">
              <Globe size={9} strokeWidth={1.5} className="text-[#F5F2EB]/50" />
              {[cafe.city_name, cafe.country_name].filter(Boolean).join(", ")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
