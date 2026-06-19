import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as supabase, r as useAuth } from "./auth-context-D37CqtdW.mjs";
import { n as getDeliveryStrategy } from "./cache-C5a1HGnS.mjs";
import { t as fetchCafeByIdOrSlug } from "./cafes-D3iAu7CZ.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as Clock, O as ArrowLeft, c as Send, i as User, n as X, p as MapPin, r as Wifi, t as ZoomIn, u as RefreshCw } from "../_libs/lucide-react.mjs";
import { n as Header, t as Footer } from "./site-chrome-kWrDwoWq.mjs";
import { t as Route } from "./cafes._cafeId-CyJb6hWV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cafes._cafeId-BaX9EYDh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function formatDate(d) {
	return d.toLocaleDateString("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric"
	});
}
function mapDbCommentToUiComment(c) {
	return {
		id: c.id,
		name: c.author_name,
		date: formatDate(new Date(c.created_at)),
		text: c.content,
		isGuest: c.is_guest
	};
}
function CommentsSection({ cafeId }) {
	const { user } = useAuth();
	const [comments, setComments] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [polling, setPolling] = (0, import_react.useState)(false);
	const [text, setText] = (0, import_react.useState)("");
	const [guestName, setGuestName] = (0, import_react.useState)("");
	const fetchComments = async (isBackground = false) => {
		try {
			if (isBackground) setPolling(true);
			const { data, error } = await supabase.from("comments").select("*").eq("cafe_id", cafeId).order("created_at", { ascending: false });
			if (error) throw error;
			setComments((data || []).map(mapDbCommentToUiComment));
		} catch (err) {
			console.error("Error loading comments:", err);
		} finally {
			setLoading(false);
			setPolling(false);
		}
	};
	(0, import_react.useEffect)(() => {
		if (cafeId) {
			fetchComments();
			const interval = setInterval(() => {
				fetchComments(true);
			}, 12e4);
			return () => clearInterval(interval);
		}
	}, [cafeId]);
	const submit = async (e) => {
		e.preventDefault();
		const body = text.trim();
		if (!body) return;
		const name = user?.name || guestName.trim() || "Guest";
		try {
			let authorId = null;
			if (user) {
				const { data: userData } = await supabase.auth.getUser();
				authorId = userData?.user?.id || null;
			}
			const { data, error } = await supabase.from("comments").insert({
				cafe_id: cafeId,
				author_id: authorId,
				author_name: name,
				content: body,
				is_guest: !user
			}).select().single();
			if (error) throw error;
			if (data) setComments((cs) => [mapDbCommentToUiComment(data), ...cs]);
			setText("");
			setGuestName("");
		} catch (err) {
			console.error("Error submitting comment:", err);
			alert("Failed to submit comment.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-16",
		"data-testid": "comments-section",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-4 flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.2em] font-semibold text-[#E67E6B] font-work-sans",
					children: "Community"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 text-3xl sm:text-4xl tracking-tight font-medium text-[#2D2422] font-outfit",
					children: "Notes & Reviews"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [polling && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[10px] text-[#A3938F] font-work-sans inline-flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
							size: 10,
							className: "animate-spin"
						}), " syncing..."]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-[#A3938F] font-work-sans",
						children: [
							comments.length,
							" ",
							comments.length === 1 ? "note" : "notes"
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
				onSubmit: submit,
				"data-testid": "comment-form",
				className: "mt-8 bg-white border border-[#F5EBE9] rounded-[2rem] p-6 sm:p-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-10 h-10 rounded-full bg-[#FDE4DD] text-[#E67E6B] inline-flex items-center justify-center font-medium font-work-sans shrink-0",
						children: user ? (user.name || user.email).charAt(0).toUpperCase() : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, {
							size: 16,
							strokeWidth: 1.5
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 space-y-3",
						children: [
							!user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: guestName,
								onChange: (e) => setGuestName(e.target.value),
								placeholder: "Display Name (Optional)",
								"data-testid": "comment-guest-name-input",
								className: "w-full bg-white border border-[#F5EBE9] rounded-xl focus:ring-2 focus:ring-[#E67E6B]/30 focus:border-[#E67E6B] placeholder:text-[#A3938F] px-4 py-2.5 outline-none font-work-sans text-sm"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: text,
								onChange: (e) => setText(e.target.value),
								rows: 3,
								placeholder: "Share your experience…",
								"data-testid": "comment-text-input",
								className: "w-full bg-white border border-[#F5EBE9] rounded-xl focus:ring-2 focus:ring-[#E67E6B]/30 focus:border-[#E67E6B] placeholder:text-[#A3938F] px-4 py-3 outline-none font-work-sans resize-none"
							}),
							!user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-[#A3938F] font-work-sans",
								children: "Posting as a guest. Log in to save your cafe history."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-end",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									disabled: !text.trim(),
									"data-testid": "comment-submit-btn",
									className: "bg-[#E67E6B] text-white hover:bg-[#D96C5A] disabled:opacity-60 px-5 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 font-work-sans font-medium inline-flex items-center gap-2 cursor-pointer",
									children: ["Post comment ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {
										size: 14,
										strokeWidth: 1.5
									})]
								})
							})
						]
					})]
				})
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-10 text-sm text-[#A3938F] font-work-sans text-center",
				children: "Loading comments..."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-10 space-y-6",
				"data-testid": "comments-list",
				children: comments.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-start gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-10 h-10 rounded-full bg-[#FDE4DD] text-[#E67E6B] inline-flex items-center justify-center font-medium font-work-sans shrink-0",
						children: c.isGuest ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, {
							size: 16,
							strokeWidth: 1.5
						}) : c.name.charAt(0).toUpperCase()
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline gap-3 flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium text-[#2D2422] font-outfit",
									children: c.name
								}),
								c.isGuest && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] uppercase tracking-[0.15em] text-[#A3938F] font-work-sans",
									children: "Guest"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-[#A3938F] font-work-sans",
									children: c.date
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-[#6B5C58] font-work-sans leading-relaxed",
							children: c.text
						})]
					})]
				}, c.id))
			})
		]
	});
}
function CafeDetail() {
	const { user } = useAuth();
	const { cafe: initialCafe } = Route.useLoaderData();
	const [cafe, setCafe] = (0, import_react.useState)(initialCafe);
	const [strategy, setStrategy] = (0, import_react.useState)("dynamic");
	const [activeImage, setActiveImage] = (0, import_react.useState)(null);
	const reloadData = async () => {
		const fresh = await fetchCafeByIdOrSlug(cafe.id);
		if (fresh) setCafe(fresh);
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
	}, [cafe.id]);
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape") setActiveImage(null);
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[#FFF7F5]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			activeImage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				onClick: () => setActiveImage(null),
				className: "fixed inset-0 z-[1000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-fade-in",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setActiveImage(null),
					className: "absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all cursor-pointer",
					"aria-label": "Close Lightbox",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 24 })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: activeImage,
					alt: "Enlarged view",
					className: "max-w-full max-h-[90vh] rounded-2xl object-contain shadow-2xl select-none animate-scale-up",
					onClick: (e) => e.stopPropagation()
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "max-w-4xl mx-auto px-6 py-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between items-center flex-wrap gap-4 mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/directory",
							className: "inline-flex items-center gap-2 text-sm text-[#6B5C58] hover:text-[#2D2422] font-work-sans",
							"data-testid": "cafe-back-link",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
								size: 14,
								strokeWidth: 1.5
							}), " Back to directory"]
						}), user && user.isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `text-xs px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-medium font-work-sans shadow-sm transition-all ${strategy === "isr" ? "bg-purple-50 border-purple-200 text-purple-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-1.5 h-1.5 rounded-full ${strategy === "isr" ? "bg-purple-500 animate-pulse" : "bg-emerald-500 animate-ping"}` }), strategy === "isr" ? "Static Cache (ISR Mode)" : "Live SSR Data (Dynamic Mode)"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => setActiveImage(cafe.image),
						className: "rounded-[2rem] overflow-hidden border border-[#F5EBE9] bg-white shadow-sm cursor-zoom-in group relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: cafe.image,
							alt: `Interior of ${cafe.name}`,
							className: "w-full h-[420px] object-cover transition-transform duration-500 group-hover:scale-[1.01]"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "bg-black/60 text-white text-xs px-3.5 py-2 rounded-xl backdrop-blur-sm inline-flex items-center gap-1.5 font-work-sans font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomIn, { size: 14 }), " Zoom Cover Image"]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "mt-10",
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-5xl tracking-tight font-light text-[#2D2422] font-outfit",
								children: cafe.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-center gap-4 text-sm text-[#A3938F] font-work-sans",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
										size: 14,
										strokeWidth: 1.5
									}), cafe.neighborhood]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
										size: 14,
										strokeWidth: 1.5
									}), cafe.hours]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 text-lg text-[#6B5C58] font-work-sans leading-relaxed max-w-2xl",
								children: cafe.blurb
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6 flex flex-wrap gap-2",
								children: cafe.tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-[#6B5C58] border border-[#F5EBE9] rounded-full px-3 py-1 font-work-sans",
									children: t
								}, t))
							})
						]
					}),
					cafe.gallery && cafe.gallery.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-12 border-t border-[#F5EBE9] pt-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xl font-outfit text-[#2D2422] mb-6",
							children: "Gallery"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 sm:grid-cols-3 gap-4",
							children: cafe.gallery.map((img, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => setActiveImage(img),
								className: "rounded-2xl overflow-hidden border border-[#F5EBE9] bg-white aspect-square group relative cursor-zoom-in shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: img,
									alt: `Gallery ${idx + 1} of ${cafe.name}`,
									className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "bg-black/60 text-white text-[10px] px-2.5 py-1.5 rounded-lg backdrop-blur-sm inline-flex items-center gap-1 font-work-sans",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomIn, { size: 10 }), " View Large"]
									})
								})]
							}, idx))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommentsSection, { cafeId: cafe.dbId })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { CafeDetail as component };
