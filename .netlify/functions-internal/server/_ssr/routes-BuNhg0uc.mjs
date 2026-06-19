import { n as fetchCafes } from "./cafes-D3iAu7CZ.mjs";
import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BuNhg0uc.js
var $$splitComponentImporter = () => import("./routes-D5-KgWtP.mjs");
var Route = createFileRoute("/")({
	loader: async () => {
		return { featured: (await fetchCafes()).slice(0, 5) };
	},
	head: () => ({ meta: [
		{ title: "Indie Coffee Hub — Bengaluru's best independent cafes" },
		{
			name: "description",
			content: "A curated directory of independent specialty coffee cafes in Bengaluru, hand-picked for nomads and coffee lovers."
		},
		{
			property: "og:title",
			content: "Indie Coffee Hub — Bengaluru"
		},
		{
			property: "og:description",
			content: "Find laptop-friendly, specialty coffee cafes across Bengaluru."
		},
		{
			property: "og:image",
			content: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200&q=80"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
