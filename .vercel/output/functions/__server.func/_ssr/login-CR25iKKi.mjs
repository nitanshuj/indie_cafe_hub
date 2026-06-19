import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { r as useAuth } from "./auth-context-D37CqtdW.mjs";
import { _ as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as ArrowRight, x as Coffee } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-CR25iKKi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthSplit({ side, children }) {
	const Image = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "hidden lg:block relative p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full w-full rounded-[2rem] overflow-hidden bg-[#FDE4DD]",
			style: {
				backgroundImage: "url('https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1600&q=80')",
				backgroundSize: "cover",
				backgroundPosition: "center"
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "h-full w-full bg-gradient-to-tr from-[#2D2422]/40 via-transparent to-transparent p-10 flex flex-col justify-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "inline-flex items-center gap-2 text-white font-outfit text-xl font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coffee, { strokeWidth: 1.5 }), " Indie Coffee Hub"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-white/85 font-outfit text-3xl leading-tight max-w-sm",
					children: "Slow mornings, focused work, great coffee."
				})]
			})
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[#FFF7F5] grid lg:grid-cols-2",
		children: [
			side === "left" ? Image : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-center px-6 py-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-center px-6 py-16 w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full max-w-md",
						children
					})
				})
			}),
			side === "right" ? Image : null
		]
	});
}
function Login() {
	const { signIn } = useAuth();
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const submit = async (e) => {
		e.preventDefault();
		if (!email || !password) return;
		setBusy(true);
		setError(null);
		try {
			if ((await signIn(email, password)).isAdmin) navigate({ to: "/admin" });
			else navigate({ to: "/" });
		} catch (err) {
			setError(err.message || "An error occurred during sign in.");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthSplit, {
		side: "left",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "lg:hidden inline-flex items-center gap-2 text-[#2D2422] font-outfit text-xl font-medium mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coffee, {
					strokeWidth: 1.5,
					className: "text-[#E67E6B]"
				}), " Indie Coffee Hub"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.2em] font-semibold text-[#E67E6B] font-work-sans",
				children: "Welcome back"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 text-4xl tracking-tight font-light text-[#2D2422] font-outfit",
				children: "Sign in"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-[#6B5C58] font-work-sans",
				children: "Pick up where you left off."
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-work-sans",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-10 space-y-5",
				onSubmit: submit,
				"data-testid": "login-form",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs uppercase tracking-[0.15em] font-semibold text-[#6B5C58] font-work-sans mb-2",
						children: "Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "email",
						required: true,
						value: email,
						onChange: (e) => setEmail(e.target.value),
						placeholder: "you@example.com",
						"data-testid": "login-email-input",
						className: "w-full bg-white border border-[#F5EBE9] rounded-xl focus:ring-2 focus:ring-[#E67E6B]/30 focus:border-[#E67E6B] placeholder:text-[#A3938F] px-4 py-3 outline-none font-work-sans"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs uppercase tracking-[0.15em] font-semibold text-[#6B5C58] font-work-sans mb-2",
						children: "Password"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "password",
						required: true,
						value: password,
						onChange: (e) => setPassword(e.target.value),
						placeholder: "••••••••",
						"data-testid": "login-password-input",
						className: "w-full bg-white border border-[#F5EBE9] rounded-xl focus:ring-2 focus:ring-[#E67E6B]/30 focus:border-[#E67E6B] placeholder:text-[#A3938F] px-4 py-3 outline-none font-work-sans"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: busy,
						"data-testid": "login-submit-button",
						className: "w-full bg-[#E67E6B] text-white hover:bg-[#D96C5A] disabled:opacity-60 px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 font-work-sans font-medium inline-flex items-center justify-center gap-2 cursor-pointer",
						children: busy ? "Signing in…" : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Sign in ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
							size: 16,
							strokeWidth: 1.5
						})] })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-8 text-sm text-[#6B5C58] font-work-sans",
				children: [
					"New here?",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/signup",
						className: "text-[#E67E6B] hover:text-[#D96C5A] font-medium",
						"data-testid": "login-to-signup-link",
						children: "Create an account"
					})
				]
			})
		]
	});
}
//#endregion
export { Login as component };
