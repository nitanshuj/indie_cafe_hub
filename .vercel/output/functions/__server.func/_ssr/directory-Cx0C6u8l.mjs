import { n as fetchCafes } from "./cafes-D3iAu7CZ.mjs";
import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/directory-Cx0C6u8l.js
var $$splitComponentImporter = () => import("./directory-BxVPP8WR.mjs");
var Route = createFileRoute("/directory")({
	loader: async () => {
		return { cafes: await fetchCafes() };
	},
	head: () => ({ meta: [
		{ title: "Directory — Indie Coffee Hub" },
		{
			name: "description",
			content: "Browse every independent cafe in our Bengaluru directory. Filter by neighborhood and WiFi friendliness."
		},
		{
			property: "og:title",
			content: "Cafe Directory — Indie Coffee Hub"
		},
		{
			property: "og:description",
			content: "Browse and filter Bengaluru's independent cafes."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
