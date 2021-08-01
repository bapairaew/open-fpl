import { ChakraProvider } from "@chakra-ui/react";
import { host } from "@open-fpl/www/features/Navigation/internalUrls";
import theme from "@open-fpl/common/theme";
import PlausibleProvider from "next-plausible";
import { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  const plausibleDomain = host ? host.replace("www.", "") : ""; // Plausible specifically says not to put www. here
  const plausibleEnabled = host !== undefined;

  return (
    <PlausibleProvider domain={plausibleDomain} enabled={plausibleEnabled}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </PlausibleProvider>
  );
}
