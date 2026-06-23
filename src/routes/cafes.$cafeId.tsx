import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MapPin, Clock, Wifi, ArrowLeft, X, ZoomIn, UserCheck } from "lucide-react";
import { Header, Footer } from "@/components/site-chrome";
import { CommentsSection } from "@/components/comments-section";
import { fetchCafeByIdOrSlug } from "@/lib/cafes";
import { getDeliveryStrategy } from "@/lib/cache";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/cafes/$cafeId")({
  loader: async ({ params }) => {
    const cafe = await fetchCafeByIdOrSlug(params.cafeId);
    if (!cafe) throw notFound();
    return { cafe };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.cafe.name} — Indie Coffee Hub` },
          { name: "description", content: loaderData.cafe.blurb },
          { property: "og:title", content: loaderData.cafe.name },
          { property: "og:description", content: loaderData.cafe.blurb },
          { property: "og:image", content: loaderData.cafe.image },
        ]
      : [],
  }),
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-cafe-bg grid place-items-center px-6">
      <p className="text-[#6B5C58] font-work-sans">Something went wrong: {error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen bg-cafe-bg">
      <Header />
      <div className="max-w-md mx-auto px-6 py-32 text-center">
        <h1 className="text-3xl font-outfit text-[#2D2422]">Cafe not found</h1>
        <p className="mt-3 text-[#6B5C58] font-work-sans">It may have closed or moved.</p>
        <Link
          to="/directory"
          className="mt-6 inline-flex bg-[#E67E6B] text-white px-5 py-2.5 rounded-xl font-work-sans font-medium"
        >
          Back to directory
        </Link>
      </div>
      <Footer />
    </div>
  ),
  component: CafeDetail,
});

function CafeDetail() {
  const { user } = useAuth();
  const { cafe: initialCafe } = Route.useLoaderData();
  const [cafe, setCafe] = useState(initialCafe);
  const [strategy, setStrategy] = useState("dynamic");
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const reloadData = async () => {
    const fresh = await fetchCafeByIdOrSlug(cafe.id);
    if (fresh) {
      setCafe(fresh);
    }
    setStrategy(getDeliveryStrategy());
  };

  useEffect(() => {
    setStrategy(getDeliveryStrategy());
    window.addEventListener("delivery-strategy-change", reloadData);
    window.addEventListener("isr-cache-updated", reloadData);
    return () => {
      window.removeEventListener("delivery-strategy-change", reloadData);
      window.removeEventListener("isr-cache-updated", reloadData);
    };
  }, [cafe.id]);

  // Escape key closes Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-cafe-bg">
      <Header />
      
      {/* Lightbox Zoom Modal */}
      {activeImage && (
        <div 
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
        >
          <button 
            onClick={() => setActiveImage(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X size={24} />
          </button>
          <img
            src={activeImage}
            alt="Enlarged view"
            className="max-w-full max-h-[90vh] rounded-2xl object-contain shadow-2xl select-none animate-scale-up"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
          />
        </div>
      )}

      <article className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
          <Link
            to="/directory"
            className="inline-flex items-center gap-2 text-sm text-[#6B5C58] hover:text-[#2D2422] font-work-sans"
            data-testid="cafe-back-link"
          >
            <ArrowLeft size={14} strokeWidth={1.5} /> Back to directory
          </Link>

          {user && user.isAdmin && (
            <div className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-medium font-work-sans shadow-sm transition-all ${
              strategy === "isr"
                ? "bg-purple-50 border-purple-200 text-purple-700"
                : "bg-emerald-50 border-emerald-200 text-emerald-700"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${strategy === "isr" ? "bg-purple-500 animate-pulse" : "bg-emerald-500 animate-ping"}`} />
              {strategy === "isr" ? "Static Cache (ISR Mode)" : "Live SSR Data (Dynamic Mode)"}
            </div>
          )}
        </div>

        {/* Cover Photo */}
        <div 
          onClick={() => setActiveImage(cafe.image)}
          className="rounded-[2rem] overflow-hidden border border-[#F5EBE9] bg-white shadow-sm cursor-zoom-in group relative"
        >
          <img
            src={cafe.image}
            alt={`Interior of ${cafe.name}`}
            className="w-full h-64 sm:h-[420px] object-cover transition-transform duration-500 group-hover:scale-[1.01]"
          />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-black/60 text-white text-xs px-3.5 py-2 rounded-xl backdrop-blur-sm inline-flex items-center gap-1.5 font-work-sans font-medium">
              <ZoomIn size={14} /> Zoom Cover Image
            </span>
          </div>
        </div>

        <header className="mt-10">
          <div className="flex items-center gap-2 flex-wrap mb-4">
            {cafe.wifi && (
              <span className="bg-cafe-primary-light text-cafe-primary rounded-full px-3 py-1 text-xs font-medium font-work-sans inline-flex items-center gap-1">
                <Wifi size={12} strokeWidth={1.5} /> WiFi
              </span>
            )}
          </div>
          <h1 className="text-5xl tracking-tight font-light text-[#2D2422] font-outfit">
            {cafe.name}
          </h1>
          <div className="mt-3 flex items-center gap-1.5 text-sm text-[#A3938F] font-work-sans">
            <MapPin size={14} strokeWidth={1.5} />
            <span>{cafe.neighborhood}</span>
          </div>
          {/* Opening Hours – grouped */}
          <div className="mt-2 text-sm text-[#A3938F] font-work-sans">
            {(() => {
              const oph = cafe.opening_hours as any;
              const weekdayFallback = oph?.weekday || oph?.mon_fri || null;

              if (oph) {
                const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday"];
                const weekdayValues = weekdays.map((d) => oph[d] ?? weekdayFallback);
                const allSame =
                  weekdayValues.every((v) => v) &&
                  weekdayValues.every((v) => v === weekdayValues[0]);

                const rows: { day: string; value: string }[] = [];
                if (allSame && weekdayValues[0]) {
                  rows.push({ day: "Monday – Friday", value: weekdayValues[0] });
                } else {
                  const labels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
                  weekdays.forEach((d, i) => {
                    const v = oph[d] ?? weekdayFallback;
                    if (v) rows.push({ day: labels[i], value: v });
                  });
                }
                if (oph.saturday) rows.push({ day: "Saturday", value: oph.saturday });
                if (oph.sunday)   rows.push({ day: "Sunday",   value: oph.sunday });

                if (rows.length > 0) {
                  return (
                    <div className="divide-y divide-[#F5EBE9] mt-1">
                      {rows.map(({ day, value }) => (
                        <div key={day} className="flex items-center justify-between py-1.5">
                          <span className="inline-flex items-center gap-1.5">
                            {day === rows[0].day && <Clock size={14} strokeWidth={1.5} />}
                            {day !== rows[0].day && <span className="w-[14px]" />}
                            {day}
                          </span>
                          <span className={`font-semibold ${
                            String(value).toLowerCase() === "closed" ? "text-red-500" : "text-[#2D2422]"
                          }`}>{value}</span>
                        </div>
                      ))}
                    </div>
                  );
                }
              }

              // Fallback to plain hours string
              return (
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={14} strokeWidth={1.5} />
                  {cafe.hours}
                </span>
              );
            })()}
          </div>
          {cafe.created_by_name && (
            <div className="mt-2 inline-flex items-center gap-1.5 bg-cafe-bg border border-cafe-border rounded-full px-3 py-1">
              <UserCheck size={12} className="text-[#E67E6B]" />
              <span className="text-[11px] font-work-sans text-[#6B5C58]">
                Listed by <span className="font-semibold text-[#2D2422]">{cafe.created_by_name}</span>
              </span>
            </div>
          )}
          <p className="mt-6 text-lg text-[#6B5C58] font-work-sans leading-relaxed max-w-2xl">
            {cafe.blurb}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {cafe.tags.map((t: string) => (
              <span
                key={t}
                className="text-xs text-[#6B5C58] border border-[#F5EBE9] rounded-full px-3 py-1 font-work-sans"
              >
                {t}
              </span>
            ))}
          </div>
        </header>

        {/* Gallery Section */}
        {cafe.gallery && cafe.gallery.length > 0 && (
          <section className="mt-12 border-t border-[#F5EBE9] pt-10">
            <h3 className="text-xl font-outfit text-[#2D2422] mb-6">Gallery</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {cafe.gallery.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveImage(img)}
                  className="rounded-2xl overflow-hidden border border-[#F5EBE9] bg-white aspect-square group relative cursor-zoom-in shadow-sm"
                >
                  <img
                    src={img}
                    alt={`Gallery ${idx + 1} of ${cafe.name}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-black/60 text-white text-[10px] px-2.5 py-1.5 rounded-lg backdrop-blur-sm inline-flex items-center gap-1 font-work-sans">
                      <ZoomIn size={10} /> View Large
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <CommentsSection cafeId={cafe.dbId} />
      </article>
      <Footer />
    </div>
  );
}
