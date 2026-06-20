import { Link } from "@tanstack/react-router";
import { Wifi, Clock, MapPin, Check } from "lucide-react";
import type { Cafe } from "@/lib/cafes";

type Props = {
  cafe: Cafe;
  className?: string;
  imageHeightClass?: string;
  to?: string;
};

export function CafeCard({ cafe, className = "", imageHeightClass = "h-64", to }: Props) {
  const cardContent = (
    <>
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
            <span className="bg-cafe-open-bg text-cafe-open-text rounded-full px-3 py-1 text-xs font-medium font-work-sans inline-flex items-center gap-1">
              <Check size={12} strokeWidth={1.5} /> Open now
            </span>
          )}
          {cafe.wifi && (
            <span className="bg-cafe-primary-light text-cafe-primary rounded-full px-3 py-1 text-xs font-medium font-work-sans inline-flex items-center gap-1">
              <Wifi size={12} strokeWidth={1.5} /> WiFi
            </span>
          )}
        </div>
        <h3 className="font-outfit text-2xl font-medium text-cafe-heading tracking-tight">
          {cafe.name}
        </h3>
        <div className="mt-2 flex items-center gap-3 text-xs text-cafe-muted font-work-sans">
          <span className="inline-flex items-center gap-1">
            <MapPin size={12} strokeWidth={1.5} />
            {cafe.neighborhood}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock size={12} strokeWidth={1.5} />
            {cafe.hours}
          </span>
        </div>
        <p className="mt-4 text-cafe-body font-work-sans leading-relaxed text-sm">{cafe.blurb}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {cafe.tags.map((t) => (
            <span
              key={t}
              className="text-xs text-cafe-body border border-cafe-border rounded-full px-3 py-1 font-work-sans"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        data-testid={`cafe-card-link-${cafe.id}`}
        className={`group block bg-cafe-surface border border-cafe-border shadow-sm rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${className}`}
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
      className={`group block bg-white border border-[#F5EBE9] shadow-[0_8px_30px_rgba(230,126,107,0.04)] rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-[0_12px_40px_rgba(230,126,107,0.08)] hover:-translate-y-1 ${className}`}
    >
      {cardContent}
    </Link>
  );
}
