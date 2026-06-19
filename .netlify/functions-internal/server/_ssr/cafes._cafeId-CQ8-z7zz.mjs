import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Header, t as Footer } from "./site-chrome-kWrDwoWq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cafes._cafeId-CQ8-z7zz.js
var import_jsx_runtime = require_jsx_runtime();
var SplitNotFoundComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "min-h-screen bg-[#FFF7F5]",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md mx-auto px-6 py-32 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-outfit text-[#2D2422]",
					children: "Cafe not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-[#6B5C58] font-work-sans",
					children: "It may have closed or moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/directory",
					className: "mt-6 inline-flex bg-[#E67E6B] text-white px-5 py-2.5 rounded-xl font-work-sans font-medium",
					children: "Back to directory"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
	]
});
//#endregion
export { SplitNotFoundComponent as notFoundComponent };
