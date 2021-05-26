import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
} from "@theme-ui/components";
import fs from "fs";
import glob from "glob-promise";
import { useMemo, useState } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import PlayerCard from "~/components/PlayerCard";
import PlayerSearchBar, {
  SEARCH_BAR_HEIGHT,
} from "~/components/PlayerSearchBar";
import { getTeamPicks, getTeamTransfers } from "~/libs/fpl";
import { makePlayersData } from "~/libs/players";

const getDataFromFiles = async (pattern) => {
  return Promise.all(
    (await glob(pattern)).map((p) => fs.promises.readFile(p).then(JSON.parse))
  );
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export const getStaticProps = async ({ params }) => {
  const [
    fpl,
    understat,
    fplTeams,
    understatTeams,
    playersLinks,
    teamsLinks,
    fplGameweeks,
    teamcolorcodes,
  ] = await Promise.all([
    await getDataFromFiles("./data/fpl/*.json"),
    await getDataFromFiles("./data/understat/*.json"),
    fs.promises.readFile("./data/fpl_teams/data.json").then(JSON.parse),
    await getDataFromFiles("./data/understat_teams/*.json"),
    fs.promises.readFile("./data/links/players.json").then(JSON.parse),
    fs.promises.readFile("./data/links/teams.json").then(JSON.parse),
    fs.promises.readFile("./data/fpl_gameweeks/data.json").then(JSON.parse),
    fs.promises.readFile("./data/teamcolorcodes/data.json").then(JSON.parse),
  ]);

  const { players, gameweeks } = makePlayersData({
    fpl,
    understat,
    fplTeams,
    understatTeams,
    playersLinks,
    teamsLinks,
    fplGameweeks,
    teamcolorcodes,
  });

  const event = gameweeks[0].id;
  const { picks, entry_history } = await getTeamPicks(params.id, event);
  const transfers = await getTeamTransfers(params.id);

  return {
    props: {
      players,
      gameweeks,
      picks,
      entry_history,
      transfers,
    },
  };
};

const isSwapable = (
  selectedPlayer,
  targetPlayer,
  { GKP, DEF, MID, FWD, bench }
) => {
  if (!selectedPlayer || targetPlayer.id === selectedPlayer.id) {
    return false;
  }

  const isTargetPlayerSamePosition =
    targetPlayer.element_type.singular_name_short ===
    selectedPlayer.element_type.singular_name_short;

  if (isTargetPlayerSamePosition) {
    return true;
  }

  const minStartingPosition = {
    GKP: 1,
    DEF: 3,
    MID: 2,
    FWD: 1,
  };

  const maxStartingPosition = {
    GKP: 1,
    DEF: 5,
    MID: 5,
    FWD: 3,
  };

  const isTargetPlayerOnBench = bench.some((p) => p.id === targetPlayer.id);
  const isSelectedPlayerOnBench = bench.some((p) => p.id === selectedPlayer.id);

  const startingMap = { GKP, DEF, MID, FWD };

  const currentStartingWithSameSelectedPosition =
    startingMap[selectedPlayer.element_type.singular_name_short].length;
  const minStartingWithSameSelectedPosition =
    minStartingPosition[selectedPlayer.element_type.singular_name_short];
  const maxStartingWithSameSelectedPosition =
    maxStartingPosition[selectedPlayer.element_type.singular_name_short];

  const currentStartingWithSameTargetPosition =
    startingMap[targetPlayer.element_type.singular_name_short].length;
  const minStartingWithSameTargetPosition =
    minStartingPosition[targetPlayer.element_type.singular_name_short];
  const maxStartingWithSameTargetPosition =
    maxStartingPosition[targetPlayer.element_type.singular_name_short];

  if (isSelectedPlayerOnBench) {
    if (isTargetPlayerOnBench)
      return selectedPlayer.element_type.singular_name_short !== "GKP";
    else {
      return (
        currentStartingWithSameSelectedPosition + 1 <=
          maxStartingWithSameSelectedPosition &&
        currentStartingWithSameTargetPosition - 1 >=
          minStartingWithSameTargetPosition
      );
    }
  } else {
    if (isTargetPlayerOnBench) {
      return (
        currentStartingWithSameSelectedPosition - 1 >=
          minStartingWithSameSelectedPosition &&
        currentStartingWithSameTargetPosition + 1 <=
          maxStartingWithSameTargetPosition
      );
    }
  }

  return false;
};

const applyChanges = (picks, changes, gameweek) => {
  const team = picks ? [...picks] : [];
  for (const change of changes.filter((c) => c.gameweek <= gameweek)) {
    if (change.type === "swap") {
      const sourceIndex = team.findIndex(
        (p) => p.element === change.selectedPlayer.id
      );
      const targetIndex = team.findIndex(
        (p) => p.element === change.targetPlayer.id
      );

      team[sourceIndex] = {
        ...team[sourceIndex],
        element: change.targetPlayer.id,
        position: change.selectedPlayer.pick.position,
      };

      team[targetIndex] = {
        ...team[targetIndex],
        element: change.selectedPlayer.id,
        position: change.targetPlayer.pick.position,
      };
    } else if (change.type === "transfer") {
      const sourceIndex = team.findIndex(
        (p) => p.element === change.selectedPlayer.id
      );

      team[sourceIndex] = {
        ...team[sourceIndex],
        element: change.targetPlayer.id,
        position: change.selectedPlayer.pick.position,
        now_cost: change.targetPlayer.now_cost,
        selling_price: change.targetPlayer.now_cost,
        purchase_price: change.targetPlayer.now_cost,
      };
    }
  }
  return team;
};

const makeSquadGroupObject = (team) => {
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

const TransferablePlayer = ({ children, highlight, onClick }) => {
  return (
    <Box
      p={1}
      sx={{
        flexBasis: 200,
        backgroundColor: highlight ? "highlight" : "transparent",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      {children}
    </Box>
  );
};

const SelectedTeamRow = ({ children }) => {
  return (
    <Flex sx={{ justifyContent: "center", alignItems: "center" }}>
      {children}
    </Flex>
  );
};

const TransfersSection = ({ team, players, gameweeks, onPlayerClick }) => {
  const [displayedPlayers, setDisplayedPlayers] = useState(players);

  const Row = useMemo(
    () =>
      ({ index, style }) => {
        const player = displayedPlayers[index];
        const isInTeam = team.some((p) => p.id === player.id);

        return (
          <div
            key={`${index}`}
            style={{
              ...style,
              cursor: isInTeam ? "not-allowed" : "pointer",
              opacity: isInTeam ? 0.5 : 1,
              pointerEvents: isInTeam ? "none" : "inherit",
            }}
            onClick={() => onPlayerClick(player)}
          >
            <PlayerCard mini player={player} gameweeks={gameweeks} />
          </div>
        );
      },
    [displayedPlayers, gameweeks]
  );

  return (
    <>
      <PlayerSearchBar onResults={setDisplayedPlayers} players={players} />
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height - SEARCH_BAR_HEIGHT}
            itemCount={Math.ceil(displayedPlayers.length)}
            itemSize={165}
            width={width}
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    </>
  );
};

const TeamManager = ({ team, players, gameweeks, onSwap, onTransfer }) => {
  const squadObject = makeSquadGroupObject(team);
  const { GKP, DEF, MID, FWD, bench } = squadObject;

  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const transferablePlayers = useMemo(() => {
    if (!selectedPlayer) return [];
    return players.filter(
      (p) =>
        p.element_type.singular_name_short ===
        selectedPlayer.element_type.singular_name_short
    );
  }, [players, selectedPlayer]);

  const handleTranferableClick = (targetPlayer) => {
    if (!selectedPlayer) {
      setSelectedPlayer(targetPlayer);
    } else if (targetPlayer.id === selectedPlayer.id) {
      setSelectedPlayer(null);
    } else if (isSwapable(selectedPlayer, targetPlayer, squadObject)) {
      onSwap(selectedPlayer, targetPlayer);
      setSelectedPlayer(null);
    }
  };

  const handleTransferSectionPlayerClick = (targetPlayer) => {
    if (team.every((p) => p.id !== targetPlayer.id)) {
      onTransfer(selectedPlayer, targetPlayer);
      setSelectedPlayer(null);
    }
  };

  return (
    <Grid columns={["auto 200px"]}>
      <Box>
        {[GKP, DEF, MID, FWD].map((group, index) => {
          return (
            <SelectedTeamRow key={index}>
              {group.map((p) => (
                <TransferablePlayer
                  key={p.id}
                  onClick={() => handleTranferableClick(p)}
                  highlight={isSwapable(selectedPlayer, p, squadObject)}
                >
                  <PlayerCard mini player={p} gameweeks={gameweeks} />
                </TransferablePlayer>
              ))}
            </SelectedTeamRow>
          );
        })}
        <Divider />
        <SelectedTeamRow>
          {bench.map((p) => (
            <TransferablePlayer
              key={p.id}
              onClick={() => handleTranferableClick(p)}
              highlight={isSwapable(selectedPlayer, p, {
                GKP,
                DEF,
                MID,
                FWD,
                bench,
              })}
            >
              <PlayerCard mini player={p} gameweeks={gameweeks} />
            </TransferablePlayer>
          ))}
        </SelectedTeamRow>
      </Box>
      <Box>
        <TransfersSection
          team={team}
          players={transferablePlayers}
          gameweeks={gameweeks}
          onPlayerClick={handleTransferSectionPlayerClick}
        />
      </Box>
    </Grid>
  );
};

const TransferPlannerPage = ({
  picks: initialPicks,
  entry_history,
  players,
  gameweeks,
  transfers,
}) => {
  const [changes, setChanges] = useState([]);
  const [gameweekDelta, setGameweekDelta] = useState(0);

  // TODO: use useMemo only for expensive ops

  const picks = useMemo(() => {
    const picks = initialPicks?.map((p) => {
      const latestTransfer = transfers?.find((t) => t.element_in === p.element);
      const { now_cost, cost_change_start } = players.find(
        (pl) => pl.id === p.element
      );
      const originalCost = now_cost - cost_change_start;
      const purchase_price = latestTransfer?.element_in_cost ?? originalCost;

      const increasedPrice = Math.floor((now_cost - purchase_price) / 2);
      const selling_price = purchase_price + increasedPrice;

      return {
        ...p,
        now_cost,
        selling_price,
        purchase_price,
      };
    });
    return picks;
  }, [initialPicks, players, transfers]);

  const planningGameweek = useMemo(() => {
    const currentGameweek = gameweeks?.[0].id || 0;
    return currentGameweek + gameweekDelta;
  }, [gameweekDelta, gameweeks]);

  const team = useMemo(() => {
    const team = applyChanges(picks, changes, planningGameweek);
    return team.map((p) => {
      return {
        ...players?.find((pl) => pl.id === p?.element),
        pick: p,
      };
    });
  }, [picks, players, changes]);

  const bank = useMemo(() => {
    if (entry_history) {
      const transfers = changes.filter(
        (c) => c.type === "transfer" && c.gameweek <= planningGameweek
      );
      const diff = transfers?.reduce((sum, change) => {
        return (
          sum +
          (change.selectedPlayer.pick.selling_price -
            change.targetPlayer.now_cost)
        );
      }, 0);
      return (entry_history.bank + diff) / 10;
    }
    return 0;
  }, [changes, entry_history]);

  const freeTransfersCount = useMemo(() => {
    if (gameweekDelta === 0) {
      const currentGameweek = gameweeks?.[0].id || 0;
      const lastGameweekTransfersCount = transfers?.filter(
        (t) => t.event === currentGameweek - 1
      ).length;
      const currentGameweekFreeTransfers =
        lastGameweekTransfersCount > 1 ? 1 : 2;
      return currentGameweekFreeTransfers;
    } else {
      const lastGameweekTransfersCount = changes.filter(
        (c) => c.type === "transfer" && c.gameweek === planningGameweek - 1
      ).length;
      const currentGameweekFreeTransfers =
        lastGameweekTransfersCount > 1 ? 1 : 2;
      return currentGameweekFreeTransfers;
    }
  }, [transfers, gameweekDelta]);

  const planningGameweekTransferCount = changes.filter(
    (c) => c.type === "transfer" && c.gameweek === planningGameweek
  ).length;

  const hits = Math.min(
    0,
    -4 * (planningGameweekTransferCount - freeTransfersCount)
  );

  const remainingFreeTransfers = Math.max(
    0,
    freeTransfersCount - planningGameweekTransferCount
  );

  const onSwap = (selectedPlayer, targetPlayer) =>
    setChanges([
      ...changes,
      {
        type: "swap",
        selectedPlayer,
        targetPlayer,
        gameweek: planningGameweek,
      },
    ]);

  const onTransfer = (selectedPlayer, targetPlayer) =>
    setChanges([
      ...changes,
      {
        type: "transfer",
        selectedPlayer,
        targetPlayer,
        gameweek: planningGameweek,
      },
    ]);

  return (
    <>
      <Box my={2}>
        <Button
          disabled={gameweekDelta === 0}
          onClick={() => setGameweekDelta(Math.max(gameweekDelta - 1, 0))}
        >
          Previous
        </Button>
        <Button onClick={() => setGameweekDelta(gameweekDelta + 1)}>
          Next
        </Button>
        <Button onClick={() => setChanges([])}>Reset</Button>
        <Box>Gameweek: {planningGameweek}</Box>
        <Box>Bank: {bank}</Box>
        <Box>Free transfers: {freeTransfersCount}</Box>
        <Box>Transfer made: {planningGameweekTransferCount}</Box>
        <Box>Remaining free transfers: {remainingFreeTransfers}</Box>
        <Box>Hits: {hits}</Box>
        <Heading my={4} sx={{ fontWeight: "display", fontSize: 5 }}>
          Team selection
        </Heading>
        <TeamManager
          team={team}
          players={players}
          gameweeks={gameweeks}
          onSwap={onSwap}
          onTransfer={onTransfer}
        />
      </Box>
      <pre>{JSON.stringify(entry_history, null, 2)}</pre>
      <pre>{JSON.stringify(changes, null, 2)}</pre>
      <pre>{JSON.stringify(transfers, null, 2)}</pre>
      <pre>{JSON.stringify(gameweeks, null, 2)}</pre>
      <pre>
        {JSON.stringify(
          team.map((t) => ({ name: t.name, ...t.pick })),
          null,
          2
        )}
      </pre>
    </>
  );
};

export default TransferPlannerPage;
