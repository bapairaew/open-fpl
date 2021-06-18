import { Box, Grid } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { Gameweek, Player } from "~/features/AppData/appDataTypes";
import { isSwapable } from "~/features/TransferPlanner/changes";
import SelectedTeam from "~/features/TransferPlanner/SelectedTeam";
import TransferMarket from "~/features/TransferPlanner/TransferMarket";
import {
  ChangePlayer,
  FullChangePlayer,
  GroupedTeam,
} from "~/features/TransferPlanner/transferPlannerTypes";

const makeTeamGroupObject = (team: FullChangePlayer[]): GroupedTeam => {
  const GKP: FullChangePlayer[] = [];
  const DEF: FullChangePlayer[] = [];
  const MID: FullChangePlayer[] = [];
  const FWD: FullChangePlayer[] = [];
  const bench: FullChangePlayer[] = [];

  team.forEach((player) => {
    if (player.pick.position <= 11) {
      switch (player.element_type.singular_name_short) {
        case "GKP":
          GKP.push(player);
          break;
        case "DEF":
          DEF.push(player);
          break;
        case "MID":
          MID.push(player);
          break;
        case "FWD":
          FWD.push(player);
          break;
      }
    } else {
      bench.push(player);
    }
  });

  return {
    GKP,
    DEF,
    MID,
    FWD,
    bench,
  };
};

const TeamManager = ({
  team,
  players,
  gameweeks,
  onSwap,
  onTransfer,
}: {
  team: FullChangePlayer[];
  players: Player[];
  gameweeks: Gameweek[];
  onSwap: (selectedPlayer: ChangePlayer, targetPlayer: ChangePlayer) => void;
  onTransfer: (selectedPlayer: ChangePlayer, targetPlayer: Player) => void;
}) => {
  const teamObject = makeTeamGroupObject(team);
  const [selectedPlayer, setSelectedPlayer] =
    useState<FullChangePlayer | null>(null);

  const transferablePlayers = useMemo(() => {
    if (!selectedPlayer) return [];
    return players.filter(
      (p) =>
        p.element_type.singular_name_short ===
        selectedPlayer.element_type.singular_name_short
    );
  }, [players, selectedPlayer]);

  const handlePlayerSelect = (targetPlayer: FullChangePlayer | null) => {
    if (targetPlayer) {
      if (!selectedPlayer) {
        setSelectedPlayer(targetPlayer);
      } else if (targetPlayer?.id === selectedPlayer.id) {
        setSelectedPlayer(null);
      } else if (isSwapable(selectedPlayer, targetPlayer, teamObject)) {
        onSwap(selectedPlayer, targetPlayer);
        setSelectedPlayer(null);
      } else {
        setSelectedPlayer(null);
      }
    }
  };

  const handleTransferSectionPlayerSelect = (targetPlayer: Player | null) => {
    if (selectedPlayer) {
      if (!targetPlayer) {
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
        />
      </Box>
      <Box height="100%">
        {selectedPlayer ? (
          <TransferMarket
            team={team}
            players={transferablePlayers}
            gameweeks={gameweeks}
            onPlayerSelect={handleTransferSectionPlayerSelect}
          />
        ) : (
          <Box py={10} px={4} textAlign="center" color="gray">
            Click on a player on the left to make a transfer
          </Box>
        )}
      </Box>
    </Grid>
  );
};

export default TeamManager;
