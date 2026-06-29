import { Link } from "@tanstack/react-router";
import { Wifi, Clock, MapPin, Globe } from "lucide-react";
import type { Cafe } from "@/lib/cafes";

type Props = {
  cafe: Cafe;
  className?: string;
  to?: string;
};

export function CafeCard({ cafe, className = "", to }: Props) {
  const cardContent = (
    <>
      {/* Image — fixed height so every card's dividing line is at the same pixel */}
      <div className="overflow-hidden border-b-2 border-[#1A1715]">
        <img
          src={cafe.image}
          alt={`Interior of ${cafe.name}`}
          loading="lazy"
          className="w-full h-48 object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </div>

      {/* Card body — row 2 of the internal grid (1fr), grows to fill; DETAILS bar is pinned to row 3 */}
      <div className="flex flex-col justify-between p-4 bg-[#E5E2DA]">
        {/* Badges row */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {cafe.wifi && (
            <span className="rounded-none border border-[#1A1715] bg-transparent text-[#1A1715] font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 inline-flex items-center gap-1">
              <Wifi size={10} strokeWidth={1.5} /> WIFI
            </span>
          )}
        </div>

        {/* Cafe name */}
        <h3 className="font-space-grotesk text-xl font-medium text-[#1A1715] tracking-tight leading-tight">
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

        {/* Blurb — clamped to 3 lines to cap height footprint uniformly */}
        <p className="mt-4 text-[#3A3532] font-sans leading-relaxed text-sm line-clamp-3">{cafe.blurb}</p>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
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

      {/* DETAILS bar — visual element (outer Link handles navigation) */}
      <div className="border-t-2 border-[#1A1715] py-3 text-center text-[10px] font-mono uppercase tracking-[0.2em] text-[#1A1715] bg-[#E5E2DA] group-hover:bg-[#1A1715] group-hover:text-[#F5F2EB] transition-colors duration-150">
        Details →
      </div>
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        data-testid={`cafe-card-link-${cafe.id}`}
        className={`group grid grid-rows-[auto_1fr_auto] bg-[#E5E2DA] border-2 border-[#1A1715] rounded-none overflow-hidden transition-colors duration-150 ${className}`}
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
      className={`group grid grid-rows-[auto_1fr_auto] bg-[#E5E2DA] border-2 border-[#1A1715] rounded-none overflow-hidden transition-colors duration-150 ${className}`}
    >
      {cardContent}
    </Link>
  );
}
