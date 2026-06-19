// Strategy simulation helper
export type DeliveryStrategy = "dynamic" | "isr";

const STRATEGY_KEY = "indie_cafe_strategy";
const CACHE_KEY = "indie_cafe_static_cache";

export function getDeliveryStrategy(): DeliveryStrategy {
  if (typeof window === "undefined") return "dynamic";
  return (localStorage.getItem(STRATEGY_KEY) as DeliveryStrategy) || "dynamic";
}

export function setDeliveryStrategy(strategy: DeliveryStrategy) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STRATEGY_KEY, strategy);
  // Dispatch custom event to notify components
  window.dispatchEvent(new Event("delivery-strategy-change"));
}

export function getIsrCache(): any[] | null {
  if (typeof window === "undefined") return null;
  const cached = localStorage.getItem(CACHE_KEY);
  return cached ? JSON.parse(cached) : null;
}

export function setIsrCache(cafes: any[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CACHE_KEY, JSON.stringify(cafes));
  window.dispatchEvent(new Event("isr-cache-updated"));
}

export function clearIsrCache() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CACHE_KEY);
  window.dispatchEvent(new Event("isr-cache-updated"));
}
