import { useCallback, useEffect, useState } from "react";

function useLocalStorage(key, defaultValue) {
  const [storedValue, setStoredValue] = useState(defaultValue);
  const [isInitialised, setIsInitialised] = useState(false);

  const storeEventListener = (e) => {
    if (e.key === key) {
      setStoredValue(JSON.parse(e.newValue));
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
    } catch (error) {
      // Ignore error
    } finally {
      setIsInitialised(true);
    }

    return () => window.removeEventListener("storage", storeEventListener);
  }, [key]);

  const setValue = useCallback(
    (value) => writeDataAndSetValue(key, value),
    [key]
  );

  return [storedValue, setValue, isInitialised];
}

export default useLocalStorage;
