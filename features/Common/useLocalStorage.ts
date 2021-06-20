import { useCallback, useEffect, useState } from "react";

const MANUAL_LOCAL_STORAGE_CHANGE = "manualLocalStorageChange";

interface ManualLocalStorageChangeType {
  key: string;
  value: any;
}

export function getLocalStorageItem<T>(
  key: string,
  defaultValue: T | null | undefined
): T | null | undefined {
  try {
    const storageString = window.localStorage.getItem(key);
    if (storageString !== null) return JSON.parse(storageString);
    else return defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

export function setLocalStorageItem<T>(key: string, value: T | null): void {
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(
    new CustomEvent<ManualLocalStorageChangeType>(MANUAL_LOCAL_STORAGE_CHANGE, {
      detail: { key, value },
    })
  );
}

export function removeLocalStorageItem(key: string): void {
  window.localStorage.removeItem(key);
  window.dispatchEvent(
    new CustomEvent<ManualLocalStorageChangeType>(MANUAL_LOCAL_STORAGE_CHANGE, {
      detail: { key, value: undefined },
    })
  );
}

function useLocalStorage<T>(
  key: string,
  defaultValue: T | null | undefined
): [T | null | undefined, (value: T | null | undefined) => void, boolean] {
  const [storedValue, setStoredValue] =
    useState<T | null | undefined>(defaultValue);
  const [isInitialised, setIsInitialised] = useState<boolean>(false);

  const storeEventListener = (
    e: CustomEvent<ManualLocalStorageChangeType> | StorageEvent
  ): void => {
    if (e instanceof StorageEvent) {
      if (e.key === key) {
        setStoredValue(e.newValue === null ? null : JSON.parse(e.newValue));
      }
    } else {
      if (e.detail.key === key) {
        setStoredValue(
          e.detail.value === undefined ? defaultValue : e.detail.value
        );
      }
    }
  };

  const writeDataAndSetValue = (
    key: string,
    value: T | null | undefined
  ): void => {
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
      window.addEventListener(
        MANUAL_LOCAL_STORAGE_CHANGE,
        storeEventListener as EventListener
      );
    } catch (error) {
      // Ignore error
    } finally {
      setIsInitialised(true);
    }

    return () => {
      window.removeEventListener("storage", storeEventListener);
      window.removeEventListener(
        MANUAL_LOCAL_STORAGE_CHANGE,
        storeEventListener as EventListener
      );
    };
  }, [key]);

  const setValue = useCallback(
    (value: T | null | undefined) => {
      if (key) {
        writeDataAndSetValue(key, value);
      }
    },
    [key]
  );

  return [storedValue, setValue, isInitialised];
}

export default useLocalStorage;
