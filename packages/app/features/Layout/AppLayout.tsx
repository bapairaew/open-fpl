import { Box, Flex } from "@chakra-ui/react";
import NotSupportSmallScreen from "@open-fpl/app/features/Error/NotSupportSmallScreen";
import SideBar from "@open-fpl/app/features/Navigation/SideBar";
import theme from "@open-fpl/app/theme";
import NextNprogress from "nextjs-progressbar";
import { ReactNode } from "react";

const AppLayout = ({ children }: { children?: ReactNode }) => {
  const sidebarWidth = 200;
  return (
    <>
      <NextNprogress color={theme.colors.brand[500]} />
      <Flex h="100%" w="100%" display={["none", "flex"]}>
        <Box flexBasis={`${sidebarWidth}px`} flexShrink={0} flexGrow={0}>
          <SideBar />
        </Box>
        <Box
          flexBasis={`calc(100% - ${sidebarWidth}px)`}
          width={`calc(100% - ${sidebarWidth}px)`}
          flexGrow={0}
          flexShrink={0}
        >
          {children}
        </Box>
      </Flex>
      <NotSupportSmallScreen display={["flex", "none"]} />
    </>
  );
};

export default AppLayout;
