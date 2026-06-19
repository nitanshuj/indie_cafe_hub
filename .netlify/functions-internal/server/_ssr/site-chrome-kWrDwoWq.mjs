import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { r as useAuth } from "./auth-context-D37CqtdW.mjs";
import { i as setDeliveryStrategy, n as getDeliveryStrategy } from "./cache-C5a1HGnS.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as Layers, h as LayoutDashboard, i as User, m as LogOut, p as MapPin, u as RefreshCw, v as Globe, x as Coffee } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-chrome-kWrDwoWq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthArea() {
	const { user, signOut } = useAuth();
	const [open, setOpen] = (0, import_react.useState)(false);
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const onClick = (e) => {
			if (ref.current && !ref.current.contains(e.target)) setOpen(false);
		};
		document.addEventListener("mousedown", onClick);
		return () => document.removeEventListener("mousedown", onClick);
	}, []);
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		"data-testid": "auth-buttons",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/login",
			"data-testid": "header-signin-link",
			className: "text-sm text-[#6B5C58] hover:text-[#2D2422] px-3 py-2 rounded-xl transition-colors font-work-sans",
			children: "Sign In"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/signup",
			"data-testid": "header-signup-link",
			className: "text-sm bg-[#E67E6B] text-white hover:bg-[#D96C5A] px-4 py-2 rounded-xl transition-all duration-200 hover:-translate-y-0.5 font-work-sans font-medium",
			children: "Join Free"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		ref,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => setOpen((v) => !v),
			"data-testid": "header-avatar-button",
			className: "w-9 h-9 rounded-full bg-[#FDE4DD] text-[#E67E6B] inline-flex items-center justify-center font-medium font-work-sans hover:ring-2 hover:ring-[#E67E6B]/30 transition-all cursor-pointer",
			"aria-haspopup": "menu",
			"aria-expanded": open,
			children: (user.name || user.email).charAt(0).toUpperCase()
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute right-0 mt-2 w-56 bg-white border border-[#F5EBE9] rounded-2xl shadow-[0_12px_40px_rgba(230,126,107,0.08)] py-2 z-50 animate-fade-in",
			"data-testid": "header-avatar-menu",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-4 py-2 border-b border-[#F5EBE9]",
					children: [
						user.isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-bold text-[#E67E6B] mb-1 font-outfit",
							"data-testid": "menu-welcome-admin",
							children: "Welcome Admin"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-[#2D2422] font-outfit truncate",
							children: user.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-[#A3938F] font-work-sans truncate",
							children: user.email
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "w-full text-left px-4 py-2 text-sm text-[#6B5C58] hover:bg-[#FFF7F5] font-work-sans inline-flex items-center gap-2 cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, {
						size: 14,
						strokeWidth: 1.5
					}), " Profile"]
				}),
				user.isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin",
					onClick: () => setOpen(false),
					"data-testid": "header-admin-link",
					className: "block px-4 py-2 text-sm text-[#6B5C58] hover:bg-[#FFF7F5] font-work-sans",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, {
							size: 14,
							strokeWidth: 1.5
						}), " Admin Dashboard"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						signOut();
						setOpen(false);
					},
					"data-testid": "header-signout-button",
					className: "w-full text-left px-4 py-2 text-sm text-[#6B5C58] hover:bg-[#FFF7F5] font-work-sans inline-flex items-center gap-2 cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, {
						size: 14,
						strokeWidth: 1.5
					}), " Sign Out"]
				})
			]
		})]
	});
}
function Header() {
	const { user } = useAuth();
	const [strategy, setStrategy] = (0, import_react.useState)("dynamic");
	const [webhookStatus, setWebhookStatus] = (0, import_react.useState)(null);
	const [showExplanation, setShowExplanation] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setStrategy(getDeliveryStrategy());
		const handleStrategyChange = () => {
			setStrategy(getDeliveryStrategy());
		};
		window.addEventListener("delivery-strategy-change", handleStrategyChange);
		const handleWebhookTrigger = (e) => {
			setWebhookStatus(`[ISR Webhook] Triggered page invalidation for "${e.detail?.cafeName || "New Cafe"}"...`);
			setTimeout(() => {
				setWebhookStatus(`[ISR Webhook] Generating lightweight WebP optimized layouts...`);
			}, 1e3);
			setTimeout(() => {
				setWebhookStatus(`[ISR Webhook] Swapping pre-cached static HTML at Bengaluru Edge CDN!`);
			}, 2200);
			setTimeout(() => {
				setWebhookStatus(null);
			}, 3500);
		};
		window.addEventListener("isr-webhook-trigger", handleWebhookTrigger);
		return () => {
			window.removeEventListener("delivery-strategy-change", handleStrategyChange);
			window.removeEventListener("isr-webhook-trigger", handleWebhookTrigger);
		};
	}, []);
	const toggleStrategy = () => {
		setDeliveryStrategy(strategy === "dynamic" ? "isr" : "dynamic");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-[#F5EBE9] backdrop-saturate-150 shadow-sm",
		"data-testid": "site-header",
		children: [webhookStatus && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-[#E67E6B] text-white py-2.5 px-6 text-center text-xs font-semibold font-work-sans animate-fade-in flex items-center justify-center gap-2.5 z-[100] relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
				size: 14,
				className: "animate-spin text-white"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: webhookStatus })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-7xl mx-auto px-6 py-4 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "flex items-center gap-2 text-[#2D2422] font-outfit text-xl font-medium",
				"data-testid": "header-logo-link",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coffee, {
					strokeWidth: 1.5,
					className: "text-[#E67E6B]"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Indie Coffee Hub" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex items-center gap-2 sm:gap-4 text-sm font-work-sans",
				children: [
					user && user.isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex items-center gap-1.5 mr-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: toggleStrategy,
								title: "Toggle Delivery Strategy",
								className: `flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium font-work-sans transition-all cursor-pointer ${strategy === "isr" ? "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100" : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"}`,
								children: strategy === "isr" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, {
										size: 13,
										className: "text-purple-600 animate-pulse"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: "Strategy:"
									}),
									" On-Demand ISR"
								] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, {
										size: 13,
										className: "text-emerald-600 animate-pulse"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: "Strategy:"
									}),
									" Dynamic SSR"
								] })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setShowExplanation(!showExplanation),
								className: "text-[#A3938F] hover:text-[#2D2422] p-1 rounded-full text-xs font-semibold cursor-pointer border border-[#F5EBE9] h-5 w-5 inline-flex items-center justify-center",
								title: "What is this?",
								children: "?"
							}),
							showExplanation && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute right-0 top-10 mt-1 w-80 bg-white border border-[#F5EBE9] rounded-2xl shadow-[0_12px_40px_rgba(45,36,34,0.12)] p-4 z-[999] text-[#2D2422] animate-fade-up",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-outfit font-medium text-sm border-b border-[#F5EBE9] pb-2 mb-2 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Data Strategy Simulator" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setShowExplanation(false),
										className: "text-xs text-[#A3938F] hover:text-[#2D2422]",
										children: "Close"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3 text-xs font-work-sans text-[#6B5C58]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-emerald-700",
										children: "🟢 Dynamic SSR:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5",
										children: "Queries live database on every single page load. Extremely fresh, but hits the database each time."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-purple-700",
										children: "⚡ On-Demand ISR:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5",
										children: "Serves pre-cached static HTML instantly. When you save in Admin, a background webhook invalidates the cache and rebuilds the static pages silently."
									})] })]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden lg:flex items-center gap-1.5 text-[#A3938F]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
							size: 16,
							strokeWidth: 1.5
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Bengaluru" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "hidden sm:inline text-[#6B5C58] hover:text-[#2D2422] transition-colors",
						activeProps: { className: "text-[#2D2422] font-medium" },
						activeOptions: { exact: true },
						"data-testid": "nav-home-link",
						children: "Home"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/directory",
						className: "text-[#6B5C58] hover:text-[#2D2422] transition-colors",
						activeProps: { className: "text-[#2D2422] font-medium" },
						"data-testid": "nav-directory-link",
						children: "Directory"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "hidden sm:inline-block w-px h-5 bg-[#F5EBE9]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthArea, {})
				]
			})]
		})]
	});
}
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "bg-[#2D2422] text-white/80 mt-24",
		"data-testid": "site-footer",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-7xl mx-auto px-6 py-16 grid gap-10 md:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-white font-outfit text-xl font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coffee, {
						strokeWidth: 1.5,
						className: "text-[#E67E6B]"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Indie Coffee Hub" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm leading-relaxed text-white/60 max-w-xs font-work-sans",
					children: "A small, hand-picked directory of independent specialty cafes across Bengaluru."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-sm font-work-sans",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.2em] font-semibold text-[#E67E6B]",
						children: "Explore"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-4 space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/directory",
								className: "hover:text-white",
								"data-testid": "footer-directory-link",
								children: "All cafes"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-white/40",
								children: "Indiranagar"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-white/40",
								children: "Koramangala"
							}) })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-sm font-work-sans",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.2em] font-semibold text-[#E67E6B]",
						children: "About"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-white/60 leading-relaxed",
						children: "Built with care for nomads, freelancers, and the people who keep these places running."
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-white/10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "max-w-7xl mx-auto px-6 py-6 text-xs text-white/40 font-work-sans",
				children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" Indie Coffee Hub. Bengaluru."
				]
			})
		})]
	});
}
//#endregion
export { Header as n, Footer as t };
