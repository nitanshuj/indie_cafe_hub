import { n as supabase } from "./auth-context-D37CqtdW.mjs";
import { a as setIsrCache, n as getDeliveryStrategy, r as getIsrCache } from "./cache-C5a1HGnS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cafes-D3iAu7CZ.js
var neighborhoods = [
	"All neighborhoods",
	"Indiranagar",
	"Koramangala",
	"Jayanagar",
	"MG Road",
	"HSR Layout"
];
function optimizeCloudinaryUrl(url, width = 1200) {
	if (!url || !url.includes("cloudinary.com")) return url;
	if (url.includes("/f_auto") || url.includes("/q_auto")) return url;
	return url.replace("/image/upload/", `/image/upload/f_auto,q_auto,w_${width}/`);
}
function mapDbCafeToUiCafe(dbCafe) {
	return {
		id: dbCafe.slug || dbCafe.id,
		dbId: dbCafe.id,
		name: dbCafe.name,
		neighborhood: dbCafe.neighborhood,
		blurb: dbCafe.description || "",
		image: optimizeCloudinaryUrl(dbCafe.hero_image_url || "", 1200),
		gallery: (dbCafe.gallery_image_urls || []).map((url) => optimizeCloudinaryUrl(url, 800)),
		tags: [
			dbCafe.has_wifi ? "WiFi Friendly" : "",
			dbCafe.has_plug_points ? "Laptop Friendly" : "",
			dbCafe.has_ac ? "AC" : "",
			dbCafe.is_pet_friendly ? "Pet Friendly" : ""
		].filter(Boolean),
		wifi: dbCafe.has_wifi,
		open: true,
		hours: dbCafe.opening_hours ? typeof dbCafe.opening_hours === "string" ? dbCafe.opening_hours : dbCafe.opening_hours.weekday || dbCafe.opening_hours.mon_fri || "9am – 9pm" : "9am – 9pm",
		address: dbCafe.address,
		has_wifi: dbCafe.has_wifi,
		has_plug_points: dbCafe.has_plug_points,
		has_ac: dbCafe.has_ac,
		is_pet_friendly: dbCafe.is_pet_friendly
	};
}
async function fetchCafes() {
	if (typeof window !== "undefined" && getDeliveryStrategy() === "isr") {
		const cached = getIsrCache();
		if (cached) return cached;
	}
	const { data, error } = await supabase.from("cafes").select("*").order("created_at", { ascending: false });
	if (error) {
		console.error("Error fetching cafes:", error);
		throw error;
	}
	const cafes = (data || []).map(mapDbCafeToUiCafe);
	if (typeof window !== "undefined") setIsrCache(cafes);
	return cafes;
}
async function fetchCafeByIdOrSlug(idOrSlug) {
	if (typeof window !== "undefined" && getDeliveryStrategy() === "isr") {
		const cached = getIsrCache();
		if (cached) {
			const match = cached.find((c) => c.id === idOrSlug || c.dbId === idOrSlug);
			if (match) return match;
		}
	}
	let { data, error } = await supabase.from("cafes").select("*").eq("slug", idOrSlug).maybeSingle();
	if (!data && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug)) {
		const res = await supabase.from("cafes").select("*").eq("id", idOrSlug).maybeSingle();
		data = res.data;
		error = res.error;
	}
	if (error) {
		console.error("Error fetching cafe details:", error);
		throw error;
	}
	return data ? mapDbCafeToUiCafe(data) : null;
}
//#endregion
export { fetchCafes as n, neighborhoods as r, fetchCafeByIdOrSlug as t };
