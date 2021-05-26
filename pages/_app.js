import {
  Box,
  Button,
  Flex,
  Grid,
  NavLink as A,
  Text,
} from "@theme-ui/components";
import Link from "next/link";
import { useRouter } from "next/router";
import { IoPeopleCircle, IoSwapHorizontalSharp } from "react-icons/io5";
import { ThemeProvider } from "theme-ui";
import useAnalytics from "~/libs/useAnalytics";
import p from "~/package.json";
import theme from "~/theme";

const SideBarNav = ({ href, icon, children }) => {
  const router = useRouter();
  const isActive = router.route === href;
  return (
    <Box
      my={2}
      p={2}
      as="li"
      sx={{
        color: isActive ? "primary" : "text",
        borderRadius: "default",
      }}
    >
      <Link href={href} passHref>
        <A as="a" sx={{ display: "flex", alignItems: "center" }}>
          {icon}
          <Text ml={3} sx={{ fontWeight: "bold" }}>
            {children}
          </Text>
        </A>
      </Link>
    </Box>
  );
};

export default function App({ Component, pageProps }) {
  useAnalytics();

  return (
    <ThemeProvider theme={theme}>
      <Grid columns={["300px 1fr"]} sx={{ height: "100%" }}>
        <Flex
          px={4}
          pt={1}
          as="nav"
          sx={{ height: "100%", flexDirection: "column" }}
        >
          <Box as="ul" sx={{ p: 0, listStyle: "none", flexGrow: 1 }}>
            <Box my={4} p={2} as="li">
              <Link href="/" passHref>
                <A as="a" sx={{ display: "flex", alignItems: "center" }}>
                  <Text sx={{ fontWeight: "display", fontSize: 5 }}>
                    Open FPL
                  </Text>
                </A>
              </Link>
            </Box>
            <SideBarNav href="/" icon={<IoPeopleCircle size="2rem" />}>
              Player Explorer
            </SideBarNav>
            <SideBarNav
              href="/transfers"
              icon={<IoSwapHorizontalSharp size="2rem" />}
            >
              Transfer Planner
            </SideBarNav>
          </Box>
          <Grid p={3} row={[2]} gap={3}>
            <Link href="/help" passHref>
              <Button as="a">How to use this?</Button>
            </Link>
            <Text color="gray" sx={{ fontSize: 1, textAlign: "center" }}>
              Version: {p.version}
            </Text>
          </Grid>
        </Flex>
        <Box sx={{ height: "100%", overflow: "auto" }}>
          <Component {...pageProps} />
        </Box>
      </Grid>
    </ThemeProvider>
  );
}
