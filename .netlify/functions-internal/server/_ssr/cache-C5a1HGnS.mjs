//#region node_modules/.nitro/vite/services/ssr/assets/cache-C5a1HGnS.js
var STRATEGY_KEY = "indie_cafe_strategy";
var CACHE_KEY = "indie_cafe_static_cache";
function getDeliveryStrategy() {
	if (typeof window === "undefined") return "dynamic";
	return localStorage.getItem(STRATEGY_KEY) || "dynamic";
}
function setDeliveryStrategy(strategy) {
	if (typeof window === "undefined") return;
	localStorage.setItem(STRATEGY_KEY, strategy);
	window.dispatchEvent(new Event("delivery-strategy-change"));
}
function getIsrCache() {
	if (typeof window === "undefined") return null;
	const cached = localStorage.getItem(CACHE_KEY);
	return cached ? JSON.parse(cached) : null;
}
function setIsrCache(cafes) {
	if (typeof window === "undefined") return;
	localStorage.setItem(CACHE_KEY, JSON.stringify(cafes));
	window.dispatchEvent(new Event("isr-cache-updated"));
}
function clearIsrCache() {
	if (typeof window === "undefined") return;
	localStorage.removeItem(CACHE_KEY);
	window.dispatchEvent(new Event("isr-cache-updated"));
}
//#endregion
export { setIsrCache as a, setDeliveryStrategy as i, getDeliveryStrategy as n, getIsrCache as r, clearIsrCache as t };
