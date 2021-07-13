import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useRef } from "react";
import AddCustomPlayers from "~/features/CustomPlayer/AddCustomPlayers";
import { hydrateCustomPlayer } from "~/features/CustomPlayer/customPlayers";
import { CustomPlayer } from "~/features/CustomPlayer/customPlayerTypes";
import EditableCustomPlayer from "~/features/CustomPlayer/EditableCustomPlayer";
import { Player } from "~/features/PlayerData/playerDataTypes";
import { Team } from "~/features/RemoteData/fplTypes";
import { useSettings } from "~/features/Settings/SettingsContext";
import { removePlayerFromPlans } from "~/features/TransferPlanner/transferPlan";

const CustomPlayersModal = ({
  players,
  fplTeams,
  isOpen,
  onClose,
}: {
  players: Player[];
  fplTeams: Team[];
  isOpen: boolean;
  onClose: () => void;
}) => {
  const toast = useToast();
  const { customPlayers, setCustomPlayers, starredPlayers, setStarredPlayers } =
    useSettings();
  const initialFocusRef = useRef<HTMLInputElement | HTMLButtonElement | null>(
    null
  );

  const hydratedCustomPlayers = useMemo(() => {
    return customPlayers?.map((customPlayer) => {
      const templatePlayer = players.find(
        (p) => p.team.short_name === customPlayer.team.short_name
      );
      return hydrateCustomPlayer(customPlayer, templatePlayer);
    });
  }, [customPlayers]);

  const handleAddPlayer = (customPlayer: CustomPlayer) => {
    if (customPlayers) {
      setCustomPlayers([...customPlayers, customPlayer]);
      if (starredPlayers) {
        setStarredPlayers([...starredPlayers, customPlayer.id]);
      }
      toast({
        title: "Custom player created.",
        description: `${customPlayer.web_name} has been successfully created.`,
        status: "success",
        isClosable: true,
      });
    }
  };

  const handleRemovePlayer = (player: Player) => {
    if (customPlayers) {
      setCustomPlayers(
        customPlayers.filter((customPlayer) => customPlayer.id !== player.id)
      );
      toast({
        title: "Custom player removed.",
        description: `${player.web_name} has been successfully removed.`,
        status: "success",
        isClosable: true,
      });
    }
  };

  const handleUpdatePlayer = (
    updatedPlayer: CustomPlayer,
    originalPlayer: Player
  ) => {
    if (customPlayers) {
      setCustomPlayers(
        customPlayers.map((customPlayer) =>
          customPlayer.id === originalPlayer.id ? updatedPlayer : customPlayer
        )
      );

      if (
        originalPlayer.team.short_name !== updatedPlayer.team.short_name ||
        originalPlayer.element_type.singular_name_short !==
          updatedPlayer.element_type.singular_name_short
      ) {
        removePlayerFromPlans(originalPlayer);
      }

      toast({
        title: "Custom player updated.",
        description: `${updatedPlayer.web_name} has been successfully updated.`,
        status: "success",
        isClosable: true,
      });
    }
  };

  return (
    <Drawer
      size="md"
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      initialFocusRef={initialFocusRef}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader fontWeight="black">Custom Players</DrawerHeader>
        <DrawerBody>
          <AddCustomPlayers
            fplTeams={fplTeams}
            initialFocusRef={initialFocusRef}
            hasExistedPlayers={customPlayers ? customPlayers.length > 0 : false}
            onPlayerAdded={handleAddPlayer}
          />
          <VStack my={4}>
            {hydratedCustomPlayers?.map((customPlayer) => (
              <EditableCustomPlayer
                key={customPlayer.id}
                player={customPlayer}
                fplTeams={fplTeams}
                onRemove={handleRemovePlayer}
                onUpdate={handleUpdatePlayer}
              />
            ))}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default CustomPlayersModal;
