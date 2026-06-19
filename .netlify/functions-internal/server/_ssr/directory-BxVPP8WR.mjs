import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { r as useAuth } from "./auth-context-D37CqtdW.mjs";
import { n as getDeliveryStrategy } from "./cache-C5a1HGnS.mjs";
import { n as fetchCafes, r as neighborhoods } from "./cafes-D3iAu7CZ.mjs";
import { T as ChevronDown, l as Search, r as Wifi, x as Coffee } from "../_libs/lucide-react.mjs";
import { n as Header, t as Footer } from "./site-chrome-kWrDwoWq.mjs";
import { t as Route } from "./directory-Cx0C6u8l.mjs";
import { t as CafeCard } from "./cafe-card-EKQxhOly.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/directory-BxVPP8WR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Directory() {
	const { user } = useAuth();
	const { cafes: initialCafes } = Route.useLoaderData();
	const [cafes, setCafes] = (0, import_react.useState)(initialCafes);
	const [strategy, setStrategy] = (0, import_react.useState)("dynamic");
	const [query, setQuery] = (0, import_react.useState)("");
	const [hood, setHood] = (0, import_react.useState)("All neighborhoods");
	const [wifiOnly, setWifiOnly] = (0, import_react.useState)(false);
	const reloadData = async () => {
		setCafes(await fetchCafes());
		setStrategy(getDeliveryStrategy());
	};
	(0, import_react.useEffect)(() => {
		setStrategy(getDeliveryStrategy());
		window.addEventListener("delivery-strategy-change", reloadData);
		window.addEventListener("isr-cache-updated", reloadData);
		return () => {
			window.removeEventListener("delivery-strategy-change", reloadData);
			window.removeEventListener("isr-cache-updated", reloadData);
		};
	}, []);
	const filtered = (0, import_react.useMemo)(() => {
		return cafes.filter((c) => {
			if (hood !== "All neighborhoods" && c.neighborhood !== hood) return false;
			if (wifiOnly && !c.wifi) return false;
			if (query && !`${c.name} ${c.neighborhood} ${c.blurb}`.toLowerCase().includes(query.toLowerCase())) return false;
			return true;
		});
	}, [
		cafes,
		query,
		hood,
		wifiOnly
	]);
	const clearAll = () => {
		setQuery("");
		setHood("All neighborhoods");
		setWifiOnly(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[#FFF7F5]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sticky top-[73px] z-40 bg-white/70 backdrop-blur-xl border-b border-[#F5EBE9] backdrop-saturate-150",
				"data-testid": "directory-filter-bar",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
								size: 18,
								strokeWidth: 1.5,
								className: "absolute left-4 top-1/2 -translate-y-1/2 text-[#A3938F]"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "search",
								value: query,
								onChange: (e) => setQuery(e.target.value),
								placeholder: "Search cafes…",
								"data-testid": "filter-search-input",
								className: "w-full bg-white border border-[#F5EBE9] rounded-xl focus:ring-2 focus:ring-[#E67E6B]/30 focus:border-[#E67E6B] placeholder:text-[#A3938F] pl-11 pr-4 py-2 outline-none font-work-sans"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: hood,
								onChange: (e) => setHood(e.target.value),
								"data-testid": "filter-neighborhood-select",
								className: "appearance-none bg-white border border-[#F5EBE9] rounded-xl focus:ring-2 focus:ring-[#E67E6B]/30 focus:border-[#E67E6B] text-[#2D2422] pl-4 pr-10 py-2 outline-none font-work-sans w-full sm:w-auto",
								children: neighborhoods.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: n,
									children: n
								}, n))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
								size: 16,
								strokeWidth: 1.5,
								className: "absolute right-3 top-1/2 -translate-y-1/2 text-[#A3938F] pointer-events-none"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setWifiOnly((v) => !v),
							"data-testid": "filter-wifi-toggle",
							"aria-pressed": wifiOnly,
							className: `inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 font-work-sans text-sm ${wifiOnly ? "bg-[#E67E6B] text-white border-[#E67E6B] hover:bg-[#D96C5A]" : "bg-white text-[#6B5C58] border-[#F5EBE9] hover:border-[#E67E6B]/40"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, {
								size: 16,
								strokeWidth: 1.5
							}), " WiFi Friendly"]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "max-w-7xl mx-auto px-6 py-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-10 flex items-start justify-between flex-wrap gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs uppercase tracking-[0.2em] font-semibold text-[#E67E6B] font-work-sans",
						children: [
							filtered.length,
							" ",
							filtered.length === 1 ? "cafe" : "cafes"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 text-5xl sm:text-6xl tracking-tight font-light text-[#2D2422] font-outfit",
						children: "The directory"
					})] }), user && user.isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `text-xs px-3.5 py-2 rounded-xl border flex items-center gap-1.5 font-medium font-work-sans shadow-sm transition-all ${strategy === "isr" ? "bg-purple-50 border-purple-200 text-purple-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-2 h-2 rounded-full ${strategy === "isr" ? "bg-purple-500 animate-pulse" : "bg-emerald-500 animate-ping"}` }), strategy === "isr" ? "Serving from Static CDN Edge (ISR Mode)" : "Live DB Query (Dynamic SSR Mode)"]
					})]
				}), filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center py-24 max-w-md mx-auto",
					"data-testid": "directory-empty-state",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "inline-flex w-16 h-16 rounded-full bg-[#FDE4DD] items-center justify-center text-[#E67E6B]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coffee, { strokeWidth: 1.5 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-6 text-3xl tracking-tight font-medium text-[#2D2422] font-outfit",
							children: "No cafes match — yet."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-[#6B5C58] font-work-sans leading-relaxed",
							children: "Try widening your search, or have a look at the whole directory."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: clearAll,
							"data-testid": "empty-clear-filters-button",
							className: "mt-6 text-[#E67E6B] hover:text-[#D96C5A] font-work-sans font-medium",
							children: "Clear all filters"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
					children: filtered.map((cafe, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "animate-fade-up",
						style: { animationDelay: `${i * 80}ms` },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CafeCard, {
							cafe,
							imageHeightClass: i % 3 === 1 ? "h-80" : "h-64"
						})
					}, cafe.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { Directory as component };
