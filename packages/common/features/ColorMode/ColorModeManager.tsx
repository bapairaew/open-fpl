import { useColorMode } from "@chakra-ui/react";
import { useEffect } from "react";

const ColorModeManager = () => {
  const { setColorMode } = useColorMode();

  useEffect(() => {
    const onDarkMode = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setColorMode("dark");
      } else {
        setColorMode("light");
      }
    };

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", onDarkMode);

    if (window.matchMedia("(prefers-color-scheme: dark)")) {
      setColorMode("dark");
    } else {
      setColorMode("light");
    }

    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", onDarkMode);
    };
  }, []);

  return null;
};

export default ColorModeManager;
