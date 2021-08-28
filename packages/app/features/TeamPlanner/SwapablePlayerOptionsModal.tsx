import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  VStack,
} from "@chakra-ui/react";
import PlayerGridCard from "@open-fpl/app/features/PlayerData/PlayerGridCard";
import { FullChangePlayer } from "@open-fpl/app/features/TeamPlanner/teamPlannerTypes";
import { MouseEventHandler } from "react";

const SwapablePlayerOptionsModal = ({
  isOpen,
  onClose,
  player,
  onSubstituteClick,
  onTransferClick,
  onSetCaptainClick,
  onSetViceCaptainClick,
}: {
  isOpen: boolean;
  onClose: () => void;
  player: FullChangePlayer;
  onSubstituteClick?: MouseEventHandler<HTMLButtonElement>;
  onTransferClick?: MouseEventHandler<HTMLButtonElement>;
  onSetCaptainClick?: MouseEventHandler<HTMLButtonElement>;
  onSetViceCaptainClick?: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <Drawer size="lg" placement="bottom" isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader />
        <DrawerBody pt={4} px={0}>
          <VStack
            as="section"
            aria-label={`${player.web_name} team options`}
            mb={4}
            width="100%"
          >
            <Box my={4}>
              <PlayerGridCard player={player} />
            </Box>
            <Divider />
            <Button
              width="100%"
              variant="ghost"
              onClick={(e) => {
                onTransferClick?.(e);
                onClose();
              }}
            >
              Transfer
            </Button>
            <Button
              width="100%"
              variant="ghost"
              onClick={(e) => {
                onSubstituteClick?.(e);
                onClose();
              }}
            >
              Substitute
            </Button>
            <Button
              width="100%"
              variant="ghost"
              onClick={(e) => {
                onSetCaptainClick?.(e);
                onClose();
              }}
            >
              Set as a captain
            </Button>
            <Button
              width="100%"
              variant="ghost"
              onClick={(e) => {
                onSetViceCaptainClick?.(e);
                onClose();
              }}
            >
              Set as a vice-captain
            </Button>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SwapablePlayerOptionsModal;
