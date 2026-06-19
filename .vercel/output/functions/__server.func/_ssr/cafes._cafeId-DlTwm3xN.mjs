import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cafes._cafeId-DlTwm3xN.js
var import_jsx_runtime = require_jsx_runtime();
var SplitErrorComponent = ({ error }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "min-h-screen bg-[#FFF7F5] grid place-items-center px-6",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-[#6B5C58] font-work-sans",
		children: ["Something went wrong: ", error.message]
	})
});
//#endregion
export { SplitErrorComponent as errorComponent };
