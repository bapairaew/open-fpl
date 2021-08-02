import { ColorModeScript, useColorMode } from "@chakra-ui/react";
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

    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", onDarkMode);
    };
  }, []);

  return (
    <>
      <ColorModeScript initialColorMode="system" />
    </>
  );
};

export default ColorModeManager;
