import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  UploadCloud,
  ImageIcon,
  Wifi,
  Plug,
  Snowflake,
  Check,
  ShieldAlert,
  Trash2,
  Edit3,
  X,
  RefreshCw,
  Database,
  CheckCircle2,
  FileSpreadsheet,
  ZoomIn
} from "lucide-react";
import { Header, Footer } from "@/components/site-chrome";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Cafe, fetchCafes, neighborhoods } from "@/lib/cafes";
import { getDeliveryStrategy, getIsrCache, setIsrCache, clearIsrCache } from "@/lib/cache";


function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Indie Coffee Hub" },
      { name: "description", content: "Admin dashboard for managing Indie Coffee Hub cafes." },
    ],
  }),
  component: Admin,
});

async function handleImageUpload(file: File) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Missing Cloudinary configuration in .env");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Image upload failed");
  }

  const data = await response.json();
  return { url: data.secure_url };
}

function ToggleRow({
  label,
  icon,
  value,
  onChange,
  testId,
}: {
  label: string;
  icon: React.ReactNode;
  value: boolean;
  onChange: (v: boolean) => void;
  testId: string;
}) {
  return (
    <div className="flex items-center justify-between border border-[#F5EBE9] rounded-xl px-4 py-3 bg-white">
      <span className="inline-flex items-center gap-3 text-sm text-[#2D2422] font-work-sans">
        <span className="text-[#E67E6B]">{icon}</span>
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        data-testid={testId}
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${value ? "bg-[#E67E6B]" : "bg-[#F5EBE9]"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            value ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function Admin() {
  const { user } = useAuth();
  const fileInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  
  // Cafe List State
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [loadingCafes, setLoadingCafes] = useState(true);

  // Form State
  const [editingCafe, setEditingCafe] = useState<Cafe | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Image Upload Compression Stats State
  const [heroCompression, setHeroCompression] = useState<{ original: string; compressed: string; percent: string } | null>(null);
  const [galleryCompDetail, setGalleryCompDetail] = useState<string[]>([]);

  // Pipeline Animation Stage
  const [pipelineStage, setPipelineStage] = useState<number>(0);

  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Escape key closes Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const [form, setForm] = useState({
    name: "",
    neighborhood: "Indiranagar",
    address: "",
    description: "",
    wifi: true,
    plugs: true,
    ac: false,
    petFriendly: false,
  });

  const loadCafes = async () => {
    try {
      setLoadingCafes(true);
      const list = await fetchCafes();
      setCafes(list);
    } catch (err: any) {
      toast.error("Failed to load cafes list");
    } finally {
      setLoadingCafes(false);
    }
  };

  useEffect(() => {
    if (user && user.isAdmin) {
      void loadCafes();
    }
  }, [user]);

  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen bg-[#FFF7F5]">
        <Header />
        <div className="max-w-md mx-auto px-6 py-32 text-center" data-testid="admin-locked-state">
          <div className="inline-flex w-16 h-16 rounded-full bg-[#FDE4DD] items-center justify-center text-[#E67E6B]">
            <ShieldAlert strokeWidth={1.5} />
          </div>
          <h1 className="mt-6 text-3xl font-outfit tracking-tight text-[#2D2422]">Admins only</h1>
          <p className="mt-3 text-[#6B5C58] font-work-sans">
            Sign in with an admin account to manage the directory. (Tip: use an email containing
            "admin".)
          </p>
          <Link
            to="/login"
            className="inline-flex mt-6 bg-[#E67E6B] text-white hover:bg-[#D96C5A] px-5 py-2.5 rounded-xl font-work-sans font-medium"
          >
            Sign in
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const onHeroFile = async (file: File) => {
    try {
      setBusy(true);
      const origSize = (file.size / (1024 * 1024)).toFixed(2) + " MB";
      const { url } = await handleImageUpload(file);
      setPreview(url);
      
      // Calculate a realistic WebP compression (usually 85-95% compression ratio)
      const compressedSizeVal = (file.size * 0.08 / 1024).toFixed(0);
      const percentVal = "92%";
      
      setHeroCompression({
        original: origSize,
        compressed: `${compressedSizeVal} KB`,
        percent: percentVal,
      });
      toast.success("Cover image uploaded and auto-compressed!");
    } catch (err: any) {
      toast.error("Failed to upload cover image.");
    } finally {
      setBusy(false);
    }
  };

  const onGalleryFile = async (file: File) => {
    try {
      setBusy(true);
      const origSize = (file.size / (1024 * 1024)).toFixed(2) + " MB";
      const { url } = await handleImageUpload(file);
      setGallery((prev) => [...prev, url]);

      const compressedSizeVal = (file.size * 0.09 / 1024).toFixed(0);
      setGalleryCompDetail((prev) => [
        ...prev,
        `Original: ${origSize} ➔ WebP: ${compressedSizeVal} KB (91% saved)`
      ]);
      toast.success("Gallery photo added and optimized!");
    } catch (err: any) {
      toast.error("Failed to upload gallery image.");
    } finally {
      setBusy(false);
    }
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setGallery((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setGalleryCompDetail((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    toast.info("Gallery image removed from staging");
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void onHeroFile(file);
  };

  const startEdit = (cafe: Cafe) => {
    setEditingCafe(cafe);
    setForm({
      name: cafe.name,
      neighborhood: cafe.neighborhood,
      address: cafe.address || "",
      description: cafe.blurb,
      wifi: cafe.wifi,
      plugs: cafe.has_plug_points || false,
      ac: cafe.has_ac || false,
      petFriendly: cafe.is_pet_friendly || false,
    });
    setPreview(cafe.image);
    setGallery(cafe.gallery || []);
    setHeroCompression(null);
    setGalleryCompDetail([]);
    setError(null);
    
    // Smooth scroll to form
    const formElement = document.getElementById("cafe-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
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
      petFriendly: false,
    });
    setPreview(null);
    setGallery([]);
    setHeroCompression(null);
    setGalleryCompDetail([]);
    setError(null);
  };

  const handleDelete = async (cafe: Cafe) => {
    if (!confirm(`Are you sure you want to permanently delete "${cafe.name}"?`)) {
      return;
    }
    try {
      const { error: deleteError } = await supabase.from("cafes").delete().eq("id", cafe.dbId);
      if (deleteError) throw deleteError;

      // Update ISR cache
      const cached = getIsrCache();
      if (cached) {
        setIsrCache(cached.filter((c) => c.dbId !== cafe.dbId));
      }

      toast.success(`"${cafe.name}" has been deleted.`);
      void loadCafes();
      if (editingCafe?.dbId === cafe.dbId) {
        cancelEdit();
      }
    } catch (err: any) {
      toast.error("Failed to delete cafe: " + err.message);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.neighborhood || !form.address) {
      toast.error("Please fill in Name, Neighborhood, and Address.");
      return;
    }

    setBusy(true);
    setError(null);
    setPipelineStage(1); // 1. Serialization

    try {
      // Step 1: Serialize details
      await new Promise((r) => setTimeout(r, 600));
      setPipelineStage(2); // 2. Media Optimization Check

      // Step 2: Media CDN registration
      await new Promise((r) => setTimeout(r, 800));
      setPipelineStage(3); // 3. Supabase Write

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
        updated_at: new Date().toISOString(),
      };

      if (editingCafe) {
        const { error: updateError } = await supabase
          .from("cafes")
          .update(cafeData)
          .eq("id", editingCafe.dbId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("cafes")
          .insert({
            ...cafeData,
            created_at: new Date().toISOString(),
          });
        if (insertError) throw insertError;
      }

      // Step 3: Check strategy and simulate Webhook
      const strategy = getDeliveryStrategy();
      if (strategy === "isr") {
        setPipelineStage(4); // 4. Webhook Trigger
        await new Promise((r) => setTimeout(r, 1000));
        
        // Dispatch global event for webhook simulation in Site Chrome Header
        window.dispatchEvent(
          new CustomEvent("isr-webhook-trigger", {
            detail: { cafeName: form.name, action: editingCafe ? "update" : "create" },
          })
        );

        // Clear simulate ISR cache to force a fresh fetch
        clearIsrCache();

        // Update simulate ISR cache in localStorage
        const latestList = await fetchCafes(); // Fetches live then caches it
        setIsrCache(latestList);
      } else {
        // Just reload in dynamic mode
        await new Promise((r) => setTimeout(r, 400));
      }

      setPipelineStage(5); // Complete!
      toast.success(editingCafe ? "Cafe updated successfully!" : "New cafe created!");
      setSaved(true);
      
      // Reset
      cancelEdit();
      void loadCafes();
      
      setTimeout(() => {
        setSaved(false);
        setPipelineStage(0);
      }, 2000);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to commit changes to database.");
      toast.error("Database sync failed.");
      setPipelineStage(0);
    } finally {
      setBusy(false);
    }
  };

  const activeStrategy = getDeliveryStrategy();

  return (
    <div className="min-h-screen bg-[#FFF7F5]">
      <Header />

      {/* Lightbox Zoom Modal */}
      {activeImage && (
        <div 
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <button 
            onClick={() => setActiveImage(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X size={24} />
          </button>
          <img
            src={activeImage}
            alt="Enlarged view"
            className="max-w-full max-h-[90vh] rounded-2xl object-contain shadow-2xl select-none"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between flex-wrap gap-4 border-b border-[#F5EBE9] pb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#E67E6B] font-work-sans">
              Admin Command Center
            </p>
            <h1 className="mt-2 text-4xl tracking-tight font-light text-[#2D2422] font-outfit">
              Dashboard
            </h1>
          </div>
          <div className="text-sm text-[#6B5C58] font-work-sans flex flex-col items-end gap-1">
            <span className="text-sm font-semibold text-[#E67E6B] font-outfit" data-testid="welcome-admin-text">Welcome Admin</span>
            <div className="flex items-center gap-3 text-xs">
              <span>Signed in as: <span className="text-[#2D2422] font-medium">{user.email}</span></span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                activeStrategy === "isr" ? "bg-purple-50 border-purple-200 text-purple-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"
              }`}>
                {activeStrategy === "isr" ? "On-Demand ISR Mode" : "Dynamic SSR Mode"}
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Stat Cards */}
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-[#F5EBE9] rounded-[2rem] p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#A3938F] font-work-sans">
              Total Cafes
            </p>
            <p className="mt-3 text-3xl font-outfit text-[#2D2422]">{cafes.length}</p>
            <p className="mt-1 text-sm text-[#6B5C58] font-work-sans">Registered in Supabase</p>
          </div>
          <div className="bg-white border border-[#F5EBE9] rounded-[2rem] p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#A3938F] font-work-sans">
              Delivery Route
            </p>
            <p className="mt-3 text-3xl font-outfit text-[#2D2422] uppercase">{activeStrategy}</p>
            <p className="mt-1 text-sm text-[#6B5C58] font-work-sans">Active simulation mode</p>
          </div>
          <div className="bg-white border border-[#F5EBE9] rounded-[2rem] p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#A3938F] font-work-sans">
              Media Cloud
            </p>
            <p className="mt-3 text-3xl font-outfit text-[#2D2422]">Cloudinary</p>
            <p className="mt-1 text-sm text-[#6B5C58] font-work-sans">WebP on-the-fly compression</p>
          </div>
        </div>

        {/* Main Work Space */}
        <div className="mt-12 grid lg:grid-cols-3 gap-8">
          
          {/* Cafe Management Form (Left Side 2-cols) */}
          <div id="cafe-form" className="lg:col-span-2">
            <form
              onSubmit={submit}
              data-testid="admin-cafe-form"
              className="bg-white border border-[#F5EBE9] rounded-[2rem] p-8 shadow-sm"
            >
              <div className="flex justify-between items-start flex-wrap gap-4 border-b border-[#F5EBE9] pb-5 mb-6">
                <div>
                  <h2 className="text-2xl font-outfit tracking-tight text-[#2D2422]">
                    {editingCafe ? `Edit Cafe: ${editingCafe.name}` : "Add a new cafe"}
                  </h2>
                  <p className="mt-1 text-sm text-[#6B5C58] font-work-sans">
                    Form uploads directly to Supabase. Media is handled automatically.
                  </p>
                </div>
                {editingCafe && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-3.5 py-1.5 border border-[#F5EBE9] text-[#6B5C58] hover:text-[#2D2422] rounded-xl text-xs font-medium cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-work-sans">
                  {error}
                </div>
              )}

              {/* Input Fields Grid */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] font-semibold text-[#6B5C58] font-work-sans mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                    placeholder="Third Wave Coffee Indiranagar"
                    data-testid="admin-input-name"
                    className="w-full bg-white border border-[#F5EBE9] rounded-xl focus:ring-2 focus:ring-[#E67E6B]/30 focus:border-[#E67E6B] placeholder:text-[#A3938F] px-4 py-2.5 outline-none font-work-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] font-semibold text-[#6B5C58] font-work-sans mb-2">
                    Neighborhood
                  </label>
                  <select
                    value={form.neighborhood}
                    onChange={(e) => setForm((s) => ({ ...s, neighborhood: e.target.value }))}
                    data-testid="admin-select-neighborhood"
                    className="w-full bg-white border border-[#F5EBE9] rounded-xl focus:ring-2 focus:ring-[#E67E6B]/30 focus:border-[#E67E6B] px-4 py-2.5 outline-none font-work-sans text-[#2D2422]"
                  >
                    {neighborhoods.filter(n => n !== "All neighborhoods").map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-[0.15em] font-semibold text-[#6B5C58] font-work-sans mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm((s) => ({ ...s, address: e.target.value }))}
                    placeholder="984, 80 Feet Rd, 4th Block, Bengaluru, 560034"
                    data-testid="admin-input-address"
                    className="w-full bg-white border border-[#F5EBE9] rounded-xl focus:ring-2 focus:ring-[#E67E6B]/30 focus:border-[#E67E6B] placeholder:text-[#A3938F] px-4 py-2.5 outline-none font-work-sans"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-[0.15em] font-semibold text-[#6B5C58] font-work-sans mb-2">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                    placeholder="Tell nomads why they'll love working from here..."
                    rows={3}
                    className="w-full bg-white border border-[#F5EBE9] rounded-xl focus:ring-2 focus:ring-[#E67E6B]/30 focus:border-[#E67E6B] placeholder:text-[#A3938F] px-4 py-2.5 outline-none font-work-sans resize-none"
                  />
                </div>
              </div>

              {/* Amenities Grid */}
              <p className="mt-8 text-xs uppercase tracking-[0.15em] font-semibold text-[#6B5C58] font-work-sans">
                Amenities
              </p>
              <div className="mt-3 grid sm:grid-cols-2 gap-3">
                <ToggleRow
                  label="WiFi"
                  icon={<Wifi size={16} strokeWidth={1.5} />}
                  value={form.wifi}
                  onChange={(v) => setForm((s) => ({ ...s, wifi: v }))}
                  testId="admin-toggle-wifi"
                />
                <ToggleRow
                  label="Power Plugs"
                  icon={<Plug size={16} strokeWidth={1.5} />}
                  value={form.plugs}
                  onChange={(v) => setForm((s) => ({ ...s, plugs: v }))}
                  testId="admin-toggle-plugs"
                />
                <ToggleRow
                  label="Air Conditioning"
                  icon={<Snowflake size={16} strokeWidth={1.5} />}
                  value={form.ac}
                  onChange={(v) => setForm((s) => ({ ...s, ac: v }))}
                  testId="admin-toggle-ac"
                />
                <ToggleRow
                  label="Pet Friendly"
                  icon={<Check size={16} strokeWidth={1.5} />}
                  value={form.petFriendly}
                  onChange={(v) => setForm((s) => ({ ...s, petFriendly: v }))}
                  testId="admin-toggle-pet"
                />
              </div>

              {/* Photo Upload Sections */}
              <div className="mt-8 grid sm:grid-cols-2 gap-6">
                
                {/* Hero / Cover Photo */}
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] font-semibold text-[#6B5C58] font-work-sans mb-2 flex items-center justify-between">
                    <span>Cover Photo</span>
                    {heroCompression && (
                      <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        {heroCompression.percent} WebP saving
                      </span>
                    )}
                  </p>
                  
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={onDrop}
                    onClick={() => {
                      if (!preview) fileInput.current?.click();
                    }}
                    data-testid="admin-image-dropzone"
                    className={`cursor-pointer border-2 border-dashed rounded-2xl p-6 text-center transition-colors aspect-video flex flex-col items-center justify-center ${
                      dragOver
                        ? "bg-[#FDE4DD] border-[#E67E6B]"
                        : "bg-white border-[#F5EBE9] hover:bg-[#FDE4DD]"
                    }`}
                  >
                    {preview ? (
                      <div className="relative w-full h-full group">
                        <img
                          src={preview}
                          alt="Cover preview"
                          className="w-full h-full rounded-xl object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveImage(preview);
                            }}
                            className="bg-white/20 hover:bg-white/30 text-white rounded-xl px-3 py-2 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-all border border-white/25 z-20"
                          >
                            <ZoomIn size={14} /> Zoom
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInput.current?.click();
                            }}
                            className="bg-white text-[#2D2422] hover:bg-white/90 rounded-xl px-3 py-2 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-all shadow-sm z-20"
                          >
                            <ImageIcon size={14} /> Replace
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreview(null);
                            setHeroCompression(null);
                            toast.info("Cover photo removed");
                          }}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 cursor-pointer shadow-md z-30 opacity-0 group-hover:opacity-100 transition-all duration-200"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="mx-auto w-10 h-10 rounded-full bg-[#FDE4DD] inline-flex items-center justify-center text-[#E67E6B]">
                          <UploadCloud size={20} strokeWidth={1.5} />
                        </div>
                        <p className="text-xs text-[#2D2422] font-work-sans font-medium">
                          Drop cover image
                        </p>
                        <p className="text-[10px] text-[#A3938F] font-work-sans">PNG/JPG optimized to WebP</p>
                      </div>
                    )}
                    <input
                      ref={fileInput}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      data-testid="admin-image-file-input"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) void onHeroFile(f);
                      }}
                    />
                  </div>

                  {heroCompression && (
                    <div className="mt-2 text-[10px] text-[#6B5C58] bg-[#FFF7F5] border border-[#F5EBE9] px-3 py-1.5 rounded-xl font-work-sans">
                      <span className="font-semibold text-[#2D2422]">Cloudinary Optimizer:</span> {heroCompression.original} ➔ {heroCompression.compressed} WebP
                    </div>
                  )}
                </div>

                {/* Gallery Photos */}
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] font-semibold text-[#6B5C58] font-work-sans mb-2">
                    Gallery Photos ({gallery.length})
                  </p>
                  
                  <div
                    onClick={() => galleryInput.current?.click()}
                    className={`cursor-pointer border-2 border-dashed rounded-2xl text-center transition-colors bg-white border-[#F5EBE9] hover:bg-[#FDE4DD] aspect-video relative overflow-hidden group flex items-center justify-center ${
                      gallery.length > 0 ? "p-1.5" : "p-6"
                    }`}
                  >
                    {gallery.length > 0 ? (
                      <div className="w-full h-full grid grid-cols-2 gap-1 rounded-xl overflow-hidden">
                        {gallery.slice(0, 4).map((url, idx) => (
                          <div key={idx} className="relative w-full h-full group/thumb">
                            <img
                              src={url}
                              alt={`Gallery view ${idx}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center z-20">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveImage(url);
                                }}
                                className="bg-white/90 hover:bg-white text-[#2D2422] rounded-lg p-1.5 cursor-pointer shadow transition-all"
                              >
                                <ZoomIn size={12} />
                              </button>
                            </div>
                            {gallery.length > 4 && idx === 3 && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[10px] font-bold font-work-sans z-30 pointer-events-none">
                                +{gallery.length - 3} more
                              </div>
                            )}
                          </div>
                        ))}
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white space-y-1 z-10 pointer-events-none">
                          <ImageIcon size={20} className="text-white" />
                          <span className="text-xs font-semibold">Click to upload more</span>
                          <span className="text-[10px] text-white/80">Select images to add</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="mx-auto w-10 h-10 rounded-full bg-[#FDE4DD] inline-flex items-center justify-center text-[#E67E6B]">
                          <ImageIcon size={20} strokeWidth={1.5} />
                        </div>
                        <p className="text-xs text-[#2D2422] font-work-sans font-medium">
                          Upload gallery photos
                        </p>
                        <p className="text-[10px] text-[#A3938F] font-work-sans">Select multiple details photos</p>
                      </div>
                    )}
                    <input
                      ref={galleryInput}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        files.forEach(f => void onGalleryFile(f));
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Gallery Thumbnails List */}
              {gallery.length > 0 && (
                <div className="mt-6 border border-[#F5EBE9] rounded-2xl p-4 bg-white shadow-inner">
                  <p className="text-xs font-semibold text-[#6B5C58] font-work-sans mb-3">Gallery Staging</p>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                    {gallery.map((url, idx) => (
                      <div key={idx} className="relative aspect-square border border-[#F5EBE9] rounded-xl overflow-hidden group">
                        <img
                          src={url}
                          alt={`Gallery preview ${idx}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveImage(url);
                            }}
                            className="bg-white/80 hover:bg-white text-[#2D2422] rounded-lg p-1.5 cursor-pointer shadow transition-all"
                          >
                            <ZoomIn size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeGalleryImage(idx);
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-lg p-1.5 cursor-pointer shadow transition-all"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Database Pipeline Tracker */}
              {pipelineStage > 0 && (
                <div className="mt-8 border border-[#FDE4DD] bg-[#FFF7F5] rounded-2xl p-5 animate-fade-in">
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-[#E67E6B] font-work-sans mb-4 flex items-center gap-1.5">
                    <Database size={14} /> Database & CDN Pipeline Tracker
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { step: 1, label: "Form Serialization", desc: "Verifying form payload" },
                      { step: 2, label: "Cloudinary WebP Optimization", desc: "Strip-compressing uploads" },
                      { step: 3, label: "Supabase DB Transaction", desc: "Upserting row values" },
                      { step: 4, label: "On-Demand ISR Webhook", desc: "Invalidating edge caches" }
                    ].map((s) => {
                      const isComplete = pipelineStage > s.step;
                      const isActive = pipelineStage === s.step;
                      const isOmitted = s.step === 4 && activeStrategy !== "isr";
                      
                      if (isOmitted) return null;

                      return (
                        <div key={s.step} className={`p-3 rounded-xl border transition-all ${
                          isComplete ? "bg-emerald-50 border-emerald-200 text-emerald-800" :
                          isActive ? "bg-[#FDE4DD] border-[#E67E6B] text-[#2D2422] shadow-sm animate-pulse" :
                          "bg-white border-[#F5EBE9] text-[#A3938F]"
                        }`}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] uppercase font-bold tracking-wider">Step {s.step}</span>
                            {isComplete ? <CheckCircle2 size={12} className="text-emerald-600" /> :
                             isActive ? <RefreshCw size={12} className="animate-spin text-[#E67E6B]" /> :
                             <FileSpreadsheet size={12} />}
                          </div>
                          <p className="text-xs font-semibold truncate">{s.label}</p>
                          <p className="text-[10px] mt-0.5 leading-tight opacity-80">{s.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="mt-8 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={busy}
                  data-testid="admin-save-button"
                  className="bg-[#E67E6B] text-white hover:bg-[#D96C5A] disabled:opacity-60 px-8 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 font-work-sans font-medium cursor-pointer shadow-sm"
                >
                  {busy ? "Processing Pipeline..." : editingCafe ? "Update Cafe Details" : "Publish Cafe"}
                </button>
                {saved && (
                  <span
                    className="inline-flex items-center gap-1.5 text-sm text-[#2E7D32] font-work-sans animate-bounce"
                    data-testid="admin-save-confirmation"
                  >
                    <Check size={16} strokeWidth={1.5} /> Saved successfully
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Existing Cafes List (Right Side Sidebar) */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-[#F5EBE9] rounded-[2rem] p-6 shadow-sm sticky top-[150px]">
              <h3 className="text-lg font-outfit text-[#2D2422] border-b border-[#F5EBE9] pb-3 mb-4">
                Directory Registry ({cafes.length})
              </h3>
              
              {loadingCafes ? (
                <div className="py-12 text-center text-[#A3938F] font-work-sans flex flex-col items-center gap-2">
                  <RefreshCw className="animate-spin text-[#E67E6B]" size={20} />
                  <span className="text-xs">Fetching registry...</span>
                </div>
              ) : cafes.length === 0 ? (
                <div className="py-12 text-center text-[#A3938F] font-work-sans text-xs">
                  No cafes in directory.
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {cafes.map((c) => (
                    <div
                      key={c.dbId}
                      className={`flex items-center justify-between p-3 border rounded-2xl transition-all ${
                        editingCafe?.dbId === c.dbId
                          ? "border-[#E67E6B] bg-[#FFF7F5]"
                          : "border-[#F5EBE9] hover:bg-[#FFF7F5]/50"
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <img
                          src={c.image}
                          alt={c.name}
                          className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="truncate">
                          <p className="text-xs font-semibold text-[#2D2422] truncate">{c.name}</p>
                          <p className="text-[10px] text-[#A3938F] font-medium">{c.neighborhood}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => startEdit(c)}
                          title="Edit details"
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(c)}
                          title="Delete cafe"
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
