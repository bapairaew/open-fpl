import { Box, Flex } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import {
  addChange,
  processChanges,
  removeChange,
} from "~/components/TransferPlanner/changes";
import TeamManager from "~/components/TransferPlanner/TeamManager";
import TransferLog from "~/components/TransferPlanner/TransferLog";
import TransferToolbar from "~/components/TransferPlanner/TransferToolbar";
import useLocalStorage from "~/libs/useLocalStorage";
import { useUser } from "~/components/User/UserContext";

const TransferPlanner = ({
  initialPicks,
  entryHistory,
  players,
  gameweeks,
  transfers,
}) => {
  const { teamId } = useUser();
  // TODO: auto remove/invalidate previous gameweek changes
  const [changes, setChanges] = useLocalStorage(`${teamId}-changes`, []);
  const [gameweekDelta, setGameweekDelta] = useState(0);

  const currentGameweek = +gameweeks?.[0].id || 0;
  const planningGameweek = currentGameweek + gameweekDelta;

  const team = useMemo(() => {
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

      const team = processChanges(
        picks,
        changes.filter((c) => c.gameweek <= planningGameweek)
      );

      return team.map((p) => {
        return {
          ...players?.find((pl) => pl.id === p?.element),
          pick: p,
        };
      });
    }

    return [];
  }, [initialPicks, transfers, players, changes]);

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
    setChanges(
      addChange(changes, {
        type: "swap",
        selectedPlayer,
        targetPlayer,
        gameweek: planningGameweek,
      })
    );

  const onTransfer = (selectedPlayer, targetPlayer) =>
    setChanges(
      addChange(changes, {
        type: "transfer",
        selectedPlayer,
        targetPlayer,
        gameweek: planningGameweek,
      })
    );

  const onRemove = (change) => setChanges(removeChange(changes, change));

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
      <TransferLog changes={changes} onRemove={onRemove} />
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
