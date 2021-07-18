import { Box } from "@chakra-ui/react";
import { ChangeEvent, useMemo, useState } from "react";
import { Gameweek } from "@open-fpl/data/features/AppData/appDataTypes";
import useLocalStorage from "~/features/Common/useLocalStorage";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import {
  ChipName,
  EntryChipPlay,
  EntryEventHistory,
  EntryEventPick,
  Transfer,
} from "@open-fpl/data/features/RemoteData/fplTypes";
import { getTeamPlanKey } from "~/features/Settings/storageKeys";
import TeamManager from "~/features/TeamPlanner/TeamManager";
import ChangeLog from "~/features/TeamPlanner/ChangeLog";
import {
  addChange,
  dehydrateFromTeamPlan,
  getAllGameweekDataList,
  processPreseasonSetCaptain,
  processPreseasonSwap,
  processPreseasonTransfer,
  removeChange,
} from "~/features/TeamPlanner/teamPlan";
import {
  Change,
  ChangePlayer,
  ChipChange,
  FullChangePlayer,
  GameweekData,
  SinglePlayerChange,
  TeamChange,
  TwoPlayersChange,
} from "~/features/TeamPlanner/teamPlannerTypes";
import TeamPlannerToolbar from "~/features/TeamPlanner/TeamPlannerToolbar";

const TransferPlannerPanelContent = ({
  initialPicks,
  entryHistory,
  players,
  gameweeks,
  changes,
  currentGameweek,
  gameweekDataList,
  setTransferPlan,
}: {
  initialPicks: EntryEventPick[] | null;
  entryHistory: EntryEventHistory | null;
  players: Player[];
  gameweeks: Gameweek[];
  changes: Change[];
  currentGameweek: number;
  gameweekDataList: GameweekData[];
  setTransferPlan: (change: Change[] | null) => void;
}) => {
  const [gameweekDelta, setGameweekDelta] = useState(0);

  const isStartedFromFirstGameweek =
    initialPicks === null && entryHistory === null;

  const planningGameweek = currentGameweek + gameweekDelta;
  const upcomingGameweeks = gameweeks.slice(Math.max(0, gameweekDelta));

  const transferManagerMode =
    planningGameweek === 1 && isStartedFromFirstGameweek
      ? "preseason"
      : "default";

  const {
    team,
    chipUsages,
    bank,
    hits,
    freeTransfers,
    invalidChanges,
    teamInvalidities,
  } = useMemo(
    () =>
      gameweekDataList.find((g) => g.gameweek === planningGameweek) ??
      gameweekDataList[gameweekDataList.length - 1],
    [gameweekDataList, planningGameweek]
  );

  const handleSwap = (
    selectedPlayer: ChangePlayer,
    targetPlayer: ChangePlayer
  ) =>
    setTransferPlan(
      addChange(changes, {
        type: "swap",
        selectedPlayer,
        targetPlayer,
        gameweek: planningGameweek,
      } as TwoPlayersChange<FullChangePlayer>)
    );

  const handleTransfer = (selectedPlayer: ChangePlayer, targetPlayer: Player) =>
    setTransferPlan(
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
    setTransferPlan(
      addChange(changes, {
        type: "preseason",
        team: processPreseasonSwap(team, selectedPlayer, targetPlayer),
        gameweek: 1, // Make preseason transfer always at gameweek 1 to support placeholder player in later gameweeks
      } as TeamChange<FullChangePlayer>)
    );

  const handlePreseasonTransfer = (
    selectedPlayer: FullChangePlayer,
    targetPlayer: Player
  ) =>
    setTransferPlan(
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
    if (transferManagerMode === "preseason") {
      setTransferPlan(
        addChange(changes, {
          type: "preseason",
          team: processPreseasonSetCaptain(team, player, type),
          gameweek: 1, // Make preseason transfer always at gameweek 1 to support placeholder player in later gameweeks
        } as TeamChange<FullChangePlayer>)
      );
    } else {
      setTransferPlan(
        addChange(changes, {
          type,
          player,
          gameweek: planningGameweek,
        } as SinglePlayerChange<FullChangePlayer>)
      );
    }
  };

  const handleSetCaptain = (player: FullChangePlayer) =>
    handleSetCaptaincy(player, "set-captain");

  const handleSetViceCaptain = (player: FullChangePlayer) =>
    handleSetCaptaincy(player, "set-vice-captain");

  const handleChipChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      setTransferPlan(
        addChange(changes, {
          type: "use-chip",
          chip: e.target.value as ChipName,
          gameweek: planningGameweek,
        } as ChipChange)
      );
    } else {
      const planningGameweekChip = changes.find(
        (c) => c.type === "use-chip" && c.gameweek === planningGameweek
      );
      if (planningGameweekChip) {
        setTransferPlan(removeChange(changes, planningGameweekChip));
      }
    }
  };

  const handleRemove = (change: Change) =>
    setTransferPlan(removeChange(changes, change));

  const handleMoveToGameweek = (gameweek: number) =>
    setGameweekDelta(gameweek - currentGameweek);

  return (
    <>
      <TeamPlannerToolbar
        bank={bank}
        hits={hits}
        freeTransfers={freeTransfers}
        chipUsages={chipUsages}
        currentGameweek={currentGameweek}
        planningGameweek={planningGameweek}
        onPreviousClick={() => setGameweekDelta(gameweekDelta - 1)}
        onNextClick={() => setGameweekDelta(gameweekDelta + 1)}
        onActivatedChipSelectChange={handleChipChange}
      />
      <ChangeLog
        currentGameweek={currentGameweek}
        changes={changes}
        invalidChanges={invalidChanges}
        onRemove={handleRemove}
        onMoveToGameweek={handleMoveToGameweek}
        gameweekDataList={gameweekDataList}
      />
      {teamInvalidities.length > 0 && (
        <Box width="100%" py={2} px={4} bg="red.500" color="white">
          {teamInvalidities.map((i) => i.message).join(", ")}
        </Box>
      )}
      <Box flexGrow={1}>
        <TeamManager
          mode={transferManagerMode}
          team={team}
          players={players}
          gameweeks={upcomingGameweeks}
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
  gameweeks,
  transfers,
  chips,
  teamId,
  transferPlanKey,
}: {
  initialPicks: EntryEventPick[] | null;
  entryHistory: EntryEventHistory | null;
  players: Player[];
  gameweeks: Gameweek[];
  transfers: Transfer[];
  chips: EntryChipPlay[];
  teamId: string;
  transferPlanKey: string;
}) => {
  const [teamPlan, setTransferPlan] = useLocalStorage<Change[]>(
    getTeamPlanKey(teamId, transferPlanKey),
    [] as Change[]
  );

  const currentGameweek = gameweeks[0]?.id ?? 38; // Remaining gameweeks is empty when the last gameweek finished

  const changes: Change[] = useMemo(
    () => (teamPlan ? dehydrateFromTeamPlan(teamPlan, players) : []),
    [teamPlan, players]
  );

  const gameweekDataList = useMemo(
    () =>
      getAllGameweekDataList(
        initialPicks,
        transfers,
        chips,
        players,
        entryHistory,
        currentGameweek,
        changes
      ),
    [initialPicks, transfers, chips, players, entryHistory, changes]
  );

  return gameweekDataList.length === 0 ? null : (
    <TransferPlannerPanelContent
      initialPicks={initialPicks}
      entryHistory={entryHistory}
      players={players}
      gameweeks={gameweeks}
      setTransferPlan={setTransferPlan}
      changes={changes}
      currentGameweek={currentGameweek}
      gameweekDataList={gameweekDataList}
    />
  );
};

export default TeamPlannerPanel;
