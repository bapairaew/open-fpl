import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import { SWRConfig } from "swr";
import useAnalytics from "~/features/Common/useAnalytics";
import { SettingsContextProvider } from "~/features/Settings/SettingsContext";
import theme from "~/theme";

export default function App({ Component, pageProps }: AppProps) {
  useAnalytics();

  return (
    <SWRConfig
      value={{
        // There is no realtime data in this app
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}
    >
      <ChakraProvider theme={theme}>
        <SettingsContextProvider>
          <Component {...pageProps} />
        </SettingsContextProvider>
      </ChakraProvider>
    </SWRConfig>
  );
}
