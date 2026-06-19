import { supabase } from "./supabase";
import { getDeliveryStrategy, getIsrCache, setIsrCache } from "./cache";

export type Cafe = {
  id: string;
  dbId: string;
  name: string;
  neighborhood: string;
  blurb: string;
  image: string;
  gallery: string[];
  tags: string[];
  wifi: boolean;
  open: boolean;
  hours: string;
  address?: string;
  has_wifi?: boolean;
  has_plug_points?: boolean;
  has_ac?: boolean;
  is_pet_friendly?: boolean;
};

export const neighborhoods = [
  "All neighborhoods",
  "Indiranagar",
  "Koramangala",
  "Jayanagar",
  "MG Road",
  "HSR Layout",
] as const;

export function optimizeCloudinaryUrl(url: string, width = 1200) {
  if (!url || !url.includes("cloudinary.com")) return url;
  if (url.includes("/f_auto") || url.includes("/q_auto")) return url;
  return url.replace("/image/upload/", `/image/upload/f_auto,q_auto,w_${width}/`);
}

export function mapDbCafeToUiCafe(dbCafe: any): Cafe {
  return {
    id: dbCafe.slug || dbCafe.id,
    dbId: dbCafe.id,
    name: dbCafe.name,
    neighborhood: dbCafe.neighborhood,
    blurb: dbCafe.description || "",
    image: optimizeCloudinaryUrl(dbCafe.hero_image_url || "", 1200),
    gallery: (dbCafe.gallery_image_urls || []).map((url: string) => optimizeCloudinaryUrl(url, 800)),
    tags: [
      dbCafe.has_wifi ? "WiFi Friendly" : "",
      dbCafe.has_plug_points ? "Laptop Friendly" : "",
      dbCafe.has_ac ? "AC" : "",
      dbCafe.is_pet_friendly ? "Pet Friendly" : "",
    ].filter(Boolean),
    wifi: dbCafe.has_wifi,
    open: true,
    hours: dbCafe.opening_hours
      ? typeof dbCafe.opening_hours === "string"
        ? dbCafe.opening_hours
        : dbCafe.opening_hours.weekday || dbCafe.opening_hours.mon_fri || "9am – 9pm"
      : "9am – 9pm",
    address: dbCafe.address,
    has_wifi: dbCafe.has_wifi,
    has_plug_points: dbCafe.has_plug_points,
    has_ac: dbCafe.has_ac,
    is_pet_friendly: dbCafe.is_pet_friendly,
  };
}

export async function fetchCafes(): Promise<Cafe[]> {
  // If in client-side ISR mode, serve from local simulation cache
  if (typeof window !== "undefined" && getDeliveryStrategy() === "isr") {
    const cached = getIsrCache();
    if (cached) {
      return cached;
    }
  }

  const { data, error } = await supabase
    .from("cafes")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching cafes:", error);
    throw error;
  }

  const cafes = (data || []).map(mapDbCafeToUiCafe);

  // Save cache state for ISR simulation
  if (typeof window !== "undefined") {
    setIsrCache(cafes);
  }

  return cafes;
}

export async function fetchCafeByIdOrSlug(idOrSlug: string): Promise<Cafe | null> {
  if (typeof window !== "undefined" && getDeliveryStrategy() === "isr") {
    const cached = getIsrCache();
    if (cached) {
      const match = cached.find((c) => c.id === idOrSlug || c.dbId === idOrSlug);
      if (match) return match;
    }
  }

  let { data, error } = await supabase.from("cafes").select("*").eq("slug", idOrSlug).maybeSingle();

  if (!data && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug)) {
    const res = await supabase.from("cafes").select("*").eq("id", idOrSlug).maybeSingle();
    data = res.data;
    error = res.error;
  }

  if (error) {
    console.error("Error fetching cafe details:", error);
    throw error;
  }
  return data ? mapDbCafeToUiCafe(data) : null;
}

