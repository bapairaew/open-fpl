import { Box, Flex } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { Gameweek, Player } from "~/features/AppData/appDataTypes";
import {
  EntryEventHistory,
  EntryEventPick,
  Transfer,
} from "~/features/AppData/fplTypes";
import { Invalid } from "~/features/Common/errorTypes";
import { useSettings } from "~/features/Settings/SettingsContext";
import {
  addChange,
  getChangesFromTransferPlan,
  processChanges,
  removeChange,
} from "~/features/TransferPlanner/changes";
import TeamManager from "~/features/TransferPlanner/TeamManager";
import TransferLog from "~/features/TransferPlanner/TransferLog";
import {
  Change,
  ChangePlayer,
  FullChangePlayer,
  InvalidChange,
  Pick,
} from "~/features/TransferPlanner/transferPlannerTypes";
import TransferToolbar from "~/features/TransferPlanner/TransferToolbar";

const TransferPlanner = ({
  initialPicks,
  entryHistory,
  players,
  gameweeks,
  transfers,
}: {
  initialPicks: EntryEventPick[];
  entryHistory: EntryEventHistory;
  players: Player[];
  gameweeks: Gameweek[];
  transfers: Transfer[];
}) => {
  const { transferPlan, setTransferPlan } = useSettings();
  const [gameweekDelta, setGameweekDelta] = useState(0);

  const currentGameweek = gameweeks?.[0]?.id ?? 38;
  const planningGameweek = currentGameweek + gameweekDelta;

  const changes: Change<FullChangePlayer>[] = useMemo(
    () =>
      transferPlan ? getChangesFromTransferPlan(transferPlan, players) : [],
    [transferPlan, players]
  );

  const {
    team,
    invalidChanges,
  }: {
    team: FullChangePlayer[];
    invalidChanges: InvalidChange<FullChangePlayer>[];
  } = useMemo(() => {
    if (players && initialPicks && transfers) {
      const picks = initialPicks?.reduce((picks, p) => {
        const latestTransfer = transfers?.find(
          (t) => t.element_in === p.element
        );
        const player = players.find((pl) => pl.id === p.element);
        // Ignore invalid players
        if (player) {
          const { now_cost, cost_change_start } = player;
          const originalCost = now_cost - cost_change_start;
          const purchase_price =
            latestTransfer?.element_in_cost ?? originalCost;

          const increasedPrice = Math.floor((now_cost - purchase_price) / 2);
          const selling_price = purchase_price + increasedPrice;

          picks.push({
            ...p,
            now_cost,
            selling_price,
            purchase_price,
          });
        }
        return picks;
      }, [] as Pick[]);

      const { updatedPicks, invalidChanges } = processChanges(
        picks,
        changes.filter((c) => c.gameweek <= planningGameweek)
      );

      return {
        team: updatedPicks.map((p) => {
          return {
            ...players?.find((pl) => pl.id === p?.element),
            pick: p,
          };
        }) as FullChangePlayer[],
        invalidChanges,
      };
    }

    return { team: [], invalidChanges: [] };
  }, [initialPicks, transfers, players, changes, planningGameweek]);

  const teamInvalidities: Invalid[] = useMemo(() => {
    const invalidities = [];

    const teamMap = team.reduce((map, player) => {
      if (map[player.team.short_name]) map[player.team.short_name] += 1;
      else map[player.team.short_name] = 1;
      return map;
    }, {} as Record<string, number>);

    const exceedLimitTeams = Object.entries(teamMap).filter(
      ([, count]) => count > 3
    );

    if (exceedLimitTeams.length > 0) {
      invalidities.push({
        type: "exceed_limit_team",
        message: `You cannot select more than 3 players from a same team (${exceedLimitTeams
          .map((t) => t[0])
          .join(", ")})`,
      });
    }

    return invalidities;
  }, [team]);

  const bank = useMemo(() => {
    if (entryHistory) {
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
      return (entryHistory.bank + diff) / 10;
    }
    return 0;
  }, [changes, planningGameweek, entryHistory]);

  const freeTransfersCount = useMemo(() => {
    if (gameweekDelta === 0) {
      const lastGameweekTransfersCount = transfers?.filter(
        (t) => t.event === currentGameweek - 1
      ).length;
      const currentGameweekFreeTransfers =
        lastGameweekTransfersCount >= 1 ? 1 : 2;
      return currentGameweekFreeTransfers;
    } else {
      const lastGameweekTransfersCount = changes.filter(
        (c) => c.type === "transfer" && c.gameweek === planningGameweek - 1
      ).length;
      const currentGameweekFreeTransfers =
        lastGameweekTransfersCount >= 1 ? 1 : 2;
      return currentGameweekFreeTransfers;
    }
  }, [transfers, changes, gameweekDelta]);

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
      })
    );

  const handleTransfer = (selectedPlayer: ChangePlayer, targetPlayer: Player) =>
    setTransferPlan(
      addChange(changes, {
        type: "transfer",
        selectedPlayer,
        targetPlayer: targetPlayer as FullChangePlayer,
        gameweek: planningGameweek,
      })
    );

  const onRemove = (change: Change<ChangePlayer>) =>
    setTransferPlan(removeChange(changes, change));

  return (
    <Flex overflow="hidden" height="100%" flexDirection="column">
      <TransferToolbar
        bank={bank}
        hits={hits}
        currentGameweek={currentGameweek}
        planningGameweek={planningGameweek}
        remainingFreeTransfers={remainingFreeTransfers}
        onPreviousClick={() => setGameweekDelta(gameweekDelta - 1)}
        onNextClick={() => setGameweekDelta(gameweekDelta + 1)}
      />
      <TransferLog
        currentGameweek={currentGameweek}
        changes={changes}
        invalidChanges={invalidChanges}
        onRemove={onRemove}
      />
      {teamInvalidities.length > 0 && (
        <Box width="100%" py={2} px={4} bg="red.500" color="white">
          {teamInvalidities.map((i) => i.message).join(", ")}
        </Box>
      )}
      <Box flexGrow={1}>
        <TeamManager
          team={team}
          players={players}
          gameweeks={gameweeks}
          onSwap={handleSwap}
          onTransfer={handleTransfer}
        />
      </Box>
    </Flex>
  );
};

export default TransferPlanner;
