import { Divider, Heading, HStack } from "@chakra-ui/react";
import { AppDrawerOpenButton } from "@open-fpl/app/features/Layout/AppDrawer";

const DashboardToolbar = () => {
  return (
    <HStack
      alignItems="center"
      height="50px"
      width="100%"
      px={1}
      spacing={1}
      borderBottomWidth={1}
    >
      <HStack spacing={1} height="50px" display={{ base: "flex", sm: "none" }}>
        <AppDrawerOpenButton />
        <Divider orientation="vertical" />
      </HStack>
      <HStack
        spacing={1}
        height="50px"
        flexGrow={{ base: 1, sm: 0 }}
        flexBasis={{ base: "100%", sm: "auto" }}
      >
        <Heading px={2} fontWeight="black" fontSize="lg" flexGrow={1}>
          Dashboard
        </Heading>
      </HStack>
    </HStack>
  );
};

export default DashboardToolbar;
