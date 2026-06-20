import { createFileRoute, Link } from "@tanstack/react-router";
import { Header, Footer } from "@/components/site-chrome";
import { Compass, Coffee, Users, Heart, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Indie Coffee Hub" },
      {
        name: "description",
        content: "Discover the mission and role of Indie Coffee Hub - connecting remote workers, nomads, and coffee enthusiasts with the best coffee workspaces.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-cafe-bg">
      <Header />

      {/* Hero Header */}
      <section className="bg-cafe-surface/40 border-b border-cafe-border py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex w-16 h-16 rounded-full bg-cafe-primary-light items-center justify-center text-cafe-primary mb-6 shadow-sm">
            <Compass size={32} strokeWidth={1.5} />
          </div>
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-cafe-primary font-work-sans">
            Our Mission
          </p>
          <h1 className="mt-3 text-4xl sm:text-5xl tracking-tight font-light text-cafe-heading font-outfit max-w-2xl mx-auto leading-tight">
            Your global guide to finding the <span className="font-semibold text-cafe-primary">perfect coffee space</span>.
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto px-6 py-16 font-work-sans text-cafe-body">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Card 1 */}
          <div className="bg-cafe-surface border border-cafe-border rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cafe-bg flex items-center justify-center text-cafe-primary">
              <Coffee size={24} strokeWidth={1.5} />
            </div>
            <h3 className="font-outfit text-xl font-semibold text-cafe-heading">Curated Compass</h3>
            <p className="text-sm leading-relaxed">
              <strong className="text-cafe-heading">Indie Cafe Hub</strong> is a curated compass for remote workers, freelancers, and devoted coffee enthusiasts. Whether you need a workspace with reliable Wi-Fi and abundant plug points to power through a deep-focus workday, or a cozy venue with exceptional roasting credentials to simply savor a perfect cup, we connect great people with great spaces.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-cafe-surface border border-cafe-border rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cafe-bg flex items-center justify-center text-cafe-primary">
              <Heart size={24} strokeWidth={1.5} />
            </div>
            <h3 className="font-outfit text-xl font-semibold text-cafe-heading">Global Discovery</h3>
            <p className="text-sm leading-relaxed">
              We are actively expanding our global map, and this platform thrives on shared discoveries. We invite digital nomads, local regulars, and specialty coffee lovers worldwide to contribute their favorite cafes. By crowdsourcing these hidden gems, we directly support the passionate owners who keep these unique community spaces running.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-cafe-surface border border-cafe-border rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cafe-bg flex items-center justify-center text-cafe-primary">
              <Users size={24} strokeWidth={1.5} />
            </div>
            <h3 className="font-outfit text-xl font-semibold text-cafe-heading">Growing Network</h3>
            <p className="text-sm leading-relaxed">
              Join our growing network. Share your local spots, discover your next favorite workspace, and help eliminate the friction of the "cafe lottery" for everyone.
            </p>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="mt-16 text-center">
          <Link
            to="/directory"
            className="inline-flex bg-cafe-primary text-white hover:bg-cafe-primary-hover px-8 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 font-medium items-center gap-2 shadow-sm"
          >
            Browse Directory <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
