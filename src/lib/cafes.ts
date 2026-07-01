import { supabase } from "./supabase";
import { getDeliveryStrategy, getIsrCache, setIsrCache } from "./cache";

export type Country = {
  id: string;
  name: string;
  code: string;
};

export type City = {
  id: string;
  name: string;
  slug: string;
  country_id: string;
  country?: Country;
};

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

  // Approval pipeline
  status?: "pending" | "approved" | "rejected";
  created_by?: string;

  // Creator attribution
  created_by_name?: string;

  // City & country resolved names (from join)
  city_name?: string;
  country_name?: string;

  // Nomad & Expansion fields
  city_id?: string;
  specialty_focus?: string;
  noise_level?: "quiet" | "moderate" | "bustling";
  google_maps_url?: string;
  opening_hours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };

  // Featured
  is_featured?: boolean;
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
      dbCafe.specialty_focus ? dbCafe.specialty_focus : "",
    ].filter(Boolean),
    wifi: dbCafe.has_wifi,
    open: true,
    hours: dbCafe.opening_hours
      ? typeof dbCafe.opening_hours === "string"
        ? dbCafe.opening_hours
        : dbCafe.opening_hours.monday || dbCafe.opening_hours.weekday || dbCafe.opening_hours.mon_fri || "9am – 9pm"
      : "9am – 9pm",
    address: dbCafe.address,
    has_wifi: dbCafe.has_wifi,
    has_plug_points: dbCafe.has_plug_points,
    has_ac: dbCafe.has_ac,
    is_pet_friendly: dbCafe.is_pet_friendly,

    // Creator attribution — populated when profiles is joined
    created_by_name: dbCafe.profiles?.full_name
      || dbCafe.profiles?.display_name
      || dbCafe.profiles?.username
      || dbCafe.profiles?.email
      || undefined,

    // City & country names — populated when cities join is present
    city_name: dbCafe.cities?.name || undefined,
    country_name: dbCafe.cities?.countries?.name || undefined,

    // Mapped new fields
    city_id: dbCafe.city_id,
    specialty_focus: dbCafe.specialty_focus,
    noise_level: dbCafe.noise_level,
    google_maps_url: dbCafe.google_maps_url,
    opening_hours: dbCafe.opening_hours
      ? {
        monday: dbCafe.opening_hours.monday || dbCafe.opening_hours.weekday || dbCafe.opening_hours.mon_fri || undefined,
        tuesday: dbCafe.opening_hours.tuesday || dbCafe.opening_hours.weekday || dbCafe.opening_hours.mon_fri || undefined,
        wednesday: dbCafe.opening_hours.wednesday || dbCafe.opening_hours.weekday || dbCafe.opening_hours.mon_fri || undefined,
        thursday: dbCafe.opening_hours.thursday || dbCafe.opening_hours.weekday || dbCafe.opening_hours.mon_fri || undefined,
        friday: dbCafe.opening_hours.friday || dbCafe.opening_hours.weekday || dbCafe.opening_hours.mon_fri || undefined,
        saturday: dbCafe.opening_hours.saturday || undefined,
        sunday: dbCafe.opening_hours.sunday || undefined,
      }
      : undefined,

    // Featured
    is_featured: dbCafe.is_featured ?? false,

    // Approval pipeline
    status: dbCafe.status,
    created_by: dbCafe.created_by,
  };
}

export async function fetchCountries(): Promise<Country[]> {
  const { data, error } = await supabase.from("countries").select("*").order("name");
  if (error) {
    console.error("Error fetching countries:", error);
    throw error;
  }
  return data || [];
}

const fallbackCities: City[] = [
  {
    id: "bengaluru-id-placeholder",
    name: "Bengaluru",
    slug: "bengaluru",
    country_id: "india-id-placeholder",
    country: { id: "india-id-placeholder", name: "India", code: "in" }
  },
  {
    id: "haldwani-id-placeholder",
    name: "Haldwani",
    slug: "haldwani",
    country_id: "india-id-placeholder",
    country: { id: "india-id-placeholder", name: "India", code: "in" }
  },
  {
    id: "seattle-id-placeholder",
    name: "Seattle, WA",
    slug: "seattle",
    country_id: "usa-id-placeholder",
    country: { id: "usa-id-placeholder", name: "USA", code: "us" }
  },
  {
    id: "san-jose-id-placeholder",
    name: "San Jose, CA",
    slug: "san-jose",
    country_id: "usa-id-placeholder",
    country: { id: "usa-id-placeholder", name: "USA", code: "us" }
  },
  {
    id: "san-francisco-id-placeholder",
    name: "San Francisco, CA",
    slug: "san-francisco",
    country_id: "usa-id-placeholder",
    country: { id: "usa-id-placeholder", name: "USA", code: "us" }
  },
  {
    id: "bloomington-id-placeholder",
    name: "Bloomington, IN",
    slug: "bloomington",
    country_id: "usa-id-placeholder",
    country: { id: "usa-id-placeholder", name: "USA", code: "us" }
  }
];

export async function fetchCities(): Promise<City[]> {
  try {
    const { data, error } = await supabase.from("cities").select("*, countries(*)").order("name");
    if (error) {
      console.warn("Using fallback cities due to database fetch error:", error.message);
      return fallbackCities;
    }
    if (!data || data.length === 0) {
      return fallbackCities;
    }
    return data.map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      country_id: c.country_id,
      country: c.countries ? {
        id: c.countries.id,
        name: c.countries.name,
        code: c.countries.code
      } : { id: c.country_id, name: "India", code: "in" }
    }));
  } catch (err) {
    console.warn("Using fallback cities due to crash:", err);
    return fallbackCities;
  }
}

export async function fetchCafes(): Promise<Cafe[]> {
  // If in client-side ISR mode, serve from local simulation cache
  if (typeof window !== "undefined" && (await getDeliveryStrategy()) === "isr") {
    const cached = await getIsrCache();
    if (cached) {
      return cached;
    }
  }

  const { data, error } = await supabase
    .from("cafes")
    .select("*, cities(name, countries(name))")
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching cafes:", error);
    throw error;
  }

  const cafes = (data || []).map(mapDbCafeToUiCafe);

  // Save cache state for ISR simulation
  if (typeof window !== "undefined") {
    await setIsrCache(cafes);
  }

  return cafes;
}

export async function fetchFeaturedCafes(): Promise<Cafe[]> {
  const { data, error } = await supabase
    .from("cafes")
    .select("*, cities(name, countries(name))")
    .eq("status", "approved")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(6);
  if (error) {
    console.error("Error fetching featured cafes:", error);
    throw error;
  }
  return (data || []).map(mapDbCafeToUiCafe);
}

export async function fetchCafesByCity(cityId: string): Promise<Cafe[]> {
  const { data, error } = await supabase
    .from("cafes")
    .select("*")
    .eq("city_id", cityId)
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching cafes by city:", error);
    throw error;
  }
  return (data || []).map(mapDbCafeToUiCafe);
}


export async function fetchCafeByIdOrSlug(idOrSlug: string): Promise<Cafe | null> {
  // Intentionally skip ISR cache: the list cache (from fetchCafes with select("*"))
  // has no creator info, so created_by_name would always be undefined from cache.

  let { data, error } = await supabase
    .from("cafes")
    .select("*")
    .eq("slug", idOrSlug)
    .maybeSingle();

  if (!data && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug)) {
    const res = await supabase
      .from("cafes")
      .select("*")
      .eq("id", idOrSlug)
      .maybeSingle();
    data = res.data;
    error = res.error;
  }

  if (error) {
    console.error("Error fetching cafe details:", error);
    throw error;
  }

  if (!data) return null;

  // Separately fetch the creator's name from profiles (same pattern as auth-context.tsx)
  if (data.created_by) {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", data.created_by)
        .maybeSingle();
      // Attach so mapDbCafeToUiCafe can read it
      data = { ...data, profiles: profile ?? null };
    } catch {
      // Non-critical — silently skip if profile fetch fails
    }
  }

  return mapDbCafeToUiCafe(data);
}


