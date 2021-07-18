import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { cache } from "@open-fpl/app/features/Cache/swrCache";
import useAnalytics from "@open-fpl/app/features/Common/useAnalytics";
import { SettingsContextProvider } from "@open-fpl/app/features/Settings/SettingsContext";
import theme from "@open-fpl/app/theme";

export default function App({ Component, pageProps }: AppProps) {
  useAnalytics();

  return (
    <SWRConfig
      value={{
        cache,
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
