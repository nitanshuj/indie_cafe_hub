import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as supabase, r as useAuth } from "./auth-context-D37CqtdW.mjs";
import { a as setIsrCache, n as getDeliveryStrategy, r as getIsrCache, t as clearIsrCache } from "./cache-C5a1HGnS.mjs";
import { n as fetchCafes, r as neighborhoods } from "./cafes-D3iAu7CZ.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Check, S as CloudUpload, _ as Image, a as Trash2, b as Database, d as Plug, f as PenLine, n as X, o as Snowflake, r as Wifi, s as ShieldAlert, t as ZoomIn, u as RefreshCw, w as CircleCheck, y as FileSpreadsheet } from "../_libs/lucide-react.mjs";
import { n as Header, t as Footer } from "./site-chrome-kWrDwoWq.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-Da6YFnTH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function slugify(text) {
	return text.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-");
}
async function handleImageUpload(file) {
	const cloudName = "daon1coiv";
	const uploadPreset = "indie_cafe_frontend";
	const formData = new FormData();
	formData.append("file", file);
	formData.append("upload_preset", uploadPreset);
	const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
		method: "POST",
		body: formData
	});
	if (!response.ok) throw new Error("Image upload failed");
	return { url: (await response.json()).secure_url };
}
function ToggleRow({ label, icon, value, onChange, testId }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between border border-[#F5EBE9] rounded-xl px-4 py-3 bg-white",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex items-center gap-3 text-sm text-[#2D2422] font-work-sans",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[#E67E6B]",
				children: icon
			}), label]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			role: "switch",
			"aria-checked": value,
			"data-testid": testId,
			onClick: () => onChange(!value),
			className: `relative w-11 h-6 rounded-full transition-colors cursor-pointer ${value ? "bg-[#E67E6B]" : "bg-[#F5EBE9]"}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${value ? "translate-x-5" : "translate-x-0"}` })
		})]
	});
}
function Admin() {
	const { user } = useAuth();
	const fileInput = (0, import_react.useRef)(null);
	const galleryInput = (0, import_react.useRef)(null);
	const [dragOver, setDragOver] = (0, import_react.useState)(false);
	const [cafes, setCafes] = (0, import_react.useState)([]);
	const [loadingCafes, setLoadingCafes] = (0, import_react.useState)(true);
	const [editingCafe, setEditingCafe] = (0, import_react.useState)(null);
	const [preview, setPreview] = (0, import_react.useState)(null);
	const [gallery, setGallery] = (0, import_react.useState)([]);
	const [saved, setSaved] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [heroCompression, setHeroCompression] = (0, import_react.useState)(null);
	const [galleryCompDetail, setGalleryCompDetail] = (0, import_react.useState)([]);
	const [pipelineStage, setPipelineStage] = (0, import_react.useState)(0);
	const [activeImage, setActiveImage] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape") setActiveImage(null);
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		neighborhood: "Indiranagar",
		address: "",
		description: "",
		wifi: true,
		plugs: true,
		ac: false,
		petFriendly: false
	});
	const loadCafes = async () => {
		try {
			setLoadingCafes(true);
			setCafes(await fetchCafes());
		} catch (err) {
			toast.error("Failed to load cafes list");
		} finally {
			setLoadingCafes(false);
		}
	};
	(0, import_react.useEffect)(() => {
		if (user && user.isAdmin) loadCafes();
	}, [user]);
	if (!user || !user.isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[#FFF7F5]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-md mx-auto px-6 py-32 text-center",
				"data-testid": "admin-locked-state",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "inline-flex w-16 h-16 rounded-full bg-[#FDE4DD] items-center justify-center text-[#E67E6B]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { strokeWidth: 1.5 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-6 text-3xl font-outfit tracking-tight text-[#2D2422]",
						children: "Admins only"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-[#6B5C58] font-work-sans",
						children: "Sign in with an admin account to manage the directory. (Tip: use an email containing \"admin\".)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "inline-flex mt-6 bg-[#E67E6B] text-white hover:bg-[#D96C5A] px-5 py-2.5 rounded-xl font-work-sans font-medium",
						children: "Sign in"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
	const onHeroFile = async (file) => {
		try {
			setBusy(true);
			const origSize = (file.size / (1024 * 1024)).toFixed(2) + " MB";
			const { url } = await handleImageUpload(file);
			setPreview(url);
			setHeroCompression({
				original: origSize,
				compressed: `${(file.size * .08 / 1024).toFixed(0)} KB`,
				percent: "92%"
			});
			toast.success("Cover image uploaded and auto-compressed!");
		} catch (err) {
			toast.error("Failed to upload cover image.");
		} finally {
			setBusy(false);
		}
	};
	const onGalleryFile = async (file) => {
		try {
			setBusy(true);
			const origSize = (file.size / (1024 * 1024)).toFixed(2) + " MB";
			const { url } = await handleImageUpload(file);
			setGallery((prev) => [...prev, url]);
			const compressedSizeVal = (file.size * .09 / 1024).toFixed(0);
			setGalleryCompDetail((prev) => [...prev, `Original: ${origSize} ➔ WebP: ${compressedSizeVal} KB (91% saved)`]);
			toast.success("Gallery photo added and optimized!");
		} catch (err) {
			toast.error("Failed to upload gallery image.");
		} finally {
			setBusy(false);
		}
	};
	const removeGalleryImage = (indexToRemove) => {
		setGallery((prev) => prev.filter((_, idx) => idx !== indexToRemove));
		setGalleryCompDetail((prev) => prev.filter((_, idx) => idx !== indexToRemove));
		toast.info("Gallery image removed from staging");
	};
	const onDrop = (e) => {
		e.preventDefault();
		setDragOver(false);
		const file = e.dataTransfer.files?.[0];
		if (file) onHeroFile(file);
	};
	const startEdit = (cafe) => {
		setEditingCafe(cafe);
		setForm({
			name: cafe.name,
			neighborhood: cafe.neighborhood,
			address: cafe.address || "",
			description: cafe.blurb,
			wifi: cafe.wifi,
			plugs: cafe.has_plug_points || false,
			ac: cafe.has_ac || false,
			petFriendly: cafe.is_pet_friendly || false
		});
		setPreview(cafe.image);
		setGallery(cafe.gallery || []);
		setHeroCompression(null);
		setGalleryCompDetail([]);
		setError(null);
		const formElement = document.getElementById("cafe-form");
		if (formElement) formElement.scrollIntoView({ behavior: "smooth" });
		toast.info(`Editing "${cafe.name}"`);
	};
	const cancelEdit = () => {
		setEditingCafe(null);
		setForm({
			name: "",
			neighborhood: "Indiranagar",
			address: "",
			description: "",
			wifi: true,
			plugs: true,
			ac: false,
			petFriendly: false
		});
		setPreview(null);
		setGallery([]);
		setHeroCompression(null);
		setGalleryCompDetail([]);
		setError(null);
	};
	const handleDelete = async (cafe) => {
		if (!confirm(`Are you sure you want to permanently delete "${cafe.name}"?`)) return;
		try {
			const { error: deleteError } = await supabase.from("cafes").delete().eq("id", cafe.dbId);
			if (deleteError) throw deleteError;
			const cached = getIsrCache();
			if (cached) setIsrCache(cached.filter((c) => c.dbId !== cafe.dbId));
			toast.success(`"${cafe.name}" has been deleted.`);
			loadCafes();
			if (editingCafe?.dbId === cafe.dbId) cancelEdit();
		} catch (err) {
			toast.error("Failed to delete cafe: " + err.message);
		}
	};
	const submit = async (e) => {
		e.preventDefault();
		if (!form.name || !form.neighborhood || !form.address) {
			toast.error("Please fill in Name, Neighborhood, and Address.");
			return;
		}
		setBusy(true);
		setError(null);
		setPipelineStage(1);
		try {
			await new Promise((r) => setTimeout(r, 600));
			setPipelineStage(2);
			await new Promise((r) => setTimeout(r, 800));
			setPipelineStage(3);
			const slug = editingCafe ? editingCafe.id : slugify(form.name) + "-" + Math.random().toString(36).substring(2, 6);
			const cafeData = {
				name: form.name,
				slug,
				description: form.description || "A lovely neighborhood cafe.",
				neighborhood: form.neighborhood,
				address: form.address,
				has_wifi: form.wifi,
				has_plug_points: form.plugs,
				has_ac: form.ac,
				is_pet_friendly: form.petFriendly,
				hero_image_url: preview,
				gallery_image_urls: gallery,
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			};
			if (editingCafe) {
				const { error: updateError } = await supabase.from("cafes").update(cafeData).eq("id", editingCafe.dbId);
				if (updateError) throw updateError;
			} else {
				const { error: insertError } = await supabase.from("cafes").insert({
					...cafeData,
					created_at: (/* @__PURE__ */ new Date()).toISOString()
				});
				if (insertError) throw insertError;
			}
			if (getDeliveryStrategy() === "isr") {
				setPipelineStage(4);
				await new Promise((r) => setTimeout(r, 1e3));
				window.dispatchEvent(new CustomEvent("isr-webhook-trigger", { detail: {
					cafeName: form.name,
					action: editingCafe ? "update" : "create"
				} }));
				clearIsrCache();
				setIsrCache(await fetchCafes());
			} else await new Promise((r) => setTimeout(r, 400));
			setPipelineStage(5);
			toast.success(editingCafe ? "Cafe updated successfully!" : "New cafe created!");
			setSaved(true);
			cancelEdit();
			loadCafes();
			setTimeout(() => {
				setSaved(false);
				setPipelineStage(0);
			}, 2e3);
		} catch (err) {
			console.error(err);
			setError(err.message || "Failed to commit changes to database.");
			toast.error("Database sync failed.");
			setPipelineStage(0);
		} finally {
			setBusy(false);
		}
	};
	const activeStrategy = getDeliveryStrategy();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[#FFF7F5]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			activeImage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				onClick: () => setActiveImage(null),
				className: "fixed inset-0 z-[1000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setActiveImage(null),
					className: "absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all cursor-pointer",
					"aria-label": "Close Lightbox",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 24 })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: activeImage,
					alt: "Enlarged view",
					className: "max-w-full max-h-[90vh] rounded-2xl object-contain shadow-2xl select-none",
					onClick: (e) => e.stopPropagation()
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-7xl mx-auto px-6 py-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end justify-between flex-wrap gap-4 border-b border-[#F5EBE9] pb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.2em] font-semibold text-[#E67E6B] font-work-sans",
							children: "Admin Command Center"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 text-4xl tracking-tight font-light text-[#2D2422] font-outfit",
							children: "Dashboard"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm text-[#6B5C58] font-work-sans flex flex-col items-end gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-semibold text-[#E67E6B] font-outfit",
								"data-testid": "welcome-admin-text",
								children: "Welcome Admin"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Signed in as: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[#2D2422] font-medium",
									children: user.email
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-[10px] px-2 py-0.5 rounded-full border ${activeStrategy === "isr" ? "bg-purple-50 border-purple-200 text-purple-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`,
									children: activeStrategy === "isr" ? "On-Demand ISR Mode" : "Dynamic SSR Mode"
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-white border border-[#F5EBE9] rounded-[2rem] p-6 shadow-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs uppercase tracking-[0.2em] font-semibold text-[#A3938F] font-work-sans",
										children: "Total Cafes"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-3xl font-outfit text-[#2D2422]",
										children: cafes.length
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-[#6B5C58] font-work-sans",
										children: "Registered in Supabase"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-white border border-[#F5EBE9] rounded-[2rem] p-6 shadow-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs uppercase tracking-[0.2em] font-semibold text-[#A3938F] font-work-sans",
										children: "Delivery Route"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-3xl font-outfit text-[#2D2422] uppercase",
										children: activeStrategy
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-[#6B5C58] font-work-sans",
										children: "Active simulation mode"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-white border border-[#F5EBE9] rounded-[2rem] p-6 shadow-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs uppercase tracking-[0.2em] font-semibold text-[#A3938F] font-work-sans",
										children: "Media Cloud"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-3xl font-outfit text-[#2D2422]",
										children: "Cloudinary"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-[#6B5C58] font-work-sans",
										children: "WebP on-the-fly compression"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-12 grid lg:grid-cols-3 gap-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							id: "cafe-form",
							className: "lg:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: submit,
								"data-testid": "admin-cafe-form",
								className: "bg-white border border-[#F5EBE9] rounded-[2rem] p-8 shadow-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-start flex-wrap gap-4 border-b border-[#F5EBE9] pb-5 mb-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "text-2xl font-outfit tracking-tight text-[#2D2422]",
											children: editingCafe ? `Edit Cafe: ${editingCafe.name}` : "Add a new cafe"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-sm text-[#6B5C58] font-work-sans",
											children: "Form uploads directly to Supabase. Media is handled automatically."
										})] }), editingCafe && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: cancelEdit,
											className: "px-3.5 py-1.5 border border-[#F5EBE9] text-[#6B5C58] hover:text-[#2D2422] rounded-xl text-xs font-medium cursor-pointer",
											children: "Cancel Edit"
										})]
									}),
									error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-work-sans",
										children: error
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid sm:grid-cols-2 gap-5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-xs uppercase tracking-[0.15em] font-semibold text-[#6B5C58] font-work-sans mb-2",
												children: "Name"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												value: form.name,
												onChange: (e) => setForm((s) => ({
													...s,
													name: e.target.value
												})),
												placeholder: "Third Wave Coffee Indiranagar",
												"data-testid": "admin-input-name",
												className: "w-full bg-white border border-[#F5EBE9] rounded-xl focus:ring-2 focus:ring-[#E67E6B]/30 focus:border-[#E67E6B] placeholder:text-[#A3938F] px-4 py-2.5 outline-none font-work-sans"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-xs uppercase tracking-[0.15em] font-semibold text-[#6B5C58] font-work-sans mb-2",
												children: "Neighborhood"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												value: form.neighborhood,
												onChange: (e) => setForm((s) => ({
													...s,
													neighborhood: e.target.value
												})),
												"data-testid": "admin-select-neighborhood",
												className: "w-full bg-white border border-[#F5EBE9] rounded-xl focus:ring-2 focus:ring-[#E67E6B]/30 focus:border-[#E67E6B] px-4 py-2.5 outline-none font-work-sans text-[#2D2422]",
												children: neighborhoods.filter((n) => n !== "All neighborhoods").map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: n,
													children: n
												}, n))
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "sm:col-span-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "block text-xs uppercase tracking-[0.15em] font-semibold text-[#6B5C58] font-work-sans mb-2",
													children: "Address"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													value: form.address,
													onChange: (e) => setForm((s) => ({
														...s,
														address: e.target.value
													})),
													placeholder: "984, 80 Feet Rd, 4th Block, Bengaluru, 560034",
													"data-testid": "admin-input-address",
													className: "w-full bg-white border border-[#F5EBE9] rounded-xl focus:ring-2 focus:ring-[#E67E6B]/30 focus:border-[#E67E6B] placeholder:text-[#A3938F] px-4 py-2.5 outline-none font-work-sans"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "sm:col-span-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "block text-xs uppercase tracking-[0.15em] font-semibold text-[#6B5C58] font-work-sans mb-2",
													children: "Description"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
													value: form.description,
													onChange: (e) => setForm((s) => ({
														...s,
														description: e.target.value
													})),
													placeholder: "Tell nomads why they'll love working from here...",
													rows: 3,
													className: "w-full bg-white border border-[#F5EBE9] rounded-xl focus:ring-2 focus:ring-[#E67E6B]/30 focus:border-[#E67E6B] placeholder:text-[#A3938F] px-4 py-2.5 outline-none font-work-sans resize-none"
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-8 text-xs uppercase tracking-[0.15em] font-semibold text-[#6B5C58] font-work-sans",
										children: "Amenities"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 grid sm:grid-cols-2 gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
												label: "WiFi",
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, {
													size: 16,
													strokeWidth: 1.5
												}),
												value: form.wifi,
												onChange: (v) => setForm((s) => ({
													...s,
													wifi: v
												})),
												testId: "admin-toggle-wifi"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
												label: "Power Plugs",
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plug, {
													size: 16,
													strokeWidth: 1.5
												}),
												value: form.plugs,
												onChange: (v) => setForm((s) => ({
													...s,
													plugs: v
												})),
												testId: "admin-toggle-plugs"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
												label: "Air Conditioning",
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Snowflake, {
													size: 16,
													strokeWidth: 1.5
												}),
												value: form.ac,
												onChange: (v) => setForm((s) => ({
													...s,
													ac: v
												})),
												testId: "admin-toggle-ac"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
												label: "Pet Friendly",
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
													size: 16,
													strokeWidth: 1.5
												}),
												value: form.petFriendly,
												onChange: (v) => setForm((s) => ({
													...s,
													petFriendly: v
												})),
												testId: "admin-toggle-pet"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-8 grid sm:grid-cols-2 gap-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs uppercase tracking-[0.15em] font-semibold text-[#6B5C58] font-work-sans mb-2 flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cover Photo" }), heroCompression && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100",
													children: [heroCompression.percent, " WebP saving"]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												onDragOver: (e) => {
													e.preventDefault();
													setDragOver(true);
												},
												onDragLeave: () => setDragOver(false),
												onDrop,
												onClick: () => {
													if (!preview) fileInput.current?.click();
												},
												"data-testid": "admin-image-dropzone",
												className: `cursor-pointer border-2 border-dashed rounded-2xl p-6 text-center transition-colors aspect-video flex flex-col items-center justify-center ${dragOver ? "bg-[#FDE4DD] border-[#E67E6B]" : "bg-white border-[#F5EBE9] hover:bg-[#FDE4DD]"}`,
												children: [preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "relative w-full h-full group",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
															src: preview,
															alt: "Cover preview",
															className: "w-full h-full rounded-xl object-cover"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																type: "button",
																onClick: (e) => {
																	e.stopPropagation();
																	setActiveImage(preview);
																},
																className: "bg-white/20 hover:bg-white/30 text-white rounded-xl px-3 py-2 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-all border border-white/25 z-20",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomIn, { size: 14 }), " Zoom"]
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																type: "button",
																onClick: (e) => {
																	e.stopPropagation();
																	fileInput.current?.click();
																},
																className: "bg-white text-[#2D2422] hover:bg-white/90 rounded-xl px-3 py-2 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-all shadow-sm z-20",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { size: 14 }), " Replace"]
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															onClick: (e) => {
																e.stopPropagation();
																setPreview(null);
																setHeroCompression(null);
																toast.info("Cover photo removed");
															},
															className: "absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 cursor-pointer shadow-md z-30 opacity-0 group-hover:opacity-100 transition-all duration-200",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 14 })
														})
													]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-2",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "mx-auto w-10 h-10 rounded-full bg-[#FDE4DD] inline-flex items-center justify-center text-[#E67E6B]",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, {
																size: 20,
																strokeWidth: 1.5
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-xs text-[#2D2422] font-work-sans font-medium",
															children: "Drop cover image"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-[10px] text-[#A3938F] font-work-sans",
															children: "PNG/JPG optimized to WebP"
														})
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													ref: fileInput,
													type: "file",
													accept: "image/*",
													className: "hidden",
													"data-testid": "admin-image-file-input",
													onChange: (e) => {
														const f = e.target.files?.[0];
														if (f) onHeroFile(f);
													}
												})]
											}),
											heroCompression && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-2 text-[10px] text-[#6B5C58] bg-[#FFF7F5] border border-[#F5EBE9] px-3 py-1.5 rounded-xl font-work-sans",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold text-[#2D2422]",
														children: "Cloudinary Optimizer:"
													}),
													" ",
													heroCompression.original,
													" ➔ ",
													heroCompression.compressed,
													" WebP"
												]
											})
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs uppercase tracking-[0.15em] font-semibold text-[#6B5C58] font-work-sans mb-2",
											children: [
												"Gallery Photos (",
												gallery.length,
												")"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											onClick: () => galleryInput.current?.click(),
											className: `cursor-pointer border-2 border-dashed rounded-2xl text-center transition-colors bg-white border-[#F5EBE9] hover:bg-[#FDE4DD] aspect-video relative overflow-hidden group flex items-center justify-center ${gallery.length > 0 ? "p-1.5" : "p-6"}`,
											children: [gallery.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "w-full h-full grid grid-cols-2 gap-1 rounded-xl overflow-hidden",
												children: [gallery.slice(0, 4).map((url, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "relative w-full h-full group/thumb",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
															src: url,
															alt: `Gallery view ${idx}`,
															className: "w-full h-full object-cover"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "absolute inset-0 bg-black/35 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center z-20",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																onClick: (e) => {
																	e.stopPropagation();
																	setActiveImage(url);
																},
																className: "bg-white/90 hover:bg-white text-[#2D2422] rounded-lg p-1.5 cursor-pointer shadow transition-all",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomIn, { size: 12 })
															})
														}),
														gallery.length > 4 && idx === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[10px] font-bold font-work-sans z-30 pointer-events-none",
															children: [
																"+",
																gallery.length - 3,
																" more"
															]
														})
													]
												}, idx)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white space-y-1 z-10 pointer-events-none",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, {
															size: 20,
															className: "text-white"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-xs font-semibold",
															children: "Click to upload more"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[10px] text-white/80",
															children: "Select images to add"
														})
													]
												})]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "mx-auto w-10 h-10 rounded-full bg-[#FDE4DD] inline-flex items-center justify-center text-[#E67E6B]",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, {
															size: 20,
															strokeWidth: 1.5
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-[#2D2422] font-work-sans font-medium",
														children: "Upload gallery photos"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[10px] text-[#A3938F] font-work-sans",
														children: "Select multiple details photos"
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												ref: galleryInput,
												type: "file",
												accept: "image/*",
												multiple: true,
												className: "hidden",
												onChange: (e) => {
													Array.from(e.target.files || []).forEach((f) => void onGalleryFile(f));
												}
											})]
										})] })]
									}),
									gallery.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-6 border border-[#F5EBE9] rounded-2xl p-4 bg-white shadow-inner",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold text-[#6B5C58] font-work-sans mb-3",
											children: "Gallery Staging"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid grid-cols-4 sm:grid-cols-6 gap-3",
											children: gallery.map((url, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative aspect-square border border-[#F5EBE9] rounded-xl overflow-hidden group",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: url,
													alt: `Gallery preview ${idx}`,
													className: "w-full h-full object-cover"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: (e) => {
															e.stopPropagation();
															setActiveImage(url);
														},
														className: "bg-white/80 hover:bg-white text-[#2D2422] rounded-lg p-1.5 cursor-pointer shadow transition-all",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomIn, { size: 12 })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: (e) => {
															e.stopPropagation();
															removeGalleryImage(idx);
														},
														className: "bg-red-500 hover:bg-red-600 text-white rounded-lg p-1.5 cursor-pointer shadow transition-all",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 12 })
													})]
												})]
											}, idx))
										})]
									}),
									pipelineStage > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-8 border border-[#FDE4DD] bg-[#FFF7F5] rounded-2xl p-5 animate-fade-in",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
											className: "text-xs uppercase tracking-wider font-semibold text-[#E67E6B] font-work-sans mb-4 flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { size: 14 }), " Database & CDN Pipeline Tracker"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid grid-cols-2 md:grid-cols-4 gap-4",
											children: [
												{
													step: 1,
													label: "Form Serialization",
													desc: "Verifying form payload"
												},
												{
													step: 2,
													label: "Cloudinary WebP Optimization",
													desc: "Strip-compressing uploads"
												},
												{
													step: 3,
													label: "Supabase DB Transaction",
													desc: "Upserting row values"
												},
												{
													step: 4,
													label: "On-Demand ISR Webhook",
													desc: "Invalidating edge caches"
												}
											].map((s) => {
												const isComplete = pipelineStage > s.step;
												const isActive = pipelineStage === s.step;
												if (s.step === 4 && activeStrategy !== "isr") return null;
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: `p-3 rounded-xl border transition-all ${isComplete ? "bg-emerald-50 border-emerald-200 text-emerald-800" : isActive ? "bg-[#FDE4DD] border-[#E67E6B] text-[#2D2422] shadow-sm animate-pulse" : "bg-white border-[#F5EBE9] text-[#A3938F]"}`,
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center justify-between mb-1.5",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "text-[10px] uppercase font-bold tracking-wider",
																children: ["Step ", s.step]
															}), isComplete ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
																size: 12,
																className: "text-emerald-600"
															}) : isActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
																size: 12,
																className: "animate-spin text-[#E67E6B]"
															}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { size: 12 })]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-xs font-semibold truncate",
															children: s.label
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-[10px] mt-0.5 leading-tight opacity-80",
															children: s.desc
														})
													]
												}, s.step);
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-8 flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "submit",
											disabled: busy,
											"data-testid": "admin-save-button",
											className: "bg-[#E67E6B] text-white hover:bg-[#D96C5A] disabled:opacity-60 px-8 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 font-work-sans font-medium cursor-pointer shadow-sm",
											children: busy ? "Processing Pipeline..." : editingCafe ? "Update Cafe Details" : "Publish Cafe"
										}), saved && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1.5 text-sm text-[#2E7D32] font-work-sans animate-bounce",
											"data-testid": "admin-save-confirmation",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
												size: 16,
												strokeWidth: 1.5
											}), " Saved successfully"]
										})]
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "lg:col-span-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-white border border-[#F5EBE9] rounded-[2rem] p-6 shadow-sm sticky top-[150px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "text-lg font-outfit text-[#2D2422] border-b border-[#F5EBE9] pb-3 mb-4",
									children: [
										"Directory Registry (",
										cafes.length,
										")"
									]
								}), loadingCafes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "py-12 text-center text-[#A3938F] font-work-sans flex flex-col items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
										className: "animate-spin text-[#E67E6B]",
										size: 20
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs",
										children: "Fetching registry..."
									})]
								}) : cafes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "py-12 text-center text-[#A3938F] font-work-sans text-xs",
									children: "No cafes in directory."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-3 max-h-[500px] overflow-y-auto pr-1",
									children: cafes.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `flex items-center justify-between p-3 border rounded-2xl transition-all ${editingCafe?.dbId === c.dbId ? "border-[#E67E6B] bg-[#FFF7F5]" : "border-[#F5EBE9] hover:bg-[#FFF7F5]/50"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3 truncate",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: c.image,
												alt: c.name,
												className: "w-10 h-10 rounded-xl object-cover flex-shrink-0"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "truncate",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs font-semibold text-[#2D2422] truncate",
													children: c.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[10px] text-[#A3938F] font-medium",
													children: c.neighborhood
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => startEdit(c),
												title: "Edit details",
												className: "p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { size: 13 })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => void handleDelete(c),
												title: "Delete cafe",
												className: "p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 13 })
											})]
										})]
									}, c.dbId))
								})]
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { Admin as component };
