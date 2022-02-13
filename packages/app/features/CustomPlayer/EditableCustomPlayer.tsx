import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  BoxProps,
  Button,
  Collapse,
  Divider,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import CustomPlayerForm from "@open-fpl/app/features/CustomPlayer/CustomPlayerForm";
import { CustomPlayer } from "@open-fpl/app/features/CustomPlayer/customPlayerTypes";
import NameSection from "@open-fpl/app/features/PlayerData/NameSection";
import { ClientPlayer } from "@open-fpl/app/features/PlayerData/playerDataTypes";
import { Team } from "@open-fpl/data/features/AppData/teamDataTypes";
import { useRef, useState } from "react";

const EditableCustomPlayer = ({
  player,
  teams,
  onRemove,
  onUpdate,
  ...props
}: BoxProps & {
  player: ClientPlayer;
  teams: Team[];
  onRemove: (player: ClientPlayer) => void;
  onUpdate: (updatedPlayer: CustomPlayer, originalPlayer: ClientPlayer) => void;
}) => {
  const canelRef = useRef<HTMLButtonElement>(null);
  const formInitialFocusRef = useRef<HTMLInputElement>(null);
  const {
    isOpen: isConfirmRemoveOpen,
    onOpen: onConfirmRemoveOpen,
    onClose: onConfirmRemoveClose,
  } = useDisclosure();

  const {
    isOpen: isConfirmEditOpen,
    onOpen: onConfirmEditOpen,
    onClose: onConfirmEditClose,
  } = useDisclosure();

  const [expanded, setExpanded] = useState(false);
  const [updatingPlayer, setUpdatingPlayer] = useState<CustomPlayer | null>(
    null
  );

  const handleConfirmRemove = () => onRemove(player);
  const handleEditSubmit = (updatedPlayer: CustomPlayer) => {
    if (
      player.team.short_name !== updatedPlayer.team.short_name ||
      player.element_type.singular_name_short !==
        updatedPlayer.element_type.singular_name_short
    ) {
      onConfirmEditOpen();
      setUpdatingPlayer(updatedPlayer);
    } else {
      onUpdate(updatedPlayer, player);
      setExpanded(false);
    }
  };

  const handleConfirmEdit = () => {
    if (updatingPlayer) {
      onUpdate(updatingPlayer, player);
      setExpanded(false);
      onConfirmEditClose();
    }
  };

  return (
    <>
      {isConfirmRemoveOpen && (
        <AlertDialog
          isOpen={isConfirmRemoveOpen}
          leastDestructiveRef={canelRef}
          onClose={onConfirmRemoveClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Remove custom player
              </AlertDialogHeader>
              <AlertDialogBody>
                You are removing "{player.web_name}". Are you sure? You can't
                undo this action afterwards.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button
                  variant="outline"
                  ref={canelRef}
                  onClick={onConfirmRemoveClose}
                >
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={handleConfirmRemove} ml={3}>
                  Remove
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      )}
      {isConfirmEditOpen && (
        <AlertDialog
          isOpen={isConfirmEditOpen}
          leastDestructiveRef={canelRef}
          onClose={onConfirmEditClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Edit custom player
              </AlertDialogHeader>
              <AlertDialogBody>
                Updating {player.web_name}'s position or team will remove him
                from all team plans in all profiles. Are you sure? You can't
                undo this action afterwards.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button
                  variant="outline"
                  ref={canelRef}
                  onClick={onConfirmEditClose}
                >
                  Cancel
                </Button>
                <Button onClick={handleConfirmEdit} ml={3}>
                  Continue
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      )}
      <Box width="100%" {...props}>
        <Collapse in={!expanded} animateOpacity>
          <Flex flexDirection="column" width="100%" borderWidth={1}>
            <NameSection player={player} />
            <Divider />
            <Flex height="41px">
              <Button
                width="100%"
                borderRadius="none"
                variant="ghost"
                onClick={() => setExpanded(true)}
              >
                Edit
              </Button>
              <Divider orientation="vertical" />
              <Button
                width="100%"
                borderRadius="none"
                variant="ghost"
                colorScheme="red"
                onClick={onConfirmRemoveOpen}
              >
                Remove
              </Button>
            </Flex>
          </Flex>
        </Collapse>
        <Collapse in={expanded} animateOpacity>
          {expanded && (
            <CustomPlayerForm
              id={`${player.id}-edit-custom-player`}
              initialPlayer={player}
              teams={teams}
              initialFocusRef={expanded ? formInitialFocusRef : undefined}
              showCloseButton
              onCloseClick={() => setExpanded(false)}
              onSubmit={handleEditSubmit}
              buttonLabel="Save"
            />
          )}
        </Collapse>
      </Box>
    </>
  );
};

export default EditableCustomPlayer;
