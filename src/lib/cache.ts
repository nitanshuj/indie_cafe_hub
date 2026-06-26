import { createServerFn } from "@tanstack/react-start";

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
  .validator((strategy: unknown) => strategy as DeliveryStrategy)
  .handler(async ({ data: strategy }) => {
    serverStrategy = strategy;
    return serverStrategy;
  });

const getServerIsrCache = createServerFn({ method: "GET" })
  .handler(async () => {
    return serverIsrCache;
  });

const setServerIsrCache = createServerFn({ method: "POST" })
  .validator((cafes: unknown) => cafes as any[])
  .handler(async ({ data: cafes }) => {
    serverIsrCache = cafes;
    return serverIsrCache;
  });

const clearServerIsrCache = createServerFn({ method: "POST" })
  .handler(async () => {
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
  await setServerDeliveryStrategy(strategy);
  // Dispatch custom event to notify components
  window.dispatchEvent(new Event("delivery-strategy-change"));
}

export async function getIsrCache(): Promise<any[] | null> {
  if (typeof window === "undefined") return null;
  return await getServerIsrCache();
}

export async function setIsrCache(cafes: any[]) {
  if (typeof window === "undefined") return;
  await setServerIsrCache(cafes);
  window.dispatchEvent(new Event("isr-cache-updated"));
}

export async function clearIsrCache() {
  if (typeof window === "undefined") return;
  await clearServerIsrCache();
  window.dispatchEvent(new Event("isr-cache-updated"));
}
