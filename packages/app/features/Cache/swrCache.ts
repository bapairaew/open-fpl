import {
  getLocalStorageItemString,
  setLocalStorageItemFromString,
} from "@open-fpl/app/features/Common/useLocalStorage";
import { compress, decompress } from "lz-string";
import { createCache } from "swr";

const cacheKey = "app-cache";

function createProvider() {
  let cache: any[] = [];
  try {
    const cacheString = getLocalStorageItemString(cacheKey) ?? "";
    const decompressedCache = decompress(cacheString) ?? "[]";
    cache = JSON.parse(decompressedCache);
  } catch (e) {
    // Ignore error
  }

  const map = new Map(cache);

  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", () => {
      const cacheArray = Array.from(map.entries());
      const cacheString = JSON.stringify(cacheArray);
      const compressedCache = compress(cacheString);
      setLocalStorageItemFromString(cacheKey, compressedCache);
    });
  }

  return map;
}

const provider = createProvider();

const swrCache = createCache(provider);

export const cache = swrCache.cache;
export const mutate = swrCache.mutate;
