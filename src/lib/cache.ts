import { createServerFn } from "@tanstack/react-start";
import { supabase } from "./supabase";

export type DeliveryStrategy = "dynamic" | "isr";

// Server-side in-memory state
let serverStrategy: DeliveryStrategy = "dynamic";
let serverIsrCache: any[] | null = null;

// Server Functions to query and mutate cache state securely on the backend
const getServerDeliveryStrategy = createServerFn({ method: "GET" })
  .handler(async () => {
    return serverStrategy;
  });

const setServerDeliveryStrategy = createServerFn({ method: "POST" })
  .validator((data: { strategy: DeliveryStrategy; token: string }) => data)
  .handler(async ({ data: { strategy, token } }) => {
    if (!token) throw new Error("Unauthorized");
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) throw new Error("Unauthorized");
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle();
    if (!profile?.is_admin) throw new Error("Forbidden");

    serverStrategy = strategy;
    return serverStrategy;
  });

const getServerIsrCache = createServerFn({ method: "GET" })
  .handler(async () => {
    return serverIsrCache;
  });

const setServerIsrCache = createServerFn({ method: "POST" })
  .validator((data: { cafes: any[]; token: string }) => data)
  .handler(async ({ data: { cafes, token } }) => {
    if (!token) throw new Error("Unauthorized");
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) throw new Error("Unauthorized");
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle();
    if (!profile?.is_admin) throw new Error("Forbidden");

    serverIsrCache = cafes;
    return serverIsrCache;
  });

const clearServerIsrCache = createServerFn({ method: "POST" })
  .validator((token: string) => token)
  .handler(async ({ data: token }) => {
    if (!token) throw new Error("Unauthorized");
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) throw new Error("Unauthorized");
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle();
    if (!profile?.is_admin) throw new Error("Forbidden");

    serverIsrCache = null;
    return null;
  });

// Client-side secure wrappers
export async function getDeliveryStrategy(): Promise<DeliveryStrategy> {
  if (typeof window === "undefined") return "dynamic";
  return await getServerDeliveryStrategy();
}

export async function setDeliveryStrategy(strategy: DeliveryStrategy) {
  if (typeof window === "undefined") return;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token ?? "";
    await setServerDeliveryStrategy({ data: { strategy, token } });
  } catch (err) {
    console.error("Could not set delivery strategy:", err);
  }
  // Dispatch custom event to notify components
  window.dispatchEvent(new Event("delivery-strategy-change"));
}

export async function getIsrCache(): Promise<any[] | null> {
  if (typeof window === "undefined") return null;
  return await getServerIsrCache();
}

export async function setIsrCache(cafes: any[]) {
  if (typeof window === "undefined") return;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token ?? "";
    await setServerIsrCache({ data: { cafes, token } });
  } catch (err) {
    console.warn("Could not update server ISR cache:", err);
  }
  window.dispatchEvent(new Event("isr-cache-updated"));
}

export async function clearIsrCache() {
  if (typeof window === "undefined") return;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token ?? "";
    await clearServerIsrCache({ data: token });
  } catch (err) {
    console.error("Could not clear server ISR cache:", err);
  }
  window.dispatchEvent(new Event("isr-cache-updated"));
}
