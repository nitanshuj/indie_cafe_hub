import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { createServerFn } from "@tanstack/react-start";
import {
  Coffee,
  UploadCloud,
  ImageIcon,
  Wifi,
  Plug,
  Snowflake,
  Check,
  ArrowRight,
  X,
  Edit3,
  ExternalLink,
} from "lucide-react";
import { Header, Footer } from "@/components/site-chrome";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Cafe, City, fetchCities, mapDbCafeToUiCafe, neighborhoods, Country, fetchCountries } from "@/lib/cafes";

// ─── Helpers ────────────────────────────────────────────────────────────────

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

// ─── Server fn: Cloudinary signed upload ────────────────────────────────────

const getCloudinarySignature = createServerFn({ method: "POST" })
  .validator((token: string) => token)
  .handler(async ({ data: token }) => {
    if (!token) throw new Error("Unauthorized");
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) throw new Error("Unauthorized");

    const apiSecret =
      process.env.CLOUDINARY_API_SECRET ||
      import.meta.env.CLOUDINARY_API_SECRET;
    const apiKey =
      process.env.CLOUDINARY_API_KEY || import.meta.env.CLOUDINARY_API_KEY;
    const cloudName =
      process.env.VITE_CLOUDINARY_CLOUD_NAME ||
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset =
      process.env.VITE_CLOUDINARY_UPLOAD_PRESET ||
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!apiSecret || !apiKey || !cloudName || !uploadPreset) {
      throw new Error("Missing Cloudinary configuration on server");
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const stringToSign = `timestamp=${timestamp}&upload_preset=${uploadPreset}${apiSecret}`;
    const crypto = await import("crypto");
    const signature = crypto
      .createHash("sha1")
      .update(stringToSign)
      .digest("hex");

    return { signature, timestamp, apiKey, cloudName, uploadPreset };
  });

async function handleImageUpload(file: File) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) throw new Error("Unauthenticated");

  const { signature, timestamp, apiKey, cloudName, uploadPreset } =
    await getCloudinarySignature({ data: token });
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );
  if (!response.ok) throw new Error("Image upload failed");
  const data = await response.json();
  return { url: data.secure_url as string };
}

// ─── Toggle Switch ───────────────────────────────────────────────────────────

function ToggleRow({
  label,
  icon,
  value,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between border border-cafe-border rounded-xl px-4 py-3 bg-cafe-surface">
      <span className="inline-flex items-center gap-3 text-sm text-cafe-heading font-work-sans">
        <span className="text-cafe-primary">{icon}</span>
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
          value ? "bg-cafe-primary" : "bg-cafe-border"
        }`}
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

// ─── Route definition ────────────────────────────────────────────────────────

export const Route = createFileRoute("/my-submissions")({
  head: () => ({
    meta: [
      { title: "Submitted Cafes — Indie Coffee Hub" },
      {
        name: "description",
        content: "View and edit your submitted coffee shops.",
      },
    ],
  }),
  component: MySubmissions,
});

// ─── Page Component ──────────────────────────────────────────────────────────

const DEFAULT_FORM = {
  name: "",
  neighborhood: "",
  address: "",
  description: "",
  wifi: true,
  plugs: true,
  ac: false,
  petFriendly: false,
  cityId: "",
  specialtyFocus: "",
  noiseLevel: "moderate" as "quiet" | "moderate" | "bustling",
  googleMapsUrl: "",
  hoursMonday: "",
  hoursTuesday: "",
  hoursWednesday: "",
  hoursThursday: "",
  hoursFriday: "",
  hoursSaturday: "",
  hoursSunday: "",
};

function MySubmissions() {
  const { user } = useAuth();

  const fileInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const [submissions, setSubmissions] = useState<Cafe[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);

  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);

  // Editing state
  const [editingCafe, setEditingCafe] = useState<Cafe | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);

  // Inline city creation state
  const [showCityModal, setShowCityModal] = useState(false);
  const [newCityName, setNewCityName] = useState("");
  const [newCityCountryId, setNewCityCountryId] = useState("");
  const [busyCity, setBusyCity] = useState(false);

  const [preview, setPreview] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [uploadingHero, setUploadingHero] = useState(false);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState(DEFAULT_FORM);

  // Load submissions
  const loadSubmissions = async (userId: string) => {
    try {
      setLoadingSubmissions(true);
      const { data, error: fetchError } = await supabase
        .from("cafes")
        .select("*, cities(name, countries(name))")
        .eq("created_by", userId)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setSubmissions((data || []).map(mapDbCafeToUiCafe));
    } catch (err: any) {
      console.error("Failed to load submissions:", err);
      toast.error("Failed to load your submissions: " + (err.message || err));
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // Load cities & submissions & countries
  useEffect(() => {
    if (!user) return;
    void loadSubmissions(user.id);

    fetchCities()
      .then((list) => {
        setCities(list);
        if (list.length > 0)
          setForm((s) => ({ ...s, cityId: s.cityId || list[0].id }));
      })
      .catch(() => toast.error("Failed to load cities"))
      .finally(() => setLoadingCities(false));

    fetchCountries()
      .then((list) => {
        setCountries(list);
        if (list.length > 0) {
          setNewCityCountryId(list[0].id);
        }
      })
      .catch(() => toast.error("Failed to load countries"))
      .finally(() => setLoadingCountries(false));
  }, [user]);

  // ─── Image handlers ──────────────────────────────────────────────────────

  const onHeroFile = async (file: File) => {
    if (!window.confirm("Is this an image clicked and owned by you?")) {
      return;
    }
    try {
      setUploadingHero(true);
      const { url } = await handleImageUpload(file);
      setPreview(url);
      toast.success("Cover image uploaded!");
    } catch {
      toast.error("Failed to upload cover image.");
    } finally {
      setUploadingHero(false);
    }
  };

  const onGalleryFile = async (file: File) => {
    if (!window.confirm("Is this an image clicked and owned by you?")) {
      return;
    }
    try {
      setBusy(true);
      const { url } = await handleImageUpload(file);
      setGallery((prev) => [...prev, url]);
      toast.success("Gallery photo added!");
    } catch {
      toast.error("Failed to upload gallery image.");
    } finally {
      setBusy(false);
    }
  };

  const removeGalleryImage = (i: number) =>
    setGallery((prev) => prev.filter((_, idx) => idx !== i));

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void onHeroFile(file);
  };

  // ─── Edit initiation ─────────────────────────────────────────────────────

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
      cityId: cafe.city_id || (cities.length > 0 ? cities[0].id : ""),
      specialtyFocus: cafe.specialty_focus || "",
      noiseLevel: cafe.noise_level || "moderate",
      googleMapsUrl: cafe.google_maps_url || "",
      hoursMonday: cafe.opening_hours?.monday || "",
      hoursTuesday: cafe.opening_hours?.tuesday || "",
      hoursWednesday: cafe.opening_hours?.wednesday || "",
      hoursThursday: cafe.opening_hours?.thursday || "",
      hoursFriday: cafe.opening_hours?.friday || "",
      hoursSaturday: cafe.opening_hours?.saturday || "",
      hoursSunday: cafe.opening_hours?.sunday || "",
    });
    setPreview(cafe.image);
    setGallery(cafe.gallery || []);
    setError(null);

    // Scroll to form
    setTimeout(() => {
      document.getElementById("edit-cafe-form")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const cancelEdit = () => {
    setEditingCafe(null);
    setPreview(null);
    setGallery([]);
    setError(null);
  };

  // ─── Submit Edit ─────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCafe) return;
    if (!form.name || !form.address || !form.cityId) {
      toast.error("Please fill in Name, Address, and City.");
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from("cafes")
        .update({
          name: form.name,
          description: form.description || "A lovely neighborhood cafe.",
          neighborhood: form.neighborhood,
          address: form.address,
          has_wifi: form.wifi,
          has_plug_points: form.plugs,
          has_ac: form.ac,
          is_pet_friendly: form.petFriendly,
          hero_image_url: preview,
          gallery_image_urls: gallery,
          city_id: form.cityId,
          specialty_focus: form.specialtyFocus || null,
          noise_level: form.noiseLevel || null,
          google_maps_url: form.googleMapsUrl || null,
          opening_hours: {
            monday: form.hoursMonday || "8am - 6pm",
            tuesday: form.hoursTuesday || "8am - 6pm",
            wednesday: form.hoursWednesday || "8am - 6pm",
            thursday: form.hoursThursday || "8am - 6pm",
            friday: form.hoursFriday || "8am - 6pm",
            saturday: form.hoursSaturday || "8am - 6pm",
            sunday: form.hoursSunday || "8am - 6pm",
          },
          status: "pending", // Force back to pending approval
        })
        .eq("id", editingCafe.dbId);

      if (updateError) throw updateError;

      toast.success("Changes saved! Status reset to pending review.");
      setEditingCafe(null);
      if (user) void loadSubmissions(user.id);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to update cafe.");
      toast.error("Save failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleCreateCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityName.trim() || !newCityCountryId) {
      toast.error("Please enter a city name and select a country.");
      return;
    }
    setBusyCity(true);
    try {
      // 1. Check if a city with the same name and country already exists
      const { data: duplicateCity } = await supabase
        .from("cities")
        .select("*")
        .eq("country_id", newCityCountryId)
        .eq("name", newCityName.trim())
        .maybeSingle();

      if (duplicateCity) {
        toast.info(`City already exists. Selecting "${duplicateCity.name}".`);
        const freshList = await fetchCities();
        setCities(freshList);
        setForm((s) => ({ ...s, cityId: duplicateCity.id }));
        setNewCityName("");
        setShowCityModal(false);
        setBusyCity(false);
        return;
      }

      // 2. Generate a unique slug
      let generatedSlug = slugify(newCityName);
      const { data: slugCheck } = await supabase
        .from("cities")
        .select("id")
        .eq("slug", generatedSlug)
        .maybeSingle();

      if (slugCheck) {
        // Slug exists, append country code
        const { data: countryData } = await supabase
          .from("countries")
          .select("code")
          .eq("id", newCityCountryId)
          .maybeSingle();
        const code = countryData?.code?.toLowerCase() || "";
        generatedSlug = `${generatedSlug}-${code}`;

        // Double check uniqueness
        const { data: slugCheck2 } = await supabase
          .from("cities")
          .select("id")
          .eq("slug", generatedSlug)
          .maybeSingle();
        if (slugCheck2) {
          generatedSlug = `${generatedSlug}-${Math.floor(100 + Math.random() * 900)}`;
        }
      }

      const { data, error: cityErr } = await supabase
        .from("cities")
        .insert({
          name: newCityName.trim(),
          slug: generatedSlug,
          country_id: newCityCountryId,
        })
        .select();

      if (cityErr) throw cityErr;

      const createdCity = data?.[0];
      toast.success(`City "${newCityName}" added successfully!`);
      
      // Reload cities list
      const freshList = await fetchCities();
      setCities(freshList);

      // Select it automatically
      if (createdCity) {
        setForm((s) => ({ ...s, cityId: createdCity.id }));
      } else {
        const found = freshList.find((c) => c.slug === generatedSlug);
        if (found) setForm((s) => ({ ...s, cityId: found.id }));
      }

      // Reset & Close
      setNewCityName("");
      setShowCityModal(false);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to add city: " + (err.message || err));
    } finally {
      setBusyCity(false);
    }
  };

  // ─── Auth gate ───────────────────────────────────────────────────────────

  if (!user) {
    return (
      <div className="min-h-screen bg-cafe-bg">
        <Header />
        <div className="max-w-md mx-auto px-6 py-32 text-center">
          <div className="inline-flex w-16 h-16 rounded-full bg-cafe-primary-light items-center justify-center text-cafe-primary mb-6">
            <Coffee strokeWidth={1.5} size={28} />
          </div>
          <h1 className="text-2xl font-outfit tracking-tight text-cafe-heading font-light">
            Sign in to view your submissions
          </h1>
          <p className="mt-3 text-cafe-body font-work-sans">
            Please log in with your credentials to manage and edit your posted cafes.
          </p>
          <div className="mt-6">
            <Link
              to="/login"
              search={{ returnTo: "/my-submissions" }}
              className="inline-flex items-center justify-center bg-cafe-primary text-white hover:bg-cafe-primary-hover px-6 py-2.5 rounded-xl font-work-sans font-medium transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ─── CSS Helpers ─────────────────────────────────────────────────────────

  const inputCls =
    "w-full bg-cafe-surface border border-cafe-border rounded-xl focus:ring-2 focus:ring-cafe-primary/30 focus:border-cafe-primary placeholder:text-cafe-muted px-4 py-3 outline-none font-work-sans text-cafe-heading";
  const labelCls =
    "block text-xs uppercase tracking-[0.15em] font-semibold text-cafe-body font-work-sans mb-2";

  return (
    <div className="min-h-screen bg-cafe-bg">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-outfit font-light text-cafe-heading mb-2">
          Submitted Cafes
        </h1>
        <p className="text-cafe-body font-work-sans mb-8">
          Manage, track, and update all the coffee shops you have added to our platform.
        </p>

        {/* Editing Workspace Pane */}
        {editingCafe && (
          <div className="bg-cafe-surface border-2 border-cafe-primary rounded-3xl p-6 mb-8 animate-fade-in" id="edit-cafe-workspace">
            <div className="flex justify-between items-center border-b border-cafe-border pb-4 mb-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-cafe-primary font-bold">Currently Editing</span>
                <h3 className="text-lg font-outfit font-medium text-cafe-heading">{editingCafe.name}</h3>
              </div>
              <button
                type="button"
                onClick={cancelEdit}
                className="text-cafe-muted hover:text-cafe-heading p-1 border border-cafe-border rounded-full hover:bg-cafe-bg transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} id="edit-cafe-form" className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* Steps/Section 1 */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={labelCls}>Cafe Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Neighborhood</label>
                  <input
                    type="text"
                    value={form.neighborhood}
                    onChange={(e) => setForm((s) => ({ ...s, neighborhood: e.target.value }))}
                    placeholder="e.g., Indiranagar"
                    className={inputCls}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className={labelCls}>City *</label>
                    <button
                      type="button"
                      onClick={() => setShowCityModal(true)}
                      className="text-xs text-cafe-primary hover:text-cafe-primary/80 font-semibold font-work-sans focus:outline-none"
                    >
                      + Add New City
                    </button>
                  </div>
                  {loadingCities ? (
                    <div className={inputCls}>Loading...</div>
                  ) : (
                    <select
                      required
                      value={form.cityId}
                      onChange={(e) => setForm((s) => ({ ...s, cityId: e.target.value }))}
                      className={inputCls}
                    >
                      {cities.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}{c.country?.name ? ` (${c.country.name})` : ""}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className={labelCls}>Street Address *</label>
                  <input
                    type="text"
                    required
                    value={form.address}
                    onChange={(e) => setForm((s) => ({ ...s, address: e.target.value }))}
                    className={inputCls}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={labelCls}>Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                    rows={3}
                    className={inputCls + " resize-none"}
                  />
                </div>

                <div>
                  <label className={labelCls}>Google Maps URL</label>
                  <input
                    type="url"
                    value={form.googleMapsUrl}
                    onChange={(e) => setForm((s) => ({ ...s, googleMapsUrl: e.target.value }))}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Specialty Focus</label>
                  <select
                    value={form.specialtyFocus}
                    onChange={(e) => setForm((s) => ({ ...s, specialtyFocus: e.target.value }))}
                    className={inputCls}
                  >
                    <option value="">Not specified</option>
                    <option value="Espresso">Espresso</option>
                    <option value="Filter / Pour-over">Filter / Pour-over</option>
                    <option value="Cold Brew">Cold Brew</option>
                    <option value="Specialty & Origin">Specialty &amp; Origin</option>
                    <option value="Seasonal Menu">Seasonal Menu</option>
                  </select>
                </div>
              </div>

              {/* Step 2: Amenities */}
              <div className="space-y-3">
                <label className={labelCls}>Amenities</label>
                <div className="grid sm:grid-cols-2 gap-3">
                  <ToggleRow
                    label="Free Wi-Fi"
                    icon={<Wifi size={16} />}
                    value={form.wifi}
                    onChange={(v) => setForm((s) => ({ ...s, wifi: v }))}
                  />
                  <ToggleRow
                    label="Plug Points"
                    icon={<Plug size={16} />}
                    value={form.plugs}
                    onChange={(v) => setForm((s) => ({ ...s, plugs: v }))}
                  />
                  <ToggleRow
                    label="Air Conditioning"
                    icon={<Snowflake size={16} />}
                    value={form.ac}
                    onChange={(v) => setForm((s) => ({ ...s, ac: v }))}
                  />
                  <ToggleRow
                    label="Pet Friendly"
                    icon={<span>🐾</span>}
                    value={form.petFriendly}
                    onChange={(v) => setForm((s) => ({ ...s, petFriendly: v }))}
                  />
                </div>
              </div>

              {/* Step 3: Photos */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Cover Photo</label>
                  <div
                    onClick={() => fileInput.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={onDrop}
                    className={`cursor-pointer border-2 border-dashed rounded-2xl text-center transition-all ${
                      dragOver ? "border-cafe-primary bg-cafe-primary-light" : "border-cafe-border"
                    } ${preview ? "p-2" : "p-6"}`}
                  >
                    {uploadingHero ? (
                      <div className="py-2 text-cafe-muted text-sm">Uploading…</div>
                    ) : preview ? (
                      <div className="relative">
                        <img src={preview} alt="Cover preview" className="w-full h-32 object-cover rounded-xl" />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setPreview(null); }}
                          className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="text-cafe-muted">
                        <UploadCloud size={20} className="mx-auto mb-1 text-cafe-primary" />
                        <p className="text-xs font-work-sans">Click to change cover image</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInput}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) void onHeroFile(f); }}
                  />
                </div>

                <div>
                  <label className={labelCls}>Gallery Photos ({gallery.length})</label>
                  <div
                    onClick={() => galleryInput.current?.click()}
                    className="cursor-pointer border-2 border-dashed border-cafe-border rounded-2xl p-6 text-center"
                  >
                    {gallery.length > 0 ? (
                      <div className="grid grid-cols-4 gap-1.5">
                        {gallery.map((url, i) => (
                          <div key={i} className="relative group aspect-square">
                            <img src={url} alt="Gallery item" className="w-full h-full object-cover rounded-lg" />
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removeGalleryImage(i); }}
                              className="absolute top-0.5 right-0.5 bg-black/60 text-white p-0.5 rounded-full cursor-pointer"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-cafe-muted">
                        <ImageIcon size={20} className="mx-auto mb-1 text-cafe-primary" />
                        <p className="text-xs font-work-sans">Click to add gallery photos</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={galleryInput}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) void onGalleryFile(f); }}
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-5 py-2.5 rounded-xl border border-cafe-border text-cafe-heading hover:bg-cafe-bg text-sm font-medium font-work-sans cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="px-6 py-2.5 rounded-xl bg-cafe-primary text-white hover:bg-cafe-primary-hover disabled:opacity-60 text-sm font-medium font-work-sans cursor-pointer"
                >
                  {busy ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Listing */}
        {loadingSubmissions ? (
          <div className="py-12 text-center text-cafe-muted font-work-sans">
            Loading your submissions...
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-cafe-surface border border-cafe-border rounded-[2rem] p-12 text-center" data-testid="empty-submissions">
            <div className="w-14 h-14 rounded-full bg-cafe-primary-light text-cafe-primary inline-flex items-center justify-center mb-4">
              <Coffee size={24} />
            </div>
            <p className="text-cafe-heading font-outfit text-xl font-medium mb-1">
              You have not added a cafe yet
            </p>
            <p className="text-cafe-muted text-sm font-work-sans mb-6">
              Contribute your favorite local coffee spots to help grow the community directory.
            </p>
            <Link
              to="/submit"
              className="inline-flex items-center gap-2 bg-cafe-primary text-white hover:bg-cafe-primary-hover px-5 py-2.5 rounded-xl font-work-sans font-medium transition-all"
            >
              Add a Cafe <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((cafe) => (
              <div
                key={cafe.id}
                className="bg-cafe-surface border border-cafe-border rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-sm transition-all"
              >
                <div className="flex gap-4">
                  <img
                    src={cafe.image || "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb"}
                    alt={cafe.name}
                    className="w-16 h-16 rounded-xl object-cover border border-cafe-border"
                  />
                  <div>
                    <h3 className="font-outfit font-medium text-cafe-heading flex items-center gap-2">
                      {cafe.name}
                      {cafe.status === "approved" && (
                        <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded-full font-work-sans font-bold uppercase tracking-wide">
                          Live
                        </span>
                      )}
                      {cafe.status === "pending" && (
                        <span className="text-[10px] bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full font-work-sans font-bold uppercase tracking-wide">
                          Pending
                        </span>
                      )}
                      {cafe.status === "rejected" && (
                        <span className="text-[10px] bg-rose-50 border border-rose-200 text-rose-700 px-2 py-0.5 rounded-full font-work-sans font-bold uppercase tracking-wide">
                          Rejected
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-cafe-body font-medium font-work-sans mt-0.5">
                      {cafe.neighborhood}
                    </p>
                    <p className="text-[11px] text-cafe-muted font-work-sans mt-1">
                      Submitted on {new Date(cafe.dbId ? parseInt(cafe.dbId.substring(0, 8), 16) * 1000 : Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  {cafe.status === "approved" && (
                    <Link
                      to="/$country/$city/$cafeSlug"
                      params={{
                        country: "in",
                        city: "bengaluru",
                        cafeSlug: cafe.id,
                      }}
                      className="inline-flex items-center gap-1 text-xs text-cafe-muted hover:text-cafe-heading border border-cafe-border px-3.5 py-2 rounded-xl bg-white font-work-sans font-medium transition-colors"
                    >
                      View Live <ExternalLink size={12} />
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => startEdit(cafe)}
                    className="inline-flex items-center gap-1.5 text-xs bg-cafe-primary text-white hover:bg-cafe-primary-hover px-4 py-2 rounded-xl font-work-sans font-medium transition-all cursor-pointer"
                  >
                    <Edit3 size={13} /> Edit Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add New City Modal */}
      {showCityModal && (
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white border border-[#F5EBE9] rounded-[2rem] w-full max-w-md shadow-2xl p-6 relative animate-scale-in">
            <button
              onClick={() => setShowCityModal(false)}
              className="absolute right-4 top-4 text-[#A3938F] hover:text-[#2D2422] p-1.5 rounded-full transition-colors cursor-pointer border-0"
              type="button"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-outfit text-[#2D2422] mb-1 font-semibold">Add New City</h3>
            <p className="text-xs text-[#6B5C58] font-work-sans mb-6">Create a new active city region for coffee hubs.</p>

            <form onSubmit={handleCreateCity} className="space-y-4 font-work-sans">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#6B5C58] mb-1.5">
                  City Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brooklyn, NY"
                  value={newCityName}
                  onChange={(e) => setNewCityName(e.target.value)}
                  className="w-full bg-white border border-[#F5EBE9] rounded-xl focus:ring-2 focus:ring-[#E67E6B]/30 focus:border-[#E67E6B] placeholder:text-[#A3938F] px-4 py-2.5 outline-none text-sm text-[#2D2422]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#6B5C58] mb-1.5">
                  Select Country
                </label>
                {loadingCountries ? (
                  <div className="w-full bg-[#FFF7F5] border border-[#F5EBE9] px-4 py-2.5 rounded-xl text-xs text-[#6B5C58]">
                    Loading countries...
                  </div>
                ) : (
                  <select
                    value={newCityCountryId}
                    onChange={(e) => setNewCityCountryId(e.target.value)}
                    className="w-full bg-white border border-[#F5EBE9] rounded-xl focus:ring-2 focus:ring-[#E67E6B]/30 focus:border-[#E67E6B] px-4 py-2.5 outline-none text-sm text-[#2D2422]"
                  >
                    {countries.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.code.toUpperCase()})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCityModal(false)}
                  className="w-1/2 px-4 py-2.5 rounded-xl border border-[#F5EBE9] text-[#6B5C58] hover:text-[#2D2422] text-xs font-semibold cursor-pointer bg-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busyCity}
                  className="w-1/2 px-4 py-2.5 rounded-xl bg-[#E67E6B] hover:bg-[#D96C5A] text-white text-xs font-semibold cursor-pointer disabled:opacity-60 transition-all"
                >
                  {busyCity ? "Adding..." : "Add City"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
