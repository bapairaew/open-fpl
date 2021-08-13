import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Box,
} from "@chakra-ui/react";

const DashboardLivePointsModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Drawer size="lg" isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader />
        <DrawerCloseButton />
        <DrawerBody pt={4}>
          <Box>Top players</Box>
          <Box>Name, team, pos, ownership, points</Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default DashboardLivePointsModal;
