import { Box, ChakraProvider, Flex } from "@chakra-ui/react";
import NextNprogress from "nextjs-progressbar";
import SideBar from "~/components/Navigation/SideBar";
import { SettingsContextProvider } from "~/components/Settings/SettingsContext";
import useAnalytics from "~/libs/useAnalytics";
import theme from "~/theme";

export default function App({ Component, pageProps }) {
  useAnalytics();

  return (
    <ChakraProvider theme={theme}>
      <SettingsContextProvider>
        <NextNprogress color={theme.colors.brand[500]} />
        <Flex h="100%" w="100%">
          <Box flexBasis="200px" flexShrink={0}>
            <SideBar />
          </Box>
          <Box flexBasis="100%">
            <Component {...pageProps} />
          </Box>
        </Flex>
      </SettingsContextProvider>
    </ChakraProvider>
  );
}
