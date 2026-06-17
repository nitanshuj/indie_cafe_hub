import { Link } from "@tanstack/react-router";
import { Wifi, Clock, MapPin } from "lucide-react";
import type { Cafe } from "@/lib/cafes";

type Props = {
  cafe: Cafe;
  className?: string;
  imageHeightClass?: string;
};

export function CafeCard({ cafe, className = "", imageHeightClass = "h-64" }: Props) {
  return (
    <Link
      to="/cafes/$cafeId"
      params={{ cafeId: cafe.id }}
      data-testid={`cafe-card-link-${cafe.id}`}
      className={`group block bg-white border border-[#F5EBE9] shadow-[0_8px_30px_rgba(230,126,107,0.04)] rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-[0_12px_40px_rgba(230,126,107,0.08)] hover:-translate-y-1 ${className}`}
    >
      <div className={`overflow-hidden ${imageHeightClass}`}>
        <img
          src={cafe.image}
          alt={`Interior of ${cafe.name}`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {cafe.open && (
            <span className="bg-[#E8F5E9] text-[#2E7D32] rounded-full px-3 py-1 text-xs font-medium font-work-sans">
              Open now
            </span>
          )}
          {cafe.wifi && (
            <span className="bg-[#FDE4DD] text-[#E67E6B] rounded-full px-3 py-1 text-xs font-medium font-work-sans inline-flex items-center gap-1">
              <Wifi size={12} strokeWidth={1.5} /> WiFi
            </span>
          )}
        </div>
        <h3 className="font-outfit text-2xl font-medium text-[#2D2422] tracking-tight">
          {cafe.name}
        </h3>
        <div className="mt-2 flex items-center gap-3 text-xs text-[#A3938F] font-work-sans">
          <span className="inline-flex items-center gap-1"><MapPin size={12} strokeWidth={1.5} />{cafe.neighborhood}</span>
          <span className="inline-flex items-center gap-1"><Clock size={12} strokeWidth={1.5} />{cafe.hours}</span>
        </div>
        <p className="mt-4 text-[#6B5C58] font-work-sans leading-relaxed text-sm">
          {cafe.blurb}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {cafe.tags.map((t) => (
            <span
              key={t}
              className="text-xs text-[#6B5C58] border border-[#F5EBE9] rounded-full px-3 py-1 font-work-sans"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
