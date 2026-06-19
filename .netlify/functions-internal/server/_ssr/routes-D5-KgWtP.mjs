import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as ArrowRight, l as Search } from "../_libs/lucide-react.mjs";
import { n as Header, t as Footer } from "./site-chrome-kWrDwoWq.mjs";
import { t as CafeCard } from "./cafe-card-EKQxhOly.mjs";
import { t as Route } from "./routes-BuNhg0uc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D5-KgWtP.js
var import_jsx_runtime = require_jsx_runtime();
var marqueeItems = [
	"LAPTOP FRIENDLY",
	"SPECIALTY COFFEE",
	"LOCAL BAKERY",
	"FAST WIFI",
	"INDEPENDENT",
	"BENGALURU"
];
function Index() {
	const { featured } = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[#FFF7F5]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-7xl mx-auto px-6 pt-20 pb-16 sm:pt-28 sm:pb-24 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.2em] font-semibold text-[#E67E6B] font-work-sans",
							children: "A Bengaluru cafe directory"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-6 text-5xl sm:text-6xl tracking-tight font-light text-[#2D2422] font-outfit max-w-3xl mx-auto leading-[1.05]",
							children: "Your city's best indie cafes, found."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 text-base leading-relaxed text-[#6B5C58] font-work-sans max-w-xl mx-auto",
							children: "Hand-picked corners of Bengaluru for specialty coffee, slow mornings, and focused work — no chains, no clutter."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "mt-10 max-w-xl mx-auto flex flex-col sm:flex-row gap-3",
							onSubmit: (e) => e.preventDefault(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
									size: 18,
									strokeWidth: 1.5,
									className: "absolute left-4 top-1/2 -translate-y-1/2 text-[#A3938F]"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "search",
									placeholder: "Search by name or neighborhood…",
									"data-testid": "hero-search-input",
									className: "w-full bg-white border border-[#F5EBE9] rounded-xl focus:ring-2 focus:ring-[#E67E6B]/30 focus:border-[#E67E6B] placeholder:text-[#A3938F] pl-11 pr-4 py-3 outline-none font-work-sans"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/directory",
								"data-testid": "hero-browse-button",
								className: "bg-[#E67E6B] text-white hover:bg-[#D96C5A] px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 font-work-sans font-medium inline-flex items-center justify-center gap-2",
								children: ["Browse directory ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
									size: 16,
									strokeWidth: 1.5
								})]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative border-y border-[#F5EBE9] bg-white/40 overflow-hidden py-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex animate-marquee whitespace-nowrap",
						children: [
							...marqueeItems,
							...marqueeItems,
							...marqueeItems,
							...marqueeItems
						].map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs uppercase tracking-[0.2em] font-semibold text-[#E67E6B] mx-8 font-work-sans",
							children: [item, " •"]
						}, i))
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "max-w-7xl mx-auto px-6 py-20 sm:py-28",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between flex-wrap gap-4 mb-12",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.2em] font-semibold text-[#E67E6B] font-work-sans",
						children: "Featured this month"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 text-3xl sm:text-4xl tracking-tight font-medium text-[#2D2422] font-outfit",
						children: "Where Bengaluru is going right now"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/directory",
						"data-testid": "featured-see-all-link",
						className: "text-[#E67E6B] hover:text-[#D96C5A] font-work-sans font-medium inline-flex items-center gap-2",
						children: ["See all ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
							size: 16,
							strokeWidth: 1.5
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-6",
					children: featured.map((cafe, i) => {
						let colSpan = "md:col-span-8 lg:col-span-4";
						let heightClass = "h-56";
						if (i === 0) {
							colSpan = "md:col-span-8 lg:col-span-8";
							heightClass = "h-80";
						} else if (i === 1) {
							colSpan = "md:col-span-8 lg:col-span-4";
							heightClass = "h-80";
						}
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CafeCard, {
							cafe,
							className: colSpan,
							imageHeightClass: heightClass
						}, cafe.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { Index as component };
