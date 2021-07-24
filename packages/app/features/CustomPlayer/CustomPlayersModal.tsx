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
import { AnalyticsCustomPlayer } from "@open-fpl/app/features/Analytics/analyticsTypes";
import AddCustomPlayers from "@open-fpl/app/features/CustomPlayer/AddCustomPlayers";
import { hydrateCustomPlayer } from "@open-fpl/app/features/CustomPlayer/customPlayers";
import { CustomPlayer } from "@open-fpl/app/features/CustomPlayer/customPlayerTypes";
import EditableCustomPlayer from "@open-fpl/app/features/CustomPlayer/EditableCustomPlayer";
import { ClientPlayer } from "@open-fpl/app/features/PlayerData/playerDataTypes";
import { useSettings } from "@open-fpl/app/features/Settings/Settings";
import { removePlayerFromPlans } from "@open-fpl/app/features/TeamPlanner/teamPlan";
import { Team } from "@open-fpl/data/features/RemoteData/fplTypes";
import { usePlausible } from "next-plausible";
import { useMemo, useRef } from "react";

const CustomPlayersModal = ({
  players,
  fplTeams,
  isOpen,
  onClose,
}: {
  players: ClientPlayer[];
  fplTeams: Team[];
  isOpen: boolean;
  onClose: () => void;
}) => {
  const plausible = usePlausible<AnalyticsCustomPlayer>();
  const toast = useToast();
  const { customPlayers, setCustomPlayers, preference, setPreference } =
    useSettings();
  const initialFocusRef = useRef<HTMLInputElement | HTMLButtonElement | null>(
    null
  );

  const hydratedCustomPlayers = useMemo(() => {
    return customPlayers?.map((customPlayer) => {
      const templatePlayer = players.find(
        (p) => p.team.short_name === customPlayer.team.short_name
      );
      return hydrateCustomPlayer(customPlayer, -1, templatePlayer);
    });
  }, [customPlayers]);

  const handleAddPlayer = (customPlayer: CustomPlayer) => {
    if (customPlayers) {
      setCustomPlayers([...customPlayers, customPlayer]);
      if (preference) {
        setPreference({
          ...preference,
          starredPlayers: [
            ...(preference.starredPlayers ?? []),
            customPlayer.id,
          ],
        });
      }
      toast({
        title: "Custom player created.",
        description: `${customPlayer.web_name} has been successfully created.`,
        status: "success",
        isClosable: true,
      });
      plausible("custom-players-add");
    }
  };

  const handleRemovePlayer = (player: ClientPlayer) => {
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
      plausible("custom-players-remove");
    }
  };

  const handleUpdatePlayer = (
    updatedPlayer: CustomPlayer,
    originalPlayer: ClientPlayer
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
      plausible("custom-players-update");
    }
  };

  return (
    <Drawer
      size="md"
      placement="right"
      isOpen={isOpen}
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
