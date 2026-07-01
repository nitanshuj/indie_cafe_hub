import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MapPin, Clock, Wifi, ArrowLeft, X, ZoomIn, Plug, Snowflake, ShieldCheck, Compass, Info, MessageSquare, UserCheck } from "lucide-react";
import { Header, Footer } from "@/components/site-chrome";
import { CommentsSection } from "@/components/comments-section";
import { fetchCafeByIdOrSlug } from "@/lib/cafes";
import { getDeliveryStrategy } from "@/lib/cache";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/$country/$city/$cafeSlug")({
  loader: async ({ params }) => {
    const cafe = await fetchCafeByIdOrSlug(params.cafeSlug);
    if (!cafe) throw notFound();

    // Verify geographical alignment
    const { data: cityData, error: cityError } = await supabase
      .from("cities")
      .select("*, country:countries(*)")
      .eq("id", cafe.city_id)
      .maybeSingle();

    if (cityError || !cityData) {
      throw notFound();
    }

    if (
      cityData.slug !== params.city ||
      cityData.country?.code?.toLowerCase() !== params.country?.toLowerCase()
    ) {
      throw notFound();
    }

    return { cafe, city: cityData };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.cafe.name} — ${loaderData.city.name} Cafe Hub` },
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
        <p className="mt-3 text-[#6B5C58] font-work-sans">The requested listing does not exist in this city.</p>
        <Link
          to="/directory"
          className="mt-6 inline-flex bg-cafe-primary text-white px-5 py-2.5 rounded-xl font-work-sans font-medium"
        >
          Back to directory
        </Link>
      </div>
      <Footer />
    </div>
  ),
  component: CafeDetailGlobal,
});

function CafeDetailGlobal() {
  const { user } = useAuth();
  const { cafe: initialCafe, city } = Route.useLoaderData();
  const [cafe, setCafe] = useState(initialCafe);
  const [strategy, setStrategy] = useState("dynamic");
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const reloadData = async () => {
    const fresh = await fetchCafeByIdOrSlug(cafe.id);
    if (fresh) {
      setCafe(fresh);
    }
    setStrategy(await getDeliveryStrategy());
  };

  useEffect(() => {
    getDeliveryStrategy().then(setStrategy);
    window.addEventListener("delivery-strategy-change", reloadData);
    window.addEventListener("isr-cache-updated", reloadData);
    return () => {
      window.removeEventListener("delivery-strategy-change", reloadData);
      window.removeEventListener("isr-cache-updated", reloadData);
    };
  }, [cafe.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Noise level emojis & descriptors
  const noiseMetadata = {
    quiet: { emoji: "🤫", label: "Quiet", desc: "Perfect for deep concentration and focus" },
    moderate: { emoji: "☕", label: "Moderate", desc: "Comfortable ambient noise levels" },
    bustling: { emoji: "⚡", label: "Bustling", desc: "Energetic startup or social vibe" },
  };

  const noiseInfo = cafe.noise_level ? noiseMetadata[cafe.noise_level] : null;

  return (
    <div className="min-h-screen bg-cafe-bg">
      <Header />

      {/* JSON-LD Structured Data for Cafe / Coffee Shop */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CafeOrCoffeeShop",
            "name": cafe.name,
            "description": cafe.blurb,
            "image": cafe.image,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": cafe.address || "",
              "addressLocality": city.name,
              "addressCountry": city.country?.name || ""
            },
            "servesCuisine": "Specialty Coffee",
            "openingHours": cafe.hours
          }).replace(/</g, "\\u003c").replace(/>/g, "\\u003e")
        }}
      />

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
            className="max-w-full max-h-[95vh] rounded-2xl object-contain shadow-2xl select-none animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <article className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
          <Link
            to={`/${city.country?.code?.toLowerCase()}/${city.slug}` as any}
            className="inline-flex items-center gap-2 text-sm text-[#6B5C58] hover:text-[#2D2422] font-work-sans"
          >
            <ArrowLeft size={14} strokeWidth={1.5} /> Back to {city.name} list
          </Link>

          {user && user.isAdmin && (
            <div
              className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-medium font-work-sans shadow-sm transition-all ${
                strategy === "isr"
                  ? "bg-purple-50 border-purple-200 text-purple-700"
                  : "bg-emerald-50 border-emerald-200 text-emerald-700"
              }`}
            >
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
            alt={`Cover of ${cafe.name}`}
            className="w-full h-64 sm:h-[450px] object-cover transition-transform duration-500 group-hover:scale-[1.01]"
          />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-black/60 text-white text-xs px-3.5 py-2 rounded-xl backdrop-blur-sm inline-flex items-center gap-1.5 font-work-sans font-medium">
              <ZoomIn size={14} /> Zoom Cover Image
            </span>
          </div>
        </div>

        {/* Cafe Info Body */}
        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {/* Main Content (Left 2 Columns) */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-3 py-1 text-xs font-semibold font-work-sans">
                Active Listing
              </span>
              {cafe.wifi && (
                <span className="bg-cafe-primary-light text-cafe-primary rounded-full px-3 py-1 text-xs font-semibold font-work-sans inline-flex items-center gap-1">
                  <Wifi size={12} /> Fast WiFi
                </span>
              )}
            </div>

            <h1 className="text-4xl sm:text-5xl tracking-tight font-light text-[#2D2422] font-outfit">
              {cafe.name}
            </h1>

            {cafe.specialty_focus && (
              <div className="mt-4 p-4 bg-orange-50 border border-orange-100 rounded-2xl flex gap-3 text-[#2D2422]">
                <ShieldCheck className="text-cafe-primary w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-cafe-primary">Specialty Focus</h4>
                  <p className="text-sm font-medium mt-0.5">{cafe.specialty_focus}</p>
                </div>
              </div>
            )}

            {cafe.created_by_name && (
              <div className="mt-3 inline-flex items-center gap-1.5 bg-cafe-bg border border-cafe-border rounded-full px-3 py-1">
                <UserCheck size={12} className="text-cafe-primary" />
                <span className="text-[11px] font-work-sans text-[#6B5C58]">
                  Listed by <span className="font-semibold text-[#2D2422]">{cafe.created_by_name}</span>
                </span>
              </div>
            )}

            <p className="mt-6 text-base text-[#6B5C58] font-work-sans leading-relaxed">
              {cafe.blurb}
            </p>

            {/* Quick Amenities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-8 border-t border-cafe-border">
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl ${cafe.wifi ? "bg-cafe-bg text-cafe-primary" : "bg-gray-100 text-gray-400"}`}>
                  <Wifi size={18} />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-cafe-muted">Internet access</h4>
                  <p className="text-sm font-semibold text-cafe-heading mt-0.5">{cafe.wifi ? "WiFi Available" : "No WiFi"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl ${cafe.has_plug_points ? "bg-cafe-bg text-cafe-primary" : "bg-gray-100 text-gray-400"}`}>
                  <Plug size={18} />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-cafe-muted">Power Outlets</h4>
                  <p className="text-sm font-semibold text-cafe-heading mt-0.5">{cafe.has_plug_points ? "Abundant Plugs" : "Limited Plugs"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 mt-2">
                <div className={`p-2.5 rounded-xl ${cafe.has_ac ? "bg-cafe-bg text-cafe-primary" : "bg-gray-100 text-gray-400"}`}>
                  <Snowflake size={18} />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-cafe-muted">Climate Control</h4>
                  <p className="text-sm font-semibold text-cafe-heading mt-0.5">{cafe.has_ac ? "Air Conditioned" : "Natural Ventilation"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 mt-2">
                <div className={`p-2.5 rounded-xl ${cafe.is_pet_friendly ? "bg-cafe-bg text-cafe-primary" : "bg-gray-100 text-gray-400"}`}>
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-cafe-muted">Pet Policy</h4>
                  <p className="text-sm font-semibold text-cafe-heading mt-0.5">{cafe.is_pet_friendly ? "Pet Friendly" : "No Pets Allowed"}</p>
                </div>
              </div>
            </div>

            {/* Gallery Section */}
            {cafe.gallery && cafe.gallery.length > 0 && (
              <section className="mt-12 border-t border-cafe-border pt-8">
                <h3 className="text-lg font-semibold font-outfit text-cafe-heading mb-4">Interior & Seating Gallery</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {cafe.gallery.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className="rounded-2xl overflow-hidden border border-cafe-border bg-white aspect-square group relative cursor-zoom-in shadow-sm"
                    >
                      <img
                        src={img}
                        alt={`Gallery ${idx + 1} of ${cafe.name}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-black/60 text-white text-[10px] px-2 py-1.5 rounded-lg backdrop-blur-sm inline-flex items-center gap-1 font-work-sans">
                          <ZoomIn size={10} /> Zoom
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Logistics & Location Panel (Right 1 Column) */}
          <div className="space-y-6">
            {/* Info Card */}
            <div className="bg-white border border-cafe-border rounded-[2rem] p-6 shadow-sm">
              <h3 className="font-outfit font-semibold text-lg text-cafe-heading border-b border-cafe-border pb-3 mb-4 flex items-center gap-2">
                <Info size={18} className="text-cafe-primary" /> Logistics
              </h3>

              <div className="space-y-4 font-work-sans">
                <div>
                  <h4 className="text-[10px] uppercase font-bold tracking-wider text-cafe-muted">Neighborhood</h4>
                  <div className="flex items-center gap-1.5 mt-1 text-sm font-semibold text-cafe-heading">
                    <MapPin size={14} className="text-cafe-primary" />
                    <span>{cafe.neighborhood}, {city.name}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase font-bold tracking-wider text-[#A3938F] mb-2">Opening Hours</h4>
                  {(() => {
                    const oph = cafe.opening_hours as any;
                    const weekdayFallback = oph?.weekday || oph?.mon_fri || null;

                    if (oph) {
                      const monFriValue =
                        oph.mon_fri ??
                        oph.weekday ??
                        oph.monday ??
                        weekdayFallback;

                      // Check if Mon–Fri all share the same hours so we can group them
                      const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday"];
                      const weekdayValues = weekdays.map((d) => oph[d] ?? weekdayFallback);
                      const allSame =
                        weekdayValues.every((v) => v) &&
                        weekdayValues.every((v) => v === weekdayValues[0]);

                      const groupedRows: { day: string; value: string }[] = [];

                      if (allSame && weekdayValues[0]) {
                        groupedRows.push({ day: "Monday – Friday", value: weekdayValues[0] });
                      } else {
                        // Fall back to listing each weekday individually
                        const labels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
                        weekdays.forEach((d, i) => {
                          const v = oph[d] ?? weekdayFallback;
                          if (v) groupedRows.push({ day: labels[i], value: v });
                        });
                      }

                      if (oph.saturday) groupedRows.push({ day: "Saturday", value: oph.saturday });
                      if (oph.sunday)   groupedRows.push({ day: "Sunday",   value: oph.sunday });

                      if (groupedRows.length > 0) {
                        return (
                          <div className="divide-y divide-cafe-border">
                            {groupedRows.map(({ day, value }) => (
                              <div key={day} className="flex items-center justify-between py-1.5">
                                <span className="text-xs font-medium text-cafe-body font-work-sans">{day}</span>
                                <span className={`text-xs font-semibold font-work-sans ${
                                  String(value).toLowerCase() === "closed"
                                    ? "text-red-500"
                                    : "text-cafe-heading"
                                }`}>{value}</span>
                              </div>
                            ))}
                          </div>
                        );
                      }
                    }

                    // Ultimate fallback – plain hours string
                    return (
                      <div className="flex items-center gap-1.5 mt-1 text-sm text-cafe-heading font-semibold">
                        <Clock size={14} className="text-cafe-primary" />
                        <span>{cafe.hours}</span>
                      </div>
                    );
                  })()}
                </div>

                {noiseInfo && (
                  <div>
                    <h4 className="text-[10px] uppercase font-bold tracking-wider text-[#A3938F]">Atmosphere & Noise</h4>
                    <div className="mt-1 text-sm font-semibold text-[#2D2422]">
                      {noiseInfo.emoji} {noiseInfo.label}
                    </div>
                    <p className="text-[10px] text-[#6B5C58] mt-0.5 leading-tight">{noiseInfo.desc}</p>
                  </div>
                )}

                {cafe.address && (
                  <div>
                    <h4 className="text-[10px] uppercase font-bold tracking-wider text-[#A3938F]">Physical Address</h4>
                    <p className="text-xs text-[#6B5C58] mt-1 leading-relaxed">{cafe.address}</p>
                  </div>
                )}

                {cafe.created_by_name && (
                  <div className="pt-3 border-t border-cafe-border">
                    <h4 className="text-[10px] uppercase font-bold tracking-wider text-cafe-muted">Listed By</h4>
                    <div className="flex items-center gap-1.5 mt-1">
                      <UserCheck size={13} className="text-cafe-primary" />
                      <span className="text-xs font-semibold text-cafe-heading">{cafe.created_by_name}</span>
                    </div>
                  </div>
                )}

                {/* Google Maps Redirect Button */}
                {cafe.google_maps_url && (
                  <a
                    href={cafe.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-cafe-primary text-white hover:bg-cafe-primary-hover py-2.5 rounded-xl font-work-sans text-xs font-semibold shadow-sm transition-all"
                  >
                    <Compass size={14} /> Open in Google Maps
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <section className="mt-12 border-t border-cafe-border pt-8">
          <h3 className="text-xl font-outfit text-cafe-heading font-semibold mb-6 flex items-center gap-2">
            <MessageSquare size={18} className="text-cafe-primary" /> Nomad Discussions & Reviews
          </h3>
          <CommentsSection cafeId={cafe.dbId} />
        </section>
      </article>
      <Footer />
    </div>
  );
}
