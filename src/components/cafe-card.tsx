import { Link } from "@tanstack/react-router";
import { Wifi, Clock, MapPin, Globe } from "lucide-react";
import type { Cafe } from "@/lib/cafes";

type Props = {
  cafe: Cafe;
  className?: string;
  to?: string;
  index: number;
};
export function CafeCard({ cafe, className = "", to, index }: Props) {
  const testImages = [
    "https://res.cloudinary.com/daon1coiv/image/upload/v1782757916/hario_v60_cover_thgzej.png",
    "https://res.cloudinary.com/daon1coiv/image/upload/v1782757916/espress_machine_cover_a7gurc.png",
    "https://res.cloudinary.com/daon1coiv/image/upload/v1782757916/moka_pot_cover_c1co7p.png",
  ];
  const displayImage = cafe.image && cafe.image.trim() !== "" ? cafe.image : testImages[index % 3];
  const bgGradients = [
    "from-[#FFF8F2] to-[#FFE8D0]", // Peach/Apricot
    "from-[#F0F9FF] to-[#DBEAFE]", // Soft ice blue
    "from-[#FFF5F3] to-[#FFE4DE]", // Soft peach/coral red
    "from-[#F5F3FF] to-[#EDE9FE]", // Soft lavender
    "from-[#F0FDF4] to-[#DCFCE7]", // Soft mint/green
    "from-[#F8FAFC] to-[#F1F5F9]", // Cool slate grey
  ];
  const bgGradient = bgGradients[index % 6];

  const cardContent = (
    <>
      {/* Image container — 50% width on desktop, alternating border */}
      <div className={`w-full md:w-1/2 overflow-hidden border-b-2 md:border-b-0 ${index % 2 === 0 ? "md:border-r-2" : "md:border-l-2"} border-[#1A1715] h-64 md:h-full`}>
        <img
          src={displayImage}
          alt={`Interior of ${cafe.name}`}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </div>

      {/* Text container — 50% width on desktop, flex column to keep Details at bottom */}
      <div className={`w-full md:w-1/2 flex flex-col justify-between bg-gradient-to-br ${bgGradient} md:h-full`}>
        {/* Card body */}
        <div className="flex flex-col justify-between p-6 flex-grow overflow-hidden">
          <div>
            {/* Badges row */}
            <div className="flex items-center gap-2 flex-wrap mb-4">
              {cafe.wifi && (
                <span className="rounded-none border border-[#1A1715] bg-transparent text-[#1A1715] font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 inline-flex items-center gap-1">
                  <Wifi size={10} strokeWidth={1.5} /> WIFI
                </span>
              )}
            </div>

            {/* Cafe name */}
            <h3 className="font-space-grotesk text-xl font-medium text-[#1A1715] tracking-tight leading-tight line-clamp-1">
              {cafe.name}
            </h3>

            {/* Location + Hours — monospace data style */}
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-[#1A1715]/50 font-mono uppercase tracking-wider">
              <span className="inline-flex items-center gap-1">
                <MapPin size={10} strokeWidth={1.5} />
                {cafe.neighborhood}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock size={10} strokeWidth={1.5} />
                {cafe.hours}
              </span>
              {(cafe.city_name || cafe.country_name) && (
                <span className="inline-flex items-center gap-1">
                  <Globe size={10} strokeWidth={1.5} />
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
                className="text-[9px] text-[#1A1715] border border-[#1A1715] rounded-none px-2 py-0.5 font-mono uppercase tracking-wider"
              >
                {t}
              </span>
            ))}
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
    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
  } ${className}`;

  if (to) {
    return (
      <Link
        to={to}
        data-testid={`cafe-card-link-${cafe.id}`}
        className={wrapperClass}
      >
        {cardContent}
      </Link>
    );
  }

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
