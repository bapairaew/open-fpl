import { Box } from "@chakra-ui/react";
import FullScreenMessage, {
  FullScreenMessageProps,
} from "@open-fpl/common/features/Layout/FullScreenMessage";
import { AppDrawerOpenButton } from "@open-fpl/app/features/Layout/AppDrawer";

const FullScreenMessageWithAppDrawer = (props: FullScreenMessageProps) => {
  return (
    <>
      <Box
        position="absolute"
        top={1}
        left={1}
        display={{ base: "box", sm: "none" }}
      >
        <AppDrawerOpenButton />
      </Box>
      <FullScreenMessage height="100%" {...props} />
    </>
  );
};

export default FullScreenMessageWithAppDrawer;
