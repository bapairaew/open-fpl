import { Box, Flex } from "@chakra-ui/react";
import { AppDrawerContexttProvider } from "@open-fpl/app/features/Layout/AppDrawer";
import SideBar from "@open-fpl/app/features/Navigation/SideBar";
import { ReactNode } from "react";

const AppLayout = ({ children }: { children?: ReactNode }) => {
  const sideBarWidth = 200;
  const mainWidth = { base: "100%", sm: `calc(100% - ${sideBarWidth - 1}px)` };
  return (
    <AppDrawerContexttProvider>
      <Flex h="100%" w="100%">
        <Box
          display={{ base: "none", sm: "block" }}
          flexBasis={`${sideBarWidth}px`}
          width={`${sideBarWidth}px`}
          flexShrink={0}
          flexGrow={0}
          overflowX="hidden"
          borderRightWidth={1}
        >
          <SideBar />
        </Box>
        <Box
          flexBasis={mainWidth}
          width={mainWidth}
          flexGrow={0}
          flexShrink={0}
        >
          {children}
        </Box>
      </Flex>
    </AppDrawerContexttProvider>
  );
};

export default AppLayout;
