import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { UploadCloud, ImageIcon, Wifi, Plug, Snowflake, Check, ShieldAlert } from "lucide-react";
import { Header, Footer } from "@/components/site-chrome";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Indie Cafe Hub" },
      { name: "description", content: "Admin dashboard for managing Indie Cafe Hub cafes." },
    ],
  }),
  component: Admin,
});

async function handleImageUpload(file: File) {
  // TODO: wire up to Cloudinary
  console.log("[handleImageUpload] uploading file", { name: file.name, size: file.size, type: file.type });
  return new Promise<{ url: string }>((resolve) =>
    setTimeout(() => resolve({ url: URL.createObjectURL(file) }), 400),
  );
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
        className={`relative w-11 h-6 rounded-full transition-colors ${value ? "bg-[#E67E6B]" : "bg-[#F5EBE9]"}`}
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
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: "",
    neighborhood: "",
    address: "",
    wifi: true,
    plugs: true,
    ac: false,
  });

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
            Sign in with an admin account to manage the directory. (Tip: use an email containing "admin".)
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

  const onFile = async (file: File) => {
    const { url } = await handleImageUpload(file);
    setPreview(url);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void onFile(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[admin] new cafe", { ...form, image: preview });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#FFF7F5]">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#E67E6B] font-work-sans">Admin</p>
            <h1 className="mt-2 text-4xl tracking-tight font-light text-[#2D2422] font-outfit">Dashboard</h1>
          </div>
          <div className="text-sm text-[#6B5C58] font-work-sans">
            Signed in as <span className="text-[#2D2422] font-medium">{user.email}</span>
          </div>
        </div>

        <div className="mt-10 grid lg:grid-cols-3 gap-6">
          <div className="bg-white border border-[#F5EBE9] rounded-[2rem] p-6">
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#A3938F] font-work-sans">Cafes</p>
            <p className="mt-3 text-3xl font-outfit text-[#2D2422]">6</p>
            <p className="mt-1 text-sm text-[#6B5C58] font-work-sans">In the directory</p>
          </div>
          <div className="bg-white border border-[#F5EBE9] rounded-[2rem] p-6">
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#A3938F] font-work-sans">Comments</p>
            <p className="mt-3 text-3xl font-outfit text-[#2D2422]">—</p>
            <p className="mt-1 text-sm text-[#6B5C58] font-work-sans">Community notes</p>
          </div>
          <div className="bg-white border border-[#F5EBE9] rounded-[2rem] p-6">
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#A3938F] font-work-sans">Pending review</p>
            <p className="mt-3 text-3xl font-outfit text-[#2D2422]">0</p>
            <p className="mt-1 text-sm text-[#6B5C58] font-work-sans">Submissions</p>
          </div>
        </div>

        <form
          onSubmit={submit}
          data-testid="admin-cafe-form"
          className="mt-10 bg-white border border-[#F5EBE9] rounded-[2rem] p-8 grid lg:grid-cols-2 gap-8"
        >
          <div>
            <h2 className="text-2xl font-outfit tracking-tight text-[#2D2422]">Add a new cafe</h2>
            <p className="mt-2 text-sm text-[#6B5C58] font-work-sans">Photos and amenities show up immediately in the public directory.</p>

            <div className="mt-6 space-y-4">
              {[
                { key: "name", label: "Name", placeholder: "Third Wave Loft" },
                { key: "neighborhood", label: "Neighborhood", placeholder: "Indiranagar" },
                { key: "address", label: "Address", placeholder: "12, 100 Feet Rd" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs uppercase tracking-[0.15em] font-semibold text-[#6B5C58] font-work-sans mb-2">
                    {f.label}
                  </label>
                  <input
                    type="text"
                    value={form[f.key as "name" | "neighborhood" | "address"]}
                    onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    data-testid={`admin-input-${f.key}`}
                    className="w-full bg-white border border-[#F5EBE9] rounded-xl focus:ring-2 focus:ring-[#E67E6B]/30 focus:border-[#E67E6B] placeholder:text-[#A3938F] px-4 py-2.5 outline-none font-work-sans"
                  />
                </div>
              ))}
            </div>

            <p className="mt-8 text-xs uppercase tracking-[0.15em] font-semibold text-[#6B5C58] font-work-sans">Amenities</p>
            <div className="mt-3 space-y-2">
              <ToggleRow label="WiFi" icon={<Wifi size={16} strokeWidth={1.5} />} value={form.wifi} onChange={(v) => setForm((s) => ({ ...s, wifi: v }))} testId="admin-toggle-wifi" />
              <ToggleRow label="Power Plugs" icon={<Plug size={16} strokeWidth={1.5} />} value={form.plugs} onChange={(v) => setForm((s) => ({ ...s, plugs: v }))} testId="admin-toggle-plugs" />
              <ToggleRow label="Air Conditioning" icon={<Snowflake size={16} strokeWidth={1.5} />} value={form.ac} onChange={(v) => setForm((s) => ({ ...s, ac: v }))} testId="admin-toggle-ac" />
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.15em] font-semibold text-[#6B5C58] font-work-sans mb-2">Cover photo</p>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileInput.current?.click()}
              data-testid="admin-image-dropzone"
              className={`cursor-pointer border-2 border-dashed rounded-2xl p-10 text-center transition-colors ${
                dragOver ? "bg-[#FDE4DD] border-[#E67E6B]" : "bg-white border-[#F5EBE9] hover:bg-[#FDE4DD]"
              }`}
            >
              {preview ? (
                <div className="space-y-3">
                  <img src={preview} alt="Cafe preview" className="mx-auto max-h-48 rounded-xl object-cover" />
                  <p className="text-xs text-[#6B5C58] font-work-sans inline-flex items-center justify-center gap-1">
                    <ImageIcon size={14} strokeWidth={1.5} /> Click to replace
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="mx-auto w-14 h-14 rounded-full bg-[#FDE4DD] inline-flex items-center justify-center text-[#E67E6B]">
                    <UploadCloud strokeWidth={1.5} />
                  </div>
                  <p className="text-sm text-[#2D2422] font-work-sans font-medium">Drop an image here</p>
                  <p className="text-xs text-[#A3938F] font-work-sans">PNG or JPG, up to 5MB</p>
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
                  if (f) void onFile(f);
                }}
              />
            </div>

            <div className="mt-8 flex items-center gap-3">
              <button
                type="submit"
                data-testid="admin-save-button"
                className="bg-[#E67E6B] text-white hover:bg-[#D96C5A] px-6 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 font-work-sans font-medium"
              >
                Save cafe
              </button>
              {saved && (
                <span
                  className="inline-flex items-center gap-1.5 text-sm text-[#2E7D32] font-work-sans"
                  data-testid="admin-save-confirmation"
                >
                  <Check size={16} strokeWidth={1.5} /> Saved (stub)
                </span>
              )}
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
