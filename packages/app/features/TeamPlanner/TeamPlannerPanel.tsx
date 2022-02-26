import { Box } from "@chakra-ui/react";
// import { AnalyticsTeamPlanner } from "@open-fpl/app/features/Analytics/analyticsTypes";
import useLocalStorage from "@open-fpl/app/features/Common/useLocalStorage";
import { ClientPlayer } from "@open-fpl/app/features/PlayerData/playerDataTypes";
import { getTeamPlanKey } from "@open-fpl/app/features/Settings/storageKeys";
import TeamChangelog from "@open-fpl/app/features/TeamPlanner/TeamChangelog";
import TeamManager from "@open-fpl/app/features/TeamPlanner/TeamManager";
import {
  addChange,
  dehydrateFromTeamPlan,
  getAllGameweekDataList,
  processPreseasonSetCaptain,
  processPreseasonSwap,
  processPreseasonTransfer,
  removeChanges,
} from "@open-fpl/app/features/TeamPlanner/teamPlan";
import TeamPlannerToolbar from "@open-fpl/app/features/TeamPlanner/TeamPlannerToolbar";
import {
  Change,
  ChangePlayer,
  ChipChange,
  FullChangePlayer,
  GameweekData,
  SinglePlayerChange,
  TeamChange,
  TwoPlayersChange,
} from "@open-fpl/app/features/TeamPlanner/teamPlannerTypes";
import {
  ChipName,
  EntryChipPlay,
  EntryEventHistory,
  EntryEventPick,
  Transfer,
} from "@open-fpl/data/features/RemoteData/fplTypes";
// import { usePlausible } from "next-plausible";
import { ChangeEvent, useMemo, useState } from "react";

const TransferPlannerPanelContent = ({
  initialPicks,
  entryHistory,
  players,
  changes,
  nextGameweekId,
  gameweekDataList,
  setTeamPlan,
}: {
  initialPicks: EntryEventPick[] | null;
  entryHistory: EntryEventHistory | null;
  players: ClientPlayer[];
  changes: Change[];
  nextGameweekId: number;
  gameweekDataList: GameweekData[];
  setTeamPlan: (change: Change[] | null) => void;
}) => {
  // const plausible = usePlausible<AnalyticsTeamPlanner>();
  const [gameweekDelta, setGameweekDelta] = useState(0);

  const isStartedFromFirstGameweek =
    initialPicks === null && entryHistory === null;

  const planningGameweek = nextGameweekId + gameweekDelta;

  const teamManagerMode =
    planningGameweek === 1 && isStartedFromFirstGameweek
      ? "preseason"
      : "default";

  const adjustedGameweekPlayers = useMemo(
    () =>
      players.map((player) => ({
        ...player,
        client_data: {
          ...player.client_data,
          gameweeks:
            player.client_data.gameweeks?.slice(
              planningGameweek,
              planningGameweek + 5
            ) ?? [],
        },
      })),
    [players, planningGameweek]
  );

  const {
    team,
    chipUsages,
    bank,
    hits,
    freeTransfers,
    invalidChanges,
    teamInvalidities,
  } = useMemo(() => {
    const { team, ...data } =
      gameweekDataList.find((g) => g.gameweek === planningGameweek) ??
      gameweekDataList[gameweekDataList.length - 1];
    return {
      team: team.map((player) => ({
        ...player,
        client_data: {
          ...player.client_data,
          gameweeks:
            player.client_data.gameweeks?.slice(
              planningGameweek,
              planningGameweek + 5
            ) ?? [],
        },
      })),
      ...data,
    };
  }, [gameweekDataList, planningGameweek]);

  const handleSwap = (
    selectedPlayer: ChangePlayer,
    targetPlayer: ChangePlayer
  ) =>
    setTeamPlan(
      addChange(changes, {
        type: "swap",
        selectedPlayer,
        targetPlayer,
        gameweek: planningGameweek,
      } as TwoPlayersChange<FullChangePlayer>)
    );

  const handleTransfer = (
    selectedPlayer: ChangePlayer,
    targetPlayer: ClientPlayer
  ) =>
    setTeamPlan(
      addChange(changes, {
        type: "transfer",
        selectedPlayer,
        targetPlayer: targetPlayer as FullChangePlayer,
        gameweek: planningGameweek,
      } as TwoPlayersChange<FullChangePlayer>)
    );

  const handlePreseasonSwap = (
    selectedPlayer: FullChangePlayer,
    targetPlayer: FullChangePlayer
  ) =>
    setTeamPlan(
      addChange(changes, {
        type: "preseason",
        team: processPreseasonSwap(team, selectedPlayer, targetPlayer),
        gameweek: 1, // Make preseason transfer always at gameweek 1 to support placeholder player in later gameweeks
      } as TeamChange<FullChangePlayer>)
    );

  const handlePreseasonTransfer = (
    selectedPlayer: FullChangePlayer,
    targetPlayer: ClientPlayer
  ) =>
    setTeamPlan(
      addChange(changes, {
        type: "preseason",
        team: processPreseasonTransfer(team, selectedPlayer, targetPlayer),
        gameweek: 1, // Make preseason transfer always at gameweek 1 to support placeholder player in later gameweeks
      } as TeamChange<FullChangePlayer>)
    );

  const handleSetCaptaincy = (
    player: FullChangePlayer,
    type: "set-captain" | "set-vice-captain"
  ) => {
    if (teamManagerMode === "preseason") {
      setTeamPlan(
        addChange(changes, {
          type: "preseason",
          team: processPreseasonSetCaptain(team, player, type),
          gameweek: 1, // Make preseason transfer always at gameweek 1 to support placeholder player in later gameweeks
        } as TeamChange<FullChangePlayer>)
      );
    } else {
      setTeamPlan(
        addChange(changes, {
          type,
          player,
          gameweek: planningGameweek,
        } as SinglePlayerChange<FullChangePlayer>)
      );
    }

    // if (type === "set-captain") {
    //   plausible("team-planner-set-captain");
    // } else if (type === "set-vice-captain") {
    //   plausible("team-planner-set-vice-captain");
    // }
  };

  const handleSetCaptain = (player: FullChangePlayer) =>
    handleSetCaptaincy(player, "set-captain");

  const handleSetViceCaptain = (player: FullChangePlayer) =>
    handleSetCaptaincy(player, "set-vice-captain");

  const handleChipChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      setTeamPlan(
        addChange(changes, {
          type: "use-chip",
          chip: e.target.value as ChipName,
          gameweek: planningGameweek,
        } as ChipChange)
      );
      // plausible("team-planner-use-chip", { props: { chip: e.target.value } });
    } else {
      const planningGameweekChip = changes.find(
        (c) => c.type === "use-chip" && c.gameweek === planningGameweek
      );
      if (planningGameweekChip) {
        setTeamPlan(removeChanges(changes, [planningGameweekChip]));
      }
    }
  };

  const handleToolbarNextGameweek = () => {
    setGameweekDelta(gameweekDelta + 1);
    // plausible("team-planner-toolbar-navigate", {
    //   props: { gameweek: nextGameweekId + gameweekDelta + 1 },
    // });
  };

  const handleToolbarPreviousGameweek = () => {
    setGameweekDelta(gameweekDelta - 1);
    // plausible("team-planner-toolbar-navigate", {
    //   props: { gameweek: nextGameweekId + gameweekDelta - 1 },
    // });
  };

  const handleChangelogRemove = (removingChanges: Change[]) => {
    setTeamPlan(removeChanges(changes, removingChanges));
    // plausible("team-planner-changelog-remove");
  };

  const handlChangelogeMoveToGameweek = (gameweek: number) => {
    setGameweekDelta(gameweek - nextGameweekId);
    // plausible("team-planner-changelog-navigate", {
    //   props: {
    //     gameweek: gameweek - nextGameweekId,
    //   },
    // });
  };

  return (
    <>
      <TeamPlannerToolbar
        bank={bank}
        hits={hits}
        freeTransfers={freeTransfers}
        chipUsages={chipUsages}
        nextGameweekId={nextGameweekId}
        planningGameweek={planningGameweek}
        onPreviousClick={handleToolbarPreviousGameweek}
        onNextClick={handleToolbarNextGameweek}
        onActivatedChipSelectChange={handleChipChange}
      />
      <TeamChangelog
        planningGameweek={planningGameweek}
        nextGameweekId={nextGameweekId}
        changes={changes}
        invalidChanges={invalidChanges}
        onRemove={handleChangelogRemove}
        onMoveToGameweek={handlChangelogeMoveToGameweek}
        gameweekDataList={gameweekDataList}
      />
      {teamInvalidities.length > 0 && (
        <Box
          aria-label="team error"
          width="100%"
          py={2}
          px={4}
          layerStyle="redSolid"
        >
          {teamInvalidities.map((i) => i.message).join(", ")}
        </Box>
      )}
      <Box flexGrow={1}>
        <TeamManager
          mode={teamManagerMode}
          team={team}
          players={adjustedGameweekPlayers}
          onSwap={handleSwap}
          onTransfer={handleTransfer}
          onPreseasonSwap={handlePreseasonSwap}
          onPreseasonTransfer={handlePreseasonTransfer}
          onSetCaptain={handleSetCaptain}
          onSetViceCaptain={handleSetViceCaptain}
        />
      </Box>
    </>
  );
};

const TeamPlannerPanel = ({
  initialPicks,
  entryHistory,
  players,
  nextGameweekId,
  transfers,
  chips,
  profile,
  teamPlanKey,
}: {
  initialPicks: EntryEventPick[] | null;
  entryHistory: EntryEventHistory | null;
  players: ClientPlayer[];
  nextGameweekId: number;
  transfers: Transfer[];
  chips: EntryChipPlay[];
  profile: string;
  teamPlanKey: string;
}) => {
  const [teamPlan, setTeamPlan] = useLocalStorage<Change[]>(
    getTeamPlanKey(profile, teamPlanKey),
    [] as Change[]
  );

  const changes: Change[] = useMemo(
    () =>
      teamPlan
        ? dehydrateFromTeamPlan(
            teamPlan.filter((c) => c.gameweek >= nextGameweekId),
            players
          )
        : [],
    [teamPlan, players, nextGameweekId]
  );

  const gameweekDataList = useMemo(
    () =>
      getAllGameweekDataList(
        initialPicks,
        transfers,
        chips,
        players,
        entryHistory,
        changes
      ),
    [initialPicks, transfers, chips, players, entryHistory, changes]
  );

  return gameweekDataList.length === 0 ? null : (
    <TransferPlannerPanelContent
      initialPicks={initialPicks}
      entryHistory={entryHistory}
      players={players}
      setTeamPlan={setTeamPlan}
      changes={changes}
      nextGameweekId={nextGameweekId}
      gameweekDataList={gameweekDataList}
    />
  );
};

export default TeamPlannerPanel;
