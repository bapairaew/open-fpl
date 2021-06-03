import { Box, Flex } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useSettings } from "~/components/Settings/SettingsContext";
import {
  addChange,
  getChangesFromTransferPlan,
  processChanges,
  removeChange,
} from "~/components/TransferPlanner/changes";
import TeamManager from "~/components/TransferPlanner/TeamManager";
import TransferLog from "~/components/TransferPlanner/TransferLog";
import TransferToolbar from "~/components/TransferPlanner/TransferToolbar";

const TransferPlanner = ({
  initialPicks,
  entryHistory,
  players,
  gameweeks,
  transfers,
}) => {
  const { transferPlan, setTransferPlan } = useSettings();
  const [gameweekDelta, setGameweekDelta] = useState(0);

  const currentGameweek = gameweeks?.[0]?.id ?? 38;
  const planningGameweek = currentGameweek + gameweekDelta;

  const changes = useMemo(
    () => getChangesFromTransferPlan(transferPlan, players),
    [transferPlan, players]
  );

  const { team, invalidChanges } = useMemo(() => {
    if (players && initialPicks && transfers) {
      const picks = initialPicks?.map((p) => {
        const latestTransfer = transfers?.find(
          (t) => t.element_in === p.element
        );
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

      const { updatedTeam, invalidChanges } = processChanges(
        picks,
        changes.filter((c) => c.gameweek <= planningGameweek)
      );

      return {
        team: updatedTeam.map((p) => {
          return {
            ...players?.find((pl) => pl.id === p?.element),
            pick: p,
          };
        }),
        invalidChanges,
      };
    }

    return { team: [], invalidChanges: [] };
  }, [initialPicks, transfers, players, changes, planningGameweek]);

  const teamInvalidities = useMemo(() => {
    const invalidities = [];

    const teamMap = team.reduce((map, player) => {
      if (map[player.team.short_name]) map[player.team.short_name] += 1;
      else map[player.team.short_name] = 1;
      return map;
    }, {});

    const exceedLimitTeams = Object.entries(teamMap).filter(
      ([team, count]) => count > 3
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

  const onSwap = (selectedPlayer, targetPlayer) =>
    setTransferPlan(
      addChange(changes, {
        type: "swap",
        selectedPlayer,
        targetPlayer,
        gameweek: planningGameweek,
      })
    );

  const onTransfer = (selectedPlayer, targetPlayer) =>
    setTransferPlan(
      addChange(changes, {
        type: "transfer",
        selectedPlayer,
        targetPlayer,
        gameweek: planningGameweek,
      })
    );

  const onRemove = (change) => setTransferPlan(removeChange(changes, change));

  return (
    <Flex overflow="hidden" height="100%" flexDirection="column">
      <TransferToolbar
        changes={changes}
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
          onSwap={onSwap}
          onTransfer={onTransfer}
        />
      </Box>
    </Flex>
  );
};

export default TransferPlanner;
