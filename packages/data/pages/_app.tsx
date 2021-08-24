import { ChakraProvider } from "@chakra-ui/react";
import ColorModeManager from "@open-fpl/common/features/ColorMode/ColorModeManager";
import theme from "@open-fpl/common/features/Theme/theme";
import { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeManager />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
