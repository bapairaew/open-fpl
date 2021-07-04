import { Box, Grid } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { Gameweek, Player } from "~/features/AppData/appDataTypes";
import SelectedTeam from "~/features/TransferPlanner/SelectedTeam";
import { makeTeamGroupObject } from "~/features/TransferPlanner/teamGroupObject";
import TransferMarket from "~/features/TransferPlanner/TransferMarket";
import { isSwapable } from "~/features/TransferPlanner/transferPlan";
import {
  ChangePlayer,
  FullChangePlayer,
} from "~/features/TransferPlanner/transferPlannerTypes";

const TeamManager = ({
  mode = "default",
  team,
  players,
  gameweeks,
  onSwap,
  onTransfer,
  onPreseasonSwap,
  onPreseasonTransfer,
  onSetCaptain,
  onSetViceCaptain,
}: {
  mode?: "default" | "preseason";
  team: FullChangePlayer[];
  players: Player[];
  gameweeks: Gameweek[];
  onSwap: (selectedPlayer: ChangePlayer, targetPlayer: ChangePlayer) => void;
  onTransfer: (selectedPlayer: ChangePlayer, targetPlayer: Player) => void;
  onPreseasonSwap: (
    selectedPlayer: FullChangePlayer,
    targetPlayer: FullChangePlayer
  ) => void;
  onPreseasonTransfer: (
    selectedPlayer: FullChangePlayer,
    targetPlayer: Player
  ) => void;
  onSetCaptain: (player: FullChangePlayer) => void;
  onSetViceCaptain: (player: FullChangePlayer) => void;
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<FullChangePlayer | null>(
    null
  );

  const teamObject = useMemo(() => makeTeamGroupObject(team), [team, mode]);

  const transferablePlayers = useMemo(() => {
    if (!selectedPlayer) return [];
    return players.filter(
      (p) =>
        p.element_type.singular_name_short ===
        selectedPlayer.element_type.singular_name_short
    );
  }, [players, selectedPlayer]);

  const handlePlayerSelect = (targetPlayer: FullChangePlayer | null) => {
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

  const handleTransferSectionPlayerSelect = (targetPlayer: Player | null) => {
    if (selectedPlayer) {
      if (!targetPlayer) {
        setSelectedPlayer(null);
      } else if (mode === "preseason" || selectedPlayer.isPlaceholder) {
        onPreseasonTransfer(selectedPlayer, targetPlayer);
        setSelectedPlayer(null);
      } else if (team.every((p) => p.id !== targetPlayer.id)) {
        onTransfer(selectedPlayer, targetPlayer);
        setSelectedPlayer(null);
      }
    }
  };

  return (
    <Grid templateColumns="auto 250px" height="100%">
      <Box borderRightWidth={1} height="100%">
        <SelectedTeam
          teamObject={teamObject}
          gameweeks={gameweeks}
          selectedPlayer={selectedPlayer}
          onPlayerSelect={handlePlayerSelect}
          onSetCaptain={onSetCaptain}
          onSetViceCaptain={onSetViceCaptain}
        />
      </Box>
      <Box height="100%">
        {transferablePlayers.length > 0 ? (
          <TransferMarket
            team={team}
            players={transferablePlayers}
            gameweeks={gameweeks}
            onPlayerSelect={handleTransferSectionPlayerSelect}
          />
        ) : (
          <Box py={10} px={4} textAlign="center" color="gray.600">
            Click on a player on the left to make a transfer
          </Box>
        )}
      </Box>
    </Grid>
  );
};

export default TeamManager;
