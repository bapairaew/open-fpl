import { Box, Grid } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { isSwapable } from "~/features/TransferPlanner/changes";
import SelectedTeam from "~/features/TransferPlanner/SelectedTeam";
import TransferMarket from "~/features/TransferPlanner/TransferMarket";
import {
  ChangePlayer,
  FullChangePlayer,
  GroupedTeam,
} from "~/features/TransferPlanner/transferPlannerTypes";
import { Gameweek, Player } from "../AppData/appDataTypes";

const makeTeamGroupObject = (team: FullChangePlayer[]): GroupedTeam => {
  const GKP = [];
  const DEF = [];
  const MID = [];
  const FWD = [];
  const bench = [];

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
  onTransfer: (
    selectedPlayer: ChangePlayer,
    targetPlayer: ChangePlayer
  ) => void;
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

  const handlePlayerSelect = (targetPlayer: FullChangePlayer) => {
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
  };

  const handleTransferSectionPlayerSelect = (
    targetPlayer: FullChangePlayer
  ) => {
    if (!targetPlayer) {
      setSelectedPlayer(null);
    } else if (team.every((p) => p.id !== targetPlayer.id)) {
      onTransfer(selectedPlayer, targetPlayer);
      setSelectedPlayer(null);
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
