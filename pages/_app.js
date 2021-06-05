import { ChakraProvider } from "@chakra-ui/react";
import AppLayout from "~/components/Layout/AppLayout";
import { SettingsContextProvider } from "~/components/Settings/SettingsContext";
import useAnalytics from "~/libs/useAnalytics";
import theme from "~/theme";

export default function App({ Component, pageProps }) {
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
