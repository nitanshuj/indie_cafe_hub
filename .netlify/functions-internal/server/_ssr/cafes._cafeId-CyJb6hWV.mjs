import { t as fetchCafeByIdOrSlug } from "./cafes-D3iAu7CZ.mjs";
import { M as notFound, f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cafes._cafeId-CyJb6hWV.js
var $$splitComponentImporter = () => import("./cafes._cafeId-BaX9EYDh.mjs");
var $$splitNotFoundComponentImporter = () => import("./cafes._cafeId-CQ8-z7zz.mjs");
var $$splitErrorComponentImporter = () => import("./cafes._cafeId-DlTwm3xN.mjs");
var Route = createFileRoute("/cafes/$cafeId")({
	loader: async ({ params }) => {
		const cafe = await fetchCafeByIdOrSlug(params.cafeId);
		if (!cafe) throw notFound();
		return { cafe };
	},
	head: ({ loaderData }) => ({ meta: loaderData ? [
		{ title: `${loaderData.cafe.name} — Indie Coffee Hub` },
		{
			name: "description",
			content: loaderData.cafe.blurb
		},
		{
			property: "og:title",
			content: loaderData.cafe.name
		},
		{
			property: "og:description",
			content: loaderData.cafe.blurb
		},
		{
			property: "og:image",
			content: loaderData.cafe.image
		}
	] : [] }),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
