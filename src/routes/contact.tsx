import { createFileRoute } from "@tanstack/react-router";
import { Header, Footer } from "@/components/site-chrome";
import { Mail } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Indie Coffee Hub" },
      {
        name: "description",
        content: "Get in touch with Indie Coffee Hub. Have a recommendation for a cafe? Encountered an issue? Drop us a line.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen bg-cafe-bg">
      <Header />

      {/* Hero Header */}
      <section className="bg-cafe-surface/40 border-b border-cafe-border py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-cafe-primary font-work-sans">
            Get In Touch
          </p>
          <h1 className="mt-3 text-4xl sm:text-5xl tracking-tight font-light text-cafe-heading font-outfit max-w-2xl mx-auto leading-tight">
            We'd love to hear <span className="font-semibold text-cafe-primary">from you</span>.
          </h1>
        </div>
      </section>

      {/* Centered Contact Info */}
      <section className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="text-center space-y-6 max-w-sm w-full">
          <div>
            <h2 className="font-outfit text-2xl font-light text-cafe-heading mb-2">Contact Info</h2>
            <p className="text-sm leading-relaxed text-cafe-body font-work-sans">
              Have a recommendation for a cafe? Encountered an issue? Drop us a line.
            </p>
          </div>

          <a
            href="mailto:nitanshuj138@gmail.com"
            className="inline-flex items-center gap-3 px-6 py-4 bg-cafe-surface border border-cafe-border rounded-2xl text-cafe-heading hover:border-cafe-primary transition-all duration-200 hover:-translate-y-0.5 shadow-sm w-full justify-center"
          >
            <div className="w-10 h-10 rounded-xl bg-cafe-bg flex items-center justify-center text-cafe-primary shrink-0">
              <Mail size={20} strokeWidth={1.5} />
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold tracking-wider text-cafe-muted font-work-sans">Email Us</p>
              <p className="text-sm font-semibold font-work-sans">nitanshuj138@gmail.com</p>
            </div>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
