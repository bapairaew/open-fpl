import { Box, Button, Flex, Grid, NavLink, Text } from "@theme-ui/components";
import Link from "next/link";
import { IoPeopleCircle, IoSwapHorizontalSharp } from "react-icons/io5";
import { ThemeProvider } from "theme-ui";
import useAnalytics from "~/libs/useAnalytics";
import p from "~/package.json";
import theme from "~/theme";

export default function App({ Component, pageProps }) {
  useAnalytics();

  return (
    <ThemeProvider theme={theme}>
      <Grid columns={["300px 1fr"]}>
        <Flex
          px={4}
          pt={1}
          as="nav"
          sx={{ height: "100vh", flexDirection: "column" }}
        >
          <Box as="ul" sx={{ p: 0, listStyle: "none", flexGrow: 1 }}>
            <Box my={4} p={2} as="li">
              <Link href="/" passHref>
                <NavLink as="a" sx={{ display: "flex", alignItems: "center" }}>
                  <Text sx={{ fontWeight: "display", fontSize: 5 }}>
                    Open FPL
                  </Text>
                </NavLink>
              </Link>
            </Box>
            <Box my={2} p={2} as="li">
              <Link href="/" passHref>
                <NavLink as="a" sx={{ display: "flex", alignItems: "center" }}>
                  <IoPeopleCircle size="2rem" />
                  <Text ml={3} sx={{ fontWeight: "bold" }}>
                    Player Explorer
                  </Text>
                </NavLink>
              </Link>
            </Box>
            <Box my={2} p={2} as="li">
              <NavLink
                sx={{
                  opacity: 0.5,
                  display: "flex",
                  alignItems: "center",
                  pointerEvents: "none",
                }}
              >
                <IoSwapHorizontalSharp size="2rem" />
                <Text ml={3} sx={{ fontWeight: "bold" }}>
                  Transfer Planner
                </Text>
              </NavLink>
            </Box>
          </Box>
          <Grid p={3} row={[2]} gap={2}>
            <Link href="/help" passHref>
              <Button as="a">How to use this?</Button>
            </Link>
            <Text color="gray" sx={{ fontSize: 1 }}>
              Version: {p.version}
            </Text>
          </Grid>
        </Flex>
        <Box sx={{ height: "100vh", overflow: "auto" }}>
          <Component {...pageProps} />
        </Box>
      </Grid>
    </ThemeProvider>
  );
}
