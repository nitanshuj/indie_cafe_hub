import { Link } from "@tanstack/react-router";
import { Wifi, Clock, MapPin, Layers } from "lucide-react";
import type { Cafe } from "@/lib/cafes";

type Props = {
  cafe: Cafe;
  className?: string;
  imageHeightClass?: string;
  to?: string;
};

export function CafeCard({ cafe, className = "", imageHeightClass = "h-64", to }: Props) {
  const isWifiAvailable = !!cafe.wifi;
  const isPlugsAvailable = !!cafe.wifi; // Let's infer some plugs availability metrics dynamically for laboratory aesthetic
  const plugsText = isPlugsAvailable ? "AVAILABLE" : "N/A";
  const speedText = isWifiAvailable ? "58 MBPS" : "OFFLINE";

  const cardContent = (
    <div className="flex flex-col h-full">
      <div className={`overflow-hidden ${imageHeightClass} border-b border-cafe-border relative`}>
        <img
          src={cafe.image}
          alt={`Interior of ${cafe.name}`}
          loading="lazy"
          className="w-full h-full object-cover grayscale contrast-125 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
        />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest border ${
            isWifiAvailable
              ? "bg-[#00F0FF]/15 border-[#00F0FF] text-[#00F0FF]"
              : "bg-cafe-surface border-cafe-border text-cafe-muted"
          }`}>
            {isWifiAvailable ? "ONLINE" : "OFFLINE"}
          </span>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
            <span className="text-[10px] text-cafe-primary font-mono tracking-widest uppercase flex items-center gap-1">
              <Layers size={10} /> NODE_ID: 0{cafe.id}
            </span>
          </div>
          <h3 className="font-outfit text-xl font-bold text-cafe-heading tracking-widest uppercase">
            {cafe.name}
          </h3>
          <div className="mt-1 flex items-center gap-3 text-[10px] text-cafe-muted font-mono uppercase tracking-wider">
            <span className="inline-flex items-center gap-1">
              <MapPin size={10} />
              {cafe.neighborhood}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock size={10} />
              {cafe.hours}
            </span>
          </div>
          <p className="mt-4 text-cafe-body font-mono leading-relaxed text-xs lowercase">
            {cafe.blurb}
          </p>
        </div>

        <div className="mt-6 border-t border-cafe-border/50 pt-4 space-y-1.5 font-mono text-[10px] uppercase tracking-wider text-cafe-muted">
          <div className="flex justify-between">
            <span>WIFI</span>
            <span className="text-[#00F0FF] font-bold">// {speedText}</span>
          </div>
          <div className="flex justify-between">
            <span>PLUGS</span>
            <span className="text-[#FFC857] font-bold">// {plugsText}</span>
          </div>
          <div className="flex justify-between">
            <span>NOISE</span>
            <span className="text-cafe-heading">// QUIET</span>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-cafe-border/30 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            {cafe.tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className="text-[9px] text-cafe-muted border border-cafe-border px-1.5 py-0.5 font-mono uppercase tracking-widest"
              >
                {t}
              </span>
            ))}
          </div>
          <span className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-widest group-hover:translate-x-1 transition-transform">
            ENTER →
          </span>
        </div>
      </div>
    </div>
  );

  const finalLinkProps = {
    to: to || "/cafes/$cafeId",
    params: to ? undefined : { cafeId: cafe.id },
    "data-testid": `cafe-card-link-${cafe.id}`,
    className: `group block bg-[#1A1D24] border border-[#2A2E37] rounded-none overflow-hidden transition-all duration-300 hover:border-[#00F0FF] hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] ${className}`,
  };

  return <Link {...(finalLinkProps as any)}>{cardContent}</Link>;
}
