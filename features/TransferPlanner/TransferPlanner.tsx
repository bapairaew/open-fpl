import { Box, BoxProps, Flex } from "@chakra-ui/react";
import { ChangeEvent, useMemo, useState } from "react";
import { Gameweek, Player } from "~/features/AppData/appDataTypes";
import {
  ChipName,
  EntryChipPlay,
  EntryEventHistory,
  EntryEventPick,
  Transfer,
} from "~/features/AppData/fplTypes";
import { Invalid } from "~/features/Common/errorTypes";
import { useSettings } from "~/features/Settings/SettingsContext";
import TeamManager from "~/features/TransferPlanner/TeamManager";
import TransferLog from "~/features/TransferPlanner/TransferLog";
import {
  addChange,
  dehydrateFromTransferPlan,
  processPreseasonSetCaptain,
  processPreseasonSwap,
  processPreseasonTransfer,
  processTransferPlan,
  removeChange,
} from "~/features/TransferPlanner/transferPlan";
import {
  Change,
  ChangePlayer,
  ChipChange,
  ChipUsage,
  FullChangePlayer,
  InvalidChange,
  SinglePlayerChange,
  TeamChange,
  TwoPlayersChange,
} from "~/features/TransferPlanner/transferPlannerTypes";
import TransferToolbar from "~/features/TransferPlanner/TransferToolbar";

const TransferPlanner = ({
  initialPicks,
  entryHistory,
  players,
  gameweeks,
  transfers,
  chips,
  ...props
}: BoxProps & {
  initialPicks: EntryEventPick[] | null;
  entryHistory: EntryEventHistory | null;
  players: Player[];
  gameweeks: Gameweek[];
  transfers: Transfer[];
  chips: EntryChipPlay[];
}) => {
  const { transferPlan, setTransferPlan } = useSettings();
  const [gameweekDelta, setGameweekDelta] = useState(0);

  const isStartedFromFirstGameweek =
    initialPicks === null && entryHistory === null;

  const currentGameweek = gameweeks[0]?.id ?? 38; // Remaining gameweeks is empty when the last gameweek finished
  const planningGameweek = currentGameweek + gameweekDelta;
  const upcomingGameweeks = gameweeks.slice(Math.max(0, gameweekDelta));

  const transferManagerMode =
    planningGameweek === 1 && isStartedFromFirstGameweek
      ? "preseason"
      : "default";

  const changes: Change[] = useMemo(
    () =>
      transferPlan ? dehydrateFromTransferPlan(transferPlan, players) : [],
    [transferPlan, players]
  );

  const {
    team,
    chipUsages,
    bank,
    invalidChanges,
    teamInvalidities,
  }: {
    team: FullChangePlayer[];
    chipUsages: ChipUsage[];
    bank: number;
    invalidChanges: InvalidChange[];
    teamInvalidities: Invalid[];
  } = useMemo(
    () =>
      processTransferPlan(
        initialPicks,
        transfers,
        chips,
        players,
        entryHistory,
        changes,
        planningGameweek
      ),
    [
      initialPicks,
      transfers,
      chips,
      players,
      entryHistory,
      changes,
      planningGameweek,
    ]
  );

  const freeTransfersCount = useMemo(() => {
    if (currentGameweek + gameweekDelta === 1) {
      return 0;
    }
    if (gameweekDelta === 0) {
      const lastGameweekTransfersCount = transfers?.filter(
        (t) => t.event === currentGameweek - 1
      ).length;
      const currentGameweekFreeTransfers =
        lastGameweekTransfersCount >= 1 ? 1 : 2;
      return currentGameweekFreeTransfers;
    } else {
      const lastGameweekTransfersCount = changes.filter(
        (c) =>
          (c.type === "transfer" || c.type === "preseason") &&
          c.gameweek === planningGameweek - 1
      ).length;
      const currentGameweekFreeTransfers =
        lastGameweekTransfersCount >= 1 ? 1 : 2;
      return currentGameweekFreeTransfers;
    }
  }, [transfers, changes, gameweekDelta]);

  const planningGameweekTransferCount = changes.filter(
    (c) => c.type === "transfer" && c.gameweek === planningGameweek
  ).length;

  const hits = chipUsages.some(
    (c) => (c.name === "wildcard" || c.name === "freehit") && c.isActive
  )
    ? 0
    : Math.min(0, -4 * (planningGameweekTransferCount - freeTransfersCount));

  const remainingFreeTransfers = Math.max(
    0,
    freeTransfersCount - planningGameweekTransferCount
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
    <Flex overflow="hidden" height="100%" flexDirection="column" {...props}>
      <TransferToolbar
        bank={bank}
        hits={hits}
        chipUsages={chipUsages}
        currentGameweek={currentGameweek}
        planningGameweek={planningGameweek}
        remainingFreeTransfers={remainingFreeTransfers}
        onPreviousClick={() => setGameweekDelta(gameweekDelta - 1)}
        onNextClick={() => setGameweekDelta(gameweekDelta + 1)}
        onActivatedChipSelectChange={handleChipChange}
      />
      <TransferLog
        currentGameweek={currentGameweek}
        changes={changes}
        invalidChanges={invalidChanges}
        onRemove={handleRemove}
        onMoveToGameweek={handleMoveToGameweek}
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
    </Flex>
  );
};

export default TransferPlanner;
