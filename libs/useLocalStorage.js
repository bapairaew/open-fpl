import { useCallback, useEffect, useState } from "react";

const MANUAL_LOCAL_STORAGE_CHANGE = "manualLocalStorageChange";

export function getLocalStorageItem(key, defaultValue) {
  try {
    return JSON.parse(window.localStorage.getItem(key));
  } catch (e) {
    return defaultValue;
  }
}

export function setLocalStorageItem(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(
    new CustomEvent(MANUAL_LOCAL_STORAGE_CHANGE, {
      detail: { key, value },
    })
  );
}

export function removeLocalStorageItem(key) {
  window.localStorage.removeItem(key);
  window.dispatchEvent(
    new CustomEvent(MANUAL_LOCAL_STORAGE_CHANGE, {
      detail: { key, value: undefined },
    })
  );
}

function useLocalStorage(key, defaultValue) {
  const [storedValue, setStoredValue] = useState(defaultValue);
  const [isInitialised, setIsInitialised] = useState(false);

  const storeEventListener = (e) => {
    if (e.type === MANUAL_LOCAL_STORAGE_CHANGE) {
      if (e.detail.key === key) {
        setStoredValue(
          e.detail.value === undefined ? defaultValue : e.detail.value
        );
      }
    } else {
      if (e.key === key) {
        setStoredValue(JSON.parse(e.newValue));
      }
    }
  };

  const writeDataAndSetValue = (key, value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // Ignore error
    }
  };

  useEffect(() => {
    // Only initialise localStorage data on client side and on key changed
    try {
      const item = window.localStorage.getItem(key);
      setStoredValue(item ? JSON.parse(item) : defaultValue);

      // Listen change from other browser tabs
      window.addEventListener("storage", storeEventListener);

      // Listen change from outside of hook
      window.addEventListener(MANUAL_LOCAL_STORAGE_CHANGE, storeEventListener);
    } catch (error) {
      // Ignore error
    } finally {
      setIsInitialised(true);
    }

    return () => {
      window.removeEventListener("storage", storeEventListener);
      window.removeEventListener(
        MANUAL_LOCAL_STORAGE_CHANGE,
        storeEventListener
      );
    };
  }, [key]);

  const setValue = useCallback(
    (value) => writeDataAndSetValue(key, value),
    [key]
  );

  return [storedValue, setValue, isInitialised];
}

export default useLocalStorage;
