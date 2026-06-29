import { Link } from "@tanstack/react-router";
import { Wifi, Clock, MapPin, Globe, Plug, Wind } from "lucide-react";
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

export function DiptychCard({ cafe, index, className = "" }: Props) {
  const displayImage = cafe.image && cafe.image.trim() !== "" ? cafe.image : testImages[index % 3];
  const isEven = index % 2 === 0;

  const cardContent = (
    <>
      {/* ── LEFT HALF: Full-bleed image ── */}
      <div className={`w-full md:w-1/2 overflow-hidden border-b-2 md:border-b-0 ${isEven ? "md:border-r-2" : "md:border-l-2"} border-[#1A1715] h-64 md:h-full`}>
        <img
          src={displayImage}
          alt={`Interior of ${cafe.name}`}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </div>

      {/* ── RIGHT HALF: Editorial Typographic layout ── */}
      <div className="w-full md:w-1/2 flex flex-col justify-between bg-cafe-surface md:h-full relative">
        {/* Card body */}
        <div className="flex flex-col justify-between p-6 flex-grow overflow-hidden">
          <div>
            {/* Neighborhood in tiny caps */}
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#1A1715]/60 mb-2">
              // {cafe.neighborhood}
            </p>

            {/* Cafe name - 3xl bold, uppercase, tracking-tight */}
            <h3 className="font-space-grotesk text-2xl sm:text-3xl font-black text-[#1A1715] tracking-tight leading-[1.1] uppercase line-clamp-2">
              {cafe.name}
            </h3>

            {/* Location + Hours in monospace styling */}
            <div className="mt-4 space-y-1.5 text-[9px] text-[#1A1715]/65 font-mono uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <MapPin size={10} strokeWidth={1.5} />
                <span>{cafe.neighborhood}</span>
                <span className="text-[#1A1715]/30">|</span>
                <Clock size={10} strokeWidth={1.5} />
                <span>{cafe.hours}</span>
              </div>
              {(cafe.city_name || cafe.country_name) && (
                <div className="flex items-center gap-1.5">
                  <Globe size={10} strokeWidth={1.5} />
                  <span>{[cafe.city_name, cafe.country_name].filter(Boolean).join(", ")}</span>
                </div>
              )}
            </div>

            {/* Ruled-line list of amenity details */}
            <div className="mt-5 border-t border-[#1A1715]/10">
              {/* WiFi Line */}
              <div className="flex items-center justify-between py-2 border-b border-[#1A1715]/10 text-[9px] font-mono uppercase tracking-widest">
                <span className="text-[#1A1715]/60 flex items-center gap-1.5">
                  <Wifi size={10} strokeWidth={1.5} /> Connection status
                </span>
                <span className="font-bold text-[#1A1715]">
                  {cafe.wifi ? "HIGH-SPEED WIFI" : "NO INTERNET"}
                </span>
              </div>

              {/* Power Plugs Line */}
              <div className="flex items-center justify-between py-2 border-b border-[#1A1715]/10 text-[9px] font-mono uppercase tracking-widest">
                <span className="text-[#1A1715]/60 flex items-center gap-1.5">
                  <Plug size={10} strokeWidth={1.5} /> Power outlets
                </span>
                <span className="font-bold text-[#1A1715]">
                  {cafe.has_plug_points ? "AVAILABLE" : "RESTRICTED"}
                </span>
              </div>

              {/* Air Conditioning Line */}
              <div className="flex items-center justify-between py-2 border-b border-[#1A1715]/10 text-[9px] font-mono uppercase tracking-widest">
                <span className="text-[#1A1715]/60 flex items-center gap-1.5">
                  <Wind size={10} strokeWidth={1.5} /> Climate control
                </span>
                <span className="font-bold text-[#1A1715]">
                  {cafe.has_ac ? "AIR CONDITIONED" : "NATURAL AIR"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILS bar */}
        <div className="border-t-2 border-[#1A1715] py-3 text-center text-[10px] font-mono uppercase tracking-[0.2em] text-[#1A1715] bg-transparent group-hover:bg-[#1A1715] group-hover:text-[#F5F2EB] transition-colors duration-150">
          Details →
        </div>
      </div>
    </>
  );

  const wrapperClass = `group flex flex-col md:flex-row w-full h-auto md:h-80 border-2 border-[#1A1715] bg-transparent rounded-none overflow-hidden transition-colors duration-150 ${
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
