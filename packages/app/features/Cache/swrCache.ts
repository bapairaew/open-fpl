import {
  getLocalStorageItemString,
  setLocalStorageItemFromString,
} from "@open-fpl/app/features/Common/useLocalStorage";
import { compress, decompress } from "lz-string";

const cacheKey = "app-cache";

function localStorageProvider() {
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

export default localStorageProvider;
