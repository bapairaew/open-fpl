import { Box, Grid } from "@chakra-ui/react";
import { ClientPlayer } from "@open-fpl/app/features/PlayerData/playerDataTypes";
import SelectedTeam from "@open-fpl/app/features/TeamPlanner/SelectedTeam";
import { makeTeamGroupObject } from "@open-fpl/app/features/TeamPlanner/teamGroupObject";
import { isSwapable } from "@open-fpl/app/features/TeamPlanner/teamPlan";
import {
  ChangePlayer,
  FullChangePlayer,
} from "@open-fpl/app/features/TeamPlanner/teamPlannerTypes";
import TransferMarket from "@open-fpl/app/features/TeamPlanner/TransferMarket";
import { useMemo, useState } from "react";

const TeamManager = ({
  mode = "default",
  team,
  players,
  gameweekDelta,
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
  gameweekDelta: number;
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

  const handleTransferSectionPlayerSelect = (
    targetPlayer: ClientPlayer | null
  ) => {
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
    <Grid templateColumns="auto 270px" height="100%">
      <Box borderRightWidth={1} height="100%">
        <SelectedTeam
          teamObject={teamObject}
          selectedPlayer={selectedPlayer}
          onPlayerSelect={handlePlayerSelect}
          onSetCaptain={onSetCaptain}
          onSetViceCaptain={onSetViceCaptain}
          gameweekDelta={gameweekDelta}
        />
      </Box>
      <Box height="100%">
        {transferablePlayers.length > 0 ? (
          <TransferMarket
            team={team}
            players={transferablePlayers}
            onPlayerSelect={handleTransferSectionPlayerSelect}
            gameweekDelta={gameweekDelta}
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
