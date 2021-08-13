import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Box,
} from "@chakra-ui/react";

const DeadlineCountdownModal = ({
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
          <Box>Top transfer in</Box>
          <Box>
            Name, team, pos, price, price change, ownership, ownership change
          </Box>
          <Box>Top transfer out</Box>
          <Box>
            Name, team, pos, price, price change, ownership, ownership change
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default DeadlineCountdownModal;
