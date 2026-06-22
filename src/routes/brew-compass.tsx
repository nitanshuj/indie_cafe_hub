import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Header, Footer } from "@/components/site-chrome";

export const Route = createFileRoute("/brew-compass")({
  head: () => ({
    meta: [
      { title: "The Brew School — Coffee Education Hub | Indie Coffee Hub" },
      {
        name: "description",
        content:
          "Explore the anatomy of espresso drinks, cold brews, brewing methods, premium beans, roasts, and coffee origins in the Brew School.",
      },
    ],
  }),
  component: BrewCompassLayout,
});

function BrewCompassLayout() {
  return (
    <div className="min-h-screen bg-cafe-bg">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
