import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as Clock, p as MapPin, r as Wifi } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cafe-card-EKQxhOly.js
var import_jsx_runtime = require_jsx_runtime();
function CafeCard({ cafe, className = "", imageHeightClass = "h-64" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/cafes/$cafeId",
		params: { cafeId: cafe.id },
		"data-testid": `cafe-card-link-${cafe.id}`,
		className: `group block bg-white border border-[#F5EBE9] shadow-[0_8px_30px_rgba(230,126,107,0.04)] rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-[0_12px_40px_rgba(230,126,107,0.08)] hover:-translate-y-1 ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `overflow-hidden ${imageHeightClass}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: cafe.image,
				alt: `Interior of ${cafe.name}`,
				loading: "lazy",
				className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-6 sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 flex-wrap mb-4",
					children: [cafe.open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "bg-[#E8F5E9] text-[#2E7D32] rounded-full px-3 py-1 text-xs font-medium font-work-sans",
						children: "Open now"
					}), cafe.wifi && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "bg-[#FDE4DD] text-[#E67E6B] rounded-full px-3 py-1 text-xs font-medium font-work-sans inline-flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, {
							size: 12,
							strokeWidth: 1.5
						}), " WiFi"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-outfit text-2xl font-medium text-[#2D2422] tracking-tight",
					children: cafe.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex items-center gap-3 text-xs text-[#A3938F] font-work-sans",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
							size: 12,
							strokeWidth: 1.5
						}), cafe.neighborhood]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
							size: 12,
							strokeWidth: 1.5
						}), cafe.hours]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-[#6B5C58] font-work-sans leading-relaxed text-sm",
					children: cafe.blurb
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 flex flex-wrap gap-2",
					children: cafe.tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-[#6B5C58] border border-[#F5EBE9] rounded-full px-3 py-1 font-work-sans",
						children: t
					}, t))
				})
			]
		})]
	});
}
//#endregion
export { CafeCard as t };
