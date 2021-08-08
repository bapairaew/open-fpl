import { ChakraProvider, useColorMode } from "@chakra-ui/react";
import { cache } from "@open-fpl/app/features/Cache/swrCache";
import { host } from "@open-fpl/app/features/Navigation/internalUrls";
import { SettingsContextProvider } from "@open-fpl/app/features/Settings/Settings";
import ColorModeManager from "@open-fpl/common/features/ColorMode/ColorModeManager";
import theme from "@open-fpl/common/features/Theme/theme";
import PlausibleProvider from "next-plausible";
import { AppProps } from "next/app";
import NextNprogress from "nextjs-progressbar";
import { SWRConfig } from "swr";

export default function App({ Component, pageProps }: AppProps) {
  const plausibleDomain = host ? host.replace("www.", "") : ""; // Plausible specifically says not to put www. here
  const plausibleEnabled = host !== undefined;
  const { colorMode } = useColorMode();

  return (
    <PlausibleProvider domain={plausibleDomain} enabled={plausibleEnabled}>
      <SWRConfig
        value={{
          cache,
          // Realtime data in this app is minority, so we can default not to auto revalidate
          revalidateOnFocus: false,
          revalidateOnReconnect: false,
          fetcher: (resource, init) =>
            fetch(resource, init).then((res) => res.json()),
        }}
      >
        <ChakraProvider theme={theme}>
          <SettingsContextProvider>
            <NextNprogress
              color={
                colorMode === "dark"
                  ? theme.colors.brand[200]
                  : theme.colors.brand[500]
              }
              options={{ showSpinner: false }}
            />
            <ColorModeManager />
            <Component {...pageProps} />
          </SettingsContextProvider>
        </ChakraProvider>
      </SWRConfig>
    </PlausibleProvider>
  );
}
