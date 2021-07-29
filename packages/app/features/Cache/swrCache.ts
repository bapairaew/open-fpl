import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "@open-fpl/app/features/Common/useLocalStorage";
import { createCache } from "swr";

function createProvider() {
  const map = new Map(getLocalStorageItem("app-cache", []));

  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", () => {
      setLocalStorageItem("app-cache", Array.from(map.entries()));
    });
  }

  return map;
}

const provider = createProvider();

const swrCache = createCache(provider);

export const cache = swrCache.cache;
export const mutate = swrCache.mutate;
