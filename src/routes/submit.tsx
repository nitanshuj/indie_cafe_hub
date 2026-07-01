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
  Clock,
} from "lucide-react";
import { Header, Footer } from "@/components/site-chrome";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { City, fetchCities, neighborhoods, Country, fetchCountries } from "@/lib/cafes";

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

export const Route = createFileRoute("/submit")({
  head: () => ({
    meta: [
      { title: "Submit a Cafe — Indie Coffee Hub" },
      {
        name: "description",
        content:
          "Know a great indie coffee shop? Submit it to Indie Coffee Hub and help the community discover hidden gems.",
      },
    ],
  }),
  component: SubmitCafe,
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

function SubmitCafe() {
  const { user } = useAuth();
  const fileInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);

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
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState(DEFAULT_FORM);

  // Load cities & countries once user is known
  useEffect(() => {
    if (!user) return;
    
    // Load Cities
    fetchCities()
      .then((list) => {
        setCities(list);
        if (list.length > 0)
          setForm((s) => ({ ...s, cityId: s.cityId || list[0].id }));
      })
      .catch(() => toast.error("Failed to load cities"))
      .finally(() => setLoadingCities(false));

    // Load Countries
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

  // ─── Submit ──────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.cityId) {
      toast.error("Please fill in Name, Address, and City.");
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id ?? null;

      const slug =
        slugify(form.name) + "-" + Math.random().toString(36).substring(2, 6);

      const { error: insertError } = await supabase.from("cafes").insert({
        name: form.name,
        slug,
        description: form.description || "A lovely neighborhood cafe.",
        neighborhood: form.neighborhood,
        address: form.address,
        has_wifi: form.wifi,
        has_plug_points: form.plugs,
        has_ac: form.ac,
        is_pet_friendly: form.petFriendly,
        hero_image_url: preview || "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb",
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
        status: "pending",
        created_at: new Date().toISOString(),
        created_by: userId,
      });

      if (insertError) throw insertError;

      setSubmitted(true);
      toast.success("Cafe submitted! It will go live after admin review.");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
      toast.error("Submission failed: " + (err.message || err));
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

  const resetForm = (cityList: City[]) => {
    setSubmitted(false);
    setPreview(null);
    setGallery([]);
    setError(null);
    setForm({
      ...DEFAULT_FORM,
      cityId: cityList.length > 0 ? cityList[0].id : "",
    });
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
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-cafe-primary font-work-sans">
            Community Submissions
          </p>
          <h1 className="mt-3 text-3xl font-outfit tracking-tight text-cafe-heading font-light">
            Submit a Cafe
          </h1>
          <p className="mt-3 text-cafe-body font-work-sans leading-relaxed">
            Know a great indie coffee spot? Sign in to add it to our directory.
            Submissions are reviewed and published by our team.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/login"
              search={{ returnTo: "/submit" }}
              className="inline-flex items-center justify-center gap-2 bg-cafe-primary text-white hover:bg-cafe-primary-hover px-6 py-3 rounded-xl font-work-sans font-medium transition-all duration-200 hover:-translate-y-0.5"
            >
              Sign In <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
            <Link
              to="/signup"
              search={{ returnTo: "/submit" }}
              className="inline-flex items-center justify-center gap-2 border border-cafe-border text-cafe-heading hover:bg-cafe-surface px-6 py-3 rounded-xl font-work-sans font-medium transition-all duration-200"
            >
              Create account
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ─── Success screen ──────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="min-h-screen bg-cafe-bg">
        <Header />
        <div className="max-w-lg mx-auto px-6 py-32 text-center">
          <div className="inline-flex w-20 h-20 rounded-full bg-emerald-50 items-center justify-center text-emerald-600 mb-6 shadow-sm">
            <Check strokeWidth={1.5} size={36} />
          </div>
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-cafe-primary font-work-sans">
            Submission Received
          </p>
          <h1 className="mt-3 text-3xl font-outfit tracking-tight text-cafe-heading font-light">
            Thanks for contributing!
          </h1>
          <p className="mt-4 text-cafe-body font-work-sans leading-relaxed">
            Your cafe has been submitted and is now{" "}
            <span className="font-semibold text-amber-600">pending review</span>.{" "}
            Our team will check the details and publish it to the directory shortly.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => resetForm(cities)}
              className="inline-flex items-center justify-center gap-2 bg-cafe-primary text-white hover:bg-cafe-primary-hover px-6 py-3 rounded-xl font-work-sans font-medium transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            >
              Submit another cafe
            </button>
            <Link
              to="/directory"
              className="inline-flex items-center justify-center gap-2 border border-cafe-border text-cafe-heading hover:bg-cafe-surface px-6 py-3 rounded-xl font-work-sans font-medium transition-all duration-200"
            >
              Browse directory
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ─── CSS helpers ─────────────────────────────────────────────────────────

  const inputCls =
    "w-full bg-cafe-surface border border-cafe-border rounded-xl focus:ring-2 focus:ring-cafe-primary/30 focus:border-cafe-primary placeholder:text-cafe-muted px-4 py-3 outline-none font-work-sans text-cafe-heading";
  const labelCls =
    "block text-xs uppercase tracking-[0.15em] font-semibold text-cafe-body font-work-sans mb-2";

  // ─── Main Form ───────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-cafe-bg">
      <Header />

      {/* Hero Header */}
      <section className="bg-cafe-surface/60 border-b border-cafe-border py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex w-14 h-14 rounded-full bg-cafe-primary-light items-center justify-center text-cafe-primary mb-5 shadow-sm">
            <Coffee strokeWidth={1.5} size={24} />
          </div>
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-cafe-primary font-work-sans">
            Community Submissions
          </p>
          <h1 className="mt-3 text-4xl sm:text-5xl tracking-tight font-light text-cafe-heading font-outfit">
            Submit a Cafe
          </h1>
          <p className="mt-4 text-cafe-body font-work-sans max-w-xl mx-auto leading-relaxed">
            Know a hidden gem? Fill in the details below. Your submission will
            be reviewed by our team and published to the directory once approved.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-work-sans font-semibold">
            <Clock size={12} strokeWidth={2} /> Submissions reviewed within 48 hours
          </div>
        </div>
      </section>

      {/* Form */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <form onSubmit={handleSubmit} id="submit-cafe-form" className="space-y-8">

          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm font-work-sans">
              {error}
            </div>
          )}

          {/* ── Section 1: Basic Info ─────────────────────────────── */}
          <div className="bg-cafe-surface border border-cafe-border rounded-[2rem] p-7 sm:p-8 shadow-sm space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-cafe-primary font-work-sans">Step 1</p>
              <h2 className="mt-1 text-xl font-outfit text-cafe-heading">Basic Information</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className={labelCls}>Cafe Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  placeholder="e.g., Blue Tokai Coffee Roasters"
                  className={inputCls}
                  data-testid="submit-name-input"
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
                  <div className={inputCls + " text-cafe-muted"}>Loading cities…</div>
                ) : (
                  <select
                    required
                    value={form.cityId}
                    onChange={(e) => setForm((s) => ({ ...s, cityId: e.target.value }))}
                    className={inputCls}
                    data-testid="submit-city-select"
                  >
                    <option value="" disabled>Select a city</option>
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
                  placeholder="e.g., 100 HAL 2nd Stage, Indiranagar"
                  className={inputCls}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelCls}>
                  Description{" "}
                  <span className="normal-case tracking-normal text-cafe-muted font-normal">(optional)</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                  rows={3}
                  placeholder="What makes this cafe special? Mention the vibe, specialties, working environment…"
                  className={inputCls + " resize-none"}
                />
              </div>

              <div>
                <label className={labelCls}>
                  Google Maps URL{" "}
                  <span className="normal-case tracking-normal text-cafe-muted font-normal">(optional)</span>
                </label>
                <input
                  type="url"
                  value={form.googleMapsUrl}
                  onChange={(e) => setForm((s) => ({ ...s, googleMapsUrl: e.target.value }))}
                  placeholder="https://maps.google.com/..."
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
          </div>

          {/* ── Section 2: Amenities ──────────────────────────────── */}
          <div className="bg-cafe-surface border border-cafe-border rounded-[2rem] p-7 sm:p-8 shadow-sm space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-cafe-primary font-work-sans">Step 2</p>
              <h2 className="mt-1 text-xl font-outfit text-cafe-heading">Amenities &amp; Vibe</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <ToggleRow
                label="Free Wi-Fi"
                icon={<Wifi size={16} strokeWidth={1.5} />}
                value={form.wifi}
                onChange={(v) => setForm((s) => ({ ...s, wifi: v }))}
              />
              <ToggleRow
                label="Plug Points"
                icon={<Plug size={16} strokeWidth={1.5} />}
                value={form.plugs}
                onChange={(v) => setForm((s) => ({ ...s, plugs: v }))}
              />
              <ToggleRow
                label="Air Conditioning"
                icon={<Snowflake size={16} strokeWidth={1.5} />}
                value={form.ac}
                onChange={(v) => setForm((s) => ({ ...s, ac: v }))}
              />
              <ToggleRow
                label="Pet Friendly"
                icon={<span className="text-sm">🐾</span>}
                value={form.petFriendly}
                onChange={(v) => setForm((s) => ({ ...s, petFriendly: v }))}
              />
            </div>

            <div>
              <label className={labelCls}>Noise Level</label>
              <div className="flex gap-3">
                {(["quiet", "moderate", "bustling"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setForm((s) => ({ ...s, noiseLevel: lvl }))}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-medium font-work-sans capitalize transition-all cursor-pointer ${
                      form.noiseLevel === lvl
                        ? "bg-cafe-primary text-white border-cafe-primary"
                        : "border-cafe-border text-cafe-body hover:border-cafe-primary/50"
                    }`}
                  >
                    {lvl === "quiet" ? "🤫 Quiet" : lvl === "moderate" ? "☕ Moderate" : "🔊 Bustling"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Section 3: Opening Hours ──────────────────────────── */}
          <div className="bg-cafe-surface border border-cafe-border rounded-[2rem] p-7 sm:p-8 shadow-sm space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-cafe-primary font-work-sans">Step 3</p>
              <h2 className="mt-1 text-xl font-outfit text-cafe-heading">
                Opening Hours{" "}
                <span className="text-sm font-work-sans text-cafe-muted font-normal">(optional)</span>
              </h2>
              <p className="mt-1 text-xs text-cafe-muted font-work-sans">
                Format: 8am – 10pm, or leave blank if unknown
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {(
                [
                  ["hoursMonday", "Monday"],
                  ["hoursTuesday", "Tuesday"],
                  ["hoursWednesday", "Wednesday"],
                  ["hoursThursday", "Thursday"],
                  ["hoursFriday", "Friday"],
                  ["hoursSaturday", "Saturday"],
                  ["hoursSunday", "Sunday"],
                ] as [keyof typeof form, string][]
              ).map(([key, day]) => (
                <div key={key}>
                  <label className={labelCls}>{day}</label>
                  <input
                    type="text"
                    value={form[key] as string}
                    onChange={(e) => setForm((s) => ({ ...s, [key]: e.target.value }))}
                    placeholder="e.g., 8am – 10pm"
                    className={inputCls}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── Section 4: Photos ─────────────────────────────────── */}
          <div className="bg-cafe-surface border border-cafe-border rounded-[2rem] p-7 sm:p-8 shadow-sm space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-cafe-primary font-work-sans">Step 4</p>
              <h2 className="mt-1 text-xl font-outfit text-cafe-heading">
                Photos{" "}
                <span className="text-sm font-work-sans text-cafe-muted font-normal">(optional but recommended)</span>
              </h2>
            </div>

            {/* Hero Image */}
            <div>
              <label className={labelCls}>Cover Photo</label>
              <div
                onClick={() => fileInput.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                className={`cursor-pointer border-2 border-dashed rounded-2xl text-center transition-all ${
                  dragOver
                    ? "border-cafe-primary bg-cafe-primary-light"
                    : "border-cafe-border hover:border-cafe-primary/50 hover:bg-cafe-surface"
                } ${preview ? "p-2" : "p-10"} relative overflow-hidden`}
              >
                {uploadingHero ? (
                  <div className="py-6 text-cafe-muted font-work-sans text-sm">Uploading…</div>
                ) : preview ? (
                  <div className="relative">
                    <img src={preview} alt="Cover preview" className="w-full h-52 object-cover rounded-xl" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setPreview(null); }}
                      className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full transition-all cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="mx-auto w-10 h-10 rounded-full bg-cafe-primary-light inline-flex items-center justify-center text-cafe-primary">
                      <UploadCloud size={20} strokeWidth={1.5} />
                    </div>
                    <p className="text-sm text-cafe-heading font-work-sans font-medium">
                      Drop a cover photo or click to upload
                    </p>
                    <p className="text-xs text-cafe-muted font-work-sans">PNG / JPG — auto-optimized to WebP</p>
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

            {/* Gallery */}
            <div>
              <label className={labelCls}>Gallery Photos ({gallery.length})</label>
              <div
                onClick={() => galleryInput.current?.click()}
                className="cursor-pointer border-2 border-dashed border-cafe-border rounded-2xl hover:border-cafe-primary/50 transition-colors p-6 text-center"
              >
                {gallery.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {gallery.map((url, i) => (
                      <div key={i} className="relative group aspect-square">
                        <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover rounded-xl" />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeGalleryImage(i); }}
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-black/60 text-white p-1 rounded-full transition-all cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    <div className="aspect-square border-2 border-dashed border-cafe-border rounded-xl flex items-center justify-center text-cafe-muted">
                      <ImageIcon size={20} strokeWidth={1.5} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 text-cafe-muted">
                    <ImageIcon size={24} strokeWidth={1.5} className="mx-auto" />
                    <p className="text-xs font-work-sans">Add gallery photos (optional)</p>
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

          {/* ── Submit Button ─────────────────────────────────────── */}
          <div className="flex items-center justify-between flex-wrap gap-4 pb-6">
            <p className="text-sm text-cafe-muted font-work-sans">
              Signed in as <span className="text-cafe-heading font-medium">{user.email}</span>
            </p>
            <button
              type="submit"
              disabled={busy}
              data-testid="submit-cafe-btn"
              className="inline-flex items-center gap-2 bg-cafe-primary text-white hover:bg-cafe-primary-hover disabled:opacity-60 px-8 py-3.5 rounded-xl font-work-sans font-medium transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shadow-sm"
            >
              {busy ? "Submitting…" : <>Submit for Review <ArrowRight size={16} strokeWidth={1.5} /></>}
            </button>
          </div>
        </form>
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
