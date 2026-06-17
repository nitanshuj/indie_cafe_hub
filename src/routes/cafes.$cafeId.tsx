import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MapPin, Clock, Wifi, ArrowLeft } from "lucide-react";
import { Header, Footer } from "@/components/site-chrome";
import { CommentsSection } from "@/components/comments-section";
import { cafes } from "@/lib/cafes";

export const Route = createFileRoute("/cafes/$cafeId")({
  loader: ({ params }) => {
    const cafe = cafes.find((c) => c.id === params.cafeId);
    if (!cafe) throw notFound();
    return { cafe };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.cafe.name} — Indie Cafe Hub` },
          { name: "description", content: loaderData.cafe.blurb },
          { property: "og:title", content: loaderData.cafe.name },
          { property: "og:description", content: loaderData.cafe.blurb },
          { property: "og:image", content: loaderData.cafe.image },
        ]
      : [],
  }),
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-[#FFF7F5] grid place-items-center px-6">
      <p className="text-[#6B5C58] font-work-sans">Something went wrong: {error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen bg-[#FFF7F5]">
      <Header />
      <div className="max-w-md mx-auto px-6 py-32 text-center">
        <h1 className="text-3xl font-outfit text-[#2D2422]">Cafe not found</h1>
        <p className="mt-3 text-[#6B5C58] font-work-sans">It may have closed or moved.</p>
        <Link to="/directory" className="mt-6 inline-flex bg-[#E67E6B] text-white px-5 py-2.5 rounded-xl font-work-sans font-medium">
          Back to directory
        </Link>
      </div>
      <Footer />
    </div>
  ),
  component: CafeDetail,
});

function CafeDetail() {
  const { cafe } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-[#FFF7F5]">
      <Header />
      <article className="max-w-4xl mx-auto px-6 py-12">
        <Link
          to="/directory"
          className="inline-flex items-center gap-2 text-sm text-[#6B5C58] hover:text-[#2D2422] font-work-sans"
          data-testid="cafe-back-link"
        >
          <ArrowLeft size={14} strokeWidth={1.5} /> Back to directory
        </Link>

        <div className="mt-6 rounded-[2rem] overflow-hidden border border-[#F5EBE9] bg-white">
          <img src={cafe.image} alt={`Interior of ${cafe.name}`} className="w-full h-[420px] object-cover" />
        </div>

        <header className="mt-10">
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
          <h1 className="text-5xl tracking-tight font-light text-[#2D2422] font-outfit">{cafe.name}</h1>
          <div className="mt-3 flex items-center gap-4 text-sm text-[#A3938F] font-work-sans">
            <span className="inline-flex items-center gap-1.5"><MapPin size={14} strokeWidth={1.5} />{cafe.neighborhood}</span>
            <span className="inline-flex items-center gap-1.5"><Clock size={14} strokeWidth={1.5} />{cafe.hours}</span>
          </div>
          <p className="mt-6 text-lg text-[#6B5C58] font-work-sans leading-relaxed max-w-2xl">{cafe.blurb}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {cafe.tags.map((t: string) => (
              <span key={t} className="text-xs text-[#6B5C58] border border-[#F5EBE9] rounded-full px-3 py-1 font-work-sans">
                {t}
              </span>
            ))}
          </div>
        </header>

        <CommentsSection cafeId={cafe.id} />
      </article>
      <Footer />
    </div>
  );
}
