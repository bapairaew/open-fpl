import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import useAnalytics from "~/features/Common/useAnalytics";
import { SettingsContextProvider } from "~/features/Settings/SettingsContext";
import theme from "~/theme";

export default function App({ Component, pageProps }: AppProps) {
  useAnalytics();

  return (
    <ChakraProvider theme={theme}>
      <SettingsContextProvider>
        <Component {...pageProps} />
      </SettingsContextProvider>
    </ChakraProvider>
  );
}
