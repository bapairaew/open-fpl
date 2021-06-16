import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import useAnalytics from "~/features/Common/useAnalytics";
import AppLayout from "~/features/Layout/AppLayout";
import { SettingsContextProvider } from "~/features/Settings/SettingsContext";
import theme from "~/theme";

export default function App({ Component, pageProps }: AppProps) {
  useAnalytics();

  return (
    <ChakraProvider theme={theme}>
      <SettingsContextProvider>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </SettingsContextProvider>
    </ChakraProvider>
  );
}
