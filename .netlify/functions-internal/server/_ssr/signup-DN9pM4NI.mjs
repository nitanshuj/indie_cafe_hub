import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { r as useAuth } from "./auth-context-D37CqtdW.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as ArrowRight, x as Coffee } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/signup-DN9pM4NI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SignUp() {
	const { signUp } = useAuth();
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [success, setSuccess] = (0, import_react.useState)(false);
	const submit = async (e) => {
		e.preventDefault();
		if (!email || !password) return;
		setBusy(true);
		setError(null);
		try {
			await signUp(email, password, name);
			setSuccess(true);
		} catch (err) {
			setError(err.message || "An error occurred during sign up.");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[#FFF7F5] grid lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hidden lg:block relative p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full w-full rounded-[2rem] overflow-hidden",
				style: {
					backgroundImage: "url('https://images.unsplash.com/photo-1613274554329-70f997f5789f?w=1600&q=80')",
					backgroundSize: "cover",
					backgroundPosition: "center"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "h-full w-full bg-gradient-to-tr from-[#2D2422]/45 via-transparent to-transparent p-10 flex flex-col justify-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "inline-flex items-center gap-2 text-white font-outfit text-xl font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coffee, { strokeWidth: 1.5 }), " Indie Coffee Hub"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-white/85 font-outfit text-3xl leading-tight max-w-sm",
						children: "Build your own little map of Bengaluru."
					})]
				})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-center px-6 py-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "lg:hidden inline-flex items-center gap-2 text-[#2D2422] font-outfit text-xl font-medium mb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coffee, {
						strokeWidth: 1.5,
						className: "text-[#E67E6B]"
					}), " Indie Coffee Hub"]
				}), success ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 bg-white border border-[#F5EBE9] rounded-[2rem] p-8 text-center shadow-[0_8px_30px_rgba(230,126,107,0.04)] font-work-sans",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto w-14 h-14 rounded-full bg-[#E8F5E9] inline-flex items-center justify-center text-[#2E7D32] mb-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coffee, { strokeWidth: 1.5 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-3xl font-outfit text-[#2D2422] font-light tracking-tight",
							children: "Verify your email"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-[#6B5C58] leading-relaxed text-sm",
							children: [
								"We've sent a verification link to",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-[#2D2422]",
									children: email
								}),
								". Please check your inbox and verify your email address to complete your registration."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "mt-8 w-full bg-[#E67E6B] text-white hover:bg-[#D96C5A] px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 font-medium inline-flex items-center justify-center gap-2",
							children: "Go to Sign in"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.2em] font-semibold text-[#E67E6B] font-work-sans",
						children: "Join free"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 text-4xl tracking-tight font-light text-[#2D2422] font-outfit",
						children: "Create your account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-[#6B5C58] font-work-sans",
						children: "Save cafes, leave notes, build your list."
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-work-sans",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-10 space-y-5",
						onSubmit: submit,
						"data-testid": "signup-form",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs uppercase tracking-[0.15em] font-semibold text-[#6B5C58] font-work-sans mb-2",
								children: "Display Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: "Your name",
								"data-testid": "signup-name-input",
								className: "w-full bg-white border border-[#F5EBE9] rounded-xl focus:ring-2 focus:ring-[#E67E6B]/30 focus:border-[#E67E6B] placeholder:text-[#A3938F] px-4 py-3 outline-none font-work-sans"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs uppercase tracking-[0.15em] font-semibold text-[#6B5C58] font-work-sans mb-2",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								required: true,
								value: email,
								onChange: (e) => setEmail(e.target.value),
								placeholder: "you@example.com",
								"data-testid": "signup-email-input",
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
								placeholder: "At least 8 characters",
								"data-testid": "signup-password-input",
								className: "w-full bg-white border border-[#F5EBE9] rounded-xl focus:ring-2 focus:ring-[#E67E6B]/30 focus:border-[#E67E6B] placeholder:text-[#A3938F] px-4 py-3 outline-none font-work-sans"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: busy,
								"data-testid": "signup-submit-button",
								className: "w-full bg-[#E67E6B] text-white hover:bg-[#D96C5A] disabled:opacity-60 px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 font-work-sans font-medium inline-flex items-center justify-center gap-2",
								children: busy ? "Creating account…" : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Create account ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
									size: 16,
									strokeWidth: 1.5
								})] })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-8 text-sm text-[#6B5C58] font-work-sans",
						children: [
							"Already have an account?",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								className: "text-[#E67E6B] hover:text-[#D96C5A] font-medium",
								"data-testid": "signup-to-login-link",
								children: "Sign in"
							})
						]
					})
				] })]
			})
		})]
	});
}
//#endregion
export { SignUp as component };
