import { Box, Flex, useTheme } from "@chakra-ui/react";
import NextNprogress from "nextjs-progressbar";
import NotSupportSmallScreen from "~/components/Error/NotSupportSmallScreen";
import SideBar from "~/components/Navigation/SideBar";

const AppLayout = ({ children }) => {
  const theme = useTheme();
  return (
    <>
      <NextNprogress color={theme.colors.brand[500]} />
      <Flex h="100%" w="100%" display={["none", "flex"]}>
        <Box flexBasis="200px" flexShrink={0}>
          <SideBar />
        </Box>
        <Box flexBasis="100%">{children}</Box>
      </Flex>
      <NotSupportSmallScreen display={["flex", "none"]} />
    </>
  );
};

export default AppLayout;
