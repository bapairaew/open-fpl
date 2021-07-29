import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import { ClientPlayer } from "@open-fpl/app/features/PlayerData/playerDataTypes";
import SelectedTeam from "@open-fpl/app/features/TeamPlanner/SelectedTeam";
import { makeTeamGroupObject } from "@open-fpl/app/features/TeamPlanner/teamGroupObject";
import { isSwapable } from "@open-fpl/app/features/TeamPlanner/teamPlan";
import {
  ChangePlayer,
  FullChangePlayer,
} from "@open-fpl/app/features/TeamPlanner/teamPlannerTypes";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

const TransferMarket = dynamic(
  () => import("@open-fpl/app/features/TeamPlanner/TransferMarket")
);

const TeamManager = ({
  mode = "default",
  team,
  players,
  onSwap,
  onTransfer,
  onPreseasonSwap,
  onPreseasonTransfer,
  onSetCaptain,
  onSetViceCaptain,
}: {
  mode?: "default" | "preseason";
  team: FullChangePlayer[];
  players: ClientPlayer[];
  onSwap: (selectedPlayer: ChangePlayer, targetPlayer: ChangePlayer) => void;
  onTransfer: (
    selectedPlayer: ChangePlayer,
    targetPlayer: ClientPlayer
  ) => void;
  onPreseasonSwap: (
    selectedPlayer: FullChangePlayer,
    targetPlayer: FullChangePlayer
  ) => void;
  onPreseasonTransfer: (
    selectedPlayer: FullChangePlayer,
    targetPlayer: ClientPlayer
  ) => void;
  onSetCaptain: (player: FullChangePlayer) => void;
  onSetViceCaptain: (player: FullChangePlayer) => void;
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<FullChangePlayer | null>(
    null
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const teamObject = useMemo(() => makeTeamGroupObject(team), [team, mode]);

  const transferablePlayers = useMemo(() => {
    if (!selectedPlayer) return [];
    return players.filter(
      (p) =>
        p.element_type.singular_name_short ===
        selectedPlayer.element_type.singular_name_short
    );
  }, [players, selectedPlayer]);

  const handleSwap = (targetPlayer: FullChangePlayer | null) => {
    if (!selectedPlayer) {
      setSelectedPlayer(targetPlayer);
    } else if (targetPlayer?.id === selectedPlayer.id) {
      setSelectedPlayer(null);
    } else if (
      targetPlayer &&
      (mode === "preseason" ||
        selectedPlayer.isPlaceholder ||
        targetPlayer?.isPlaceholder)
    ) {
      onPreseasonSwap(selectedPlayer, targetPlayer);
      setSelectedPlayer(null);
    } else if (
      targetPlayer &&
      isSwapable(selectedPlayer, targetPlayer, teamObject)
    ) {
      onSwap(selectedPlayer, targetPlayer);
      setSelectedPlayer(null);
    } else {
      setSelectedPlayer(null);
    }
  };

  const handlePlayerSub = (targetPlayer: FullChangePlayer | null) => {
    handleSwap(targetPlayer);
  };

  const handlePlayerTransfer = (targetPlayer: FullChangePlayer | null) => {
    handleSwap(targetPlayer);
    onOpen();
  };

  const handleCancel = () => {
    setSelectedPlayer(null);
    onClose();
  };

  const handleTransferSectionPlayerSelect = (
    targetPlayer: ClientPlayer | null
  ) => {
    if (selectedPlayer) {
      if (!targetPlayer) {
        setSelectedPlayer(null);
        onClose();
      } else if (mode === "preseason" || selectedPlayer.isPlaceholder) {
        onPreseasonTransfer(selectedPlayer, targetPlayer);
        setSelectedPlayer(null);
        onClose();
      } else if (team.every((p) => p.id !== targetPlayer.id)) {
        onTransfer(selectedPlayer, targetPlayer);
        setSelectedPlayer(null);
        onClose();
      }
    }
  };

  return (
    <>
      <Box height="100%">
        <SelectedTeam
          teamObject={teamObject}
          selectedPlayer={selectedPlayer}
          onPlayerSub={handlePlayerSub}
          onPlayerTransfer={handlePlayerTransfer}
          onSetCaptain={onSetCaptain}
          onSetViceCaptain={onSetViceCaptain}
          onCancel={handleCancel}
        />
      </Box>

      {isOpen && (
        <Drawer
          isOpen={isOpen}
          placement="right"
          onClose={handleCancel}
          size="xl"
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader />
            <DrawerBody px={0} pb={0} pt={4}>
              <TransferMarket
                team={team}
                selectedPlayer={selectedPlayer}
                players={transferablePlayers}
                onPlayerSelect={handleTransferSectionPlayerSelect}
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default TeamManager;
