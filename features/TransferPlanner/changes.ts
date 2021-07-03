import { Player } from "~/features/AppData/appDataTypes";
import { EntryEventPick, Transfer } from "~/features/AppData/fplTypes";
import { Invalid } from "~/features/Common/errorTypes";
import { makePlaceholderPlayerFromId } from "~/features/TransferPlanner/placeholderPlayer";
import {
  Change,
  ChangePlayer,
  FullChangePlayer,
  GroupedTeam,
  InvalidChange,
  Pick,
  PreseasonChange,
  TeamChange,
} from "~/features/TransferPlanner/transferPlannerTypes";

// Apply the changes against the given team
const processPicks = (
  initialPicks: EntryEventPick[] | null,
  transfers: Transfer[],
  players: Player[],
  changes: Change[]
): {
  picks: Pick[];
  invalidChanges: InvalidChange[];
} => {
  const picks = [] as Pick[];
  if (initialPicks) {
    for (const p of initialPicks) {
      const latestTransfer = transfers?.find((t) => t.element_in === p.element);
      const player = players.find((pl) => pl.id === p.element);
      // Ignore invalid players
      if (player) {
        const { now_cost, cost_change_start } = player;
        const originalCost = now_cost - cost_change_start;
        const purchase_price = latestTransfer?.element_in_cost ?? originalCost;

        const increasedPrice = Math.floor((now_cost - purchase_price) / 2);
        const selling_price = purchase_price + increasedPrice;

        picks.push({
          ...p,
          now_cost,
          selling_price,
          purchase_price,
        });
      }
    }
  }

  const invalidChanges = [] as InvalidChange[];
  for (const change of changes) {
    if (change.type === "swap" || change.type === "transfer") {
      const teamChange = change as TeamChange<FullChangePlayer>;
      const sourceIndex = picks.findIndex(
        (p) => p.element === teamChange.selectedPlayer.id
      );
      const targetIndex = picks.findIndex(
        (p) => p.element === teamChange.targetPlayer.id
      );

      if (change.type === "swap") {
        if (sourceIndex === -1 || targetIndex === -1) {
          const invalidPlayer =
            sourceIndex === -1
              ? teamChange.selectedPlayer.web_name
              : teamChange.targetPlayer.web_name;
          invalidChanges.push({
            type: "swap_non_existed_player",
            message: `${invalidPlayer} is not in the team.`,
            change,
          });
        } else {
          picks[sourceIndex] = {
            ...picks[targetIndex],
            position: sourceIndex + 1,
          };
          picks[targetIndex] = {
            ...picks[sourceIndex],
            position: targetIndex + 1,
          };
        }
      } else if (change.type === "transfer") {
        if (sourceIndex === -1) {
          const invalidPlayer = teamChange.selectedPlayer.web_name;
          invalidChanges.push({
            type: "transfer_non_existed_player",
            message: `${invalidPlayer} is not in the team.`,
            change,
          });
        } else {
          picks[sourceIndex] = {
            ...picks[sourceIndex],
            element: teamChange.targetPlayer.id,
            position: teamChange.selectedPlayer.pick.position,
            now_cost: teamChange.targetPlayer.now_cost,
            selling_price: teamChange.targetPlayer.now_cost,
            purchase_price: teamChange.targetPlayer.now_cost,
          };
        }
      }
    } else if (change.type === "preseason") {
      const preseasonChange = change as PreseasonChange<FullChangePlayer>;
      for (const player of preseasonChange.team) {
        picks.push(player.pick);
      }
    }
  }
  return {
    picks,
    invalidChanges,
  };
};

// Combine initialPicks, transfers from API and changes from localStorage to make team and detect invalidities
export const processTransferPlan = (
  initialPicks: EntryEventPick[] | null,
  transfers: Transfer[],
  players: Player[],
  changes: Change[],
  planningGameweek: number
): {
  team: FullChangePlayer[];
  invalidChanges: InvalidChange[];
  teamInvalidities: Invalid[];
} => {
  const { picks, invalidChanges } = processPicks(
    initialPicks,
    transfers,
    players,
    changes.filter((c) => c.gameweek <= planningGameweek)
  );

  const team = picks.map((p) => {
    const player =
      players?.find((pl) => pl.id === p?.element) ??
      makePlaceholderPlayerFromId(p.element);
    return {
      ...player,
      pick: p,
    };
  }) as FullChangePlayer[];

  const teamMap = team.reduce((map, player) => {
    const key = [player.team.id, player.team.short_name].join("+");
    if (map[key]) map[key] += 1;
    else map[key] = 1;
    return map;
  }, {} as Record<string, number>);

  const exceedLimitTeams = Object.entries(teamMap).filter(
    ([, count]) => count > 3
  );

  const teamInvalidities: Invalid[] = [];

  if (exceedLimitTeams.length > 0) {
    teamInvalidities.push({
      type: "exceed_limit_team",
      message: `You cannot select more than 3 players from a same team (${exceedLimitTeams
        .map((t) => t[0].split("+")[1])
        .join(", ")})`,
    });
  }

  return {
    team,
    invalidChanges,
    teamInvalidities,
  };
};

// Merge the change by either add newChange to the list or remove prior opposite change
export const addChange = (changes: Change[], newChange: Change): Change[] => {
  // TODO: fix this
  // NOTE: disable for now, this logic is very buggy if the oppositeChange does not happen immediately in the next change
  // if (newChange.type === "swap") {
  //   // If swap happens between two same players, cancel it out
  //   const oppositeChange = [...changes]
  //     .reverse()
  //     .find(
  //       (c) =>
  //         c.type === "swap" &&
  //         c.gameweek === newChange.gameweek &&
  //         ((c.targetPlayer.id === newChange.selectedPlayer.id &&
  //           c.selectedPlayer.id === newChange.targetPlayer.id) ||
  //           (c.targetPlayer.id === newChange.targetPlayer.id &&
  //             c.selectedPlayer.id === newChange.selectedPlayer.id))
  //     );
  //   if (oppositeChange) {
  //     return changes.filter((c) => c !== oppositeChange);
  //   }
  // } else if (newChange.type === "transfer") {
  //   // If a player is transferred out and back within the same gameweek, merge those two transfers
  //   const oppositeChange = [...changes]
  //     .reverse()
  //     .find(
  //       (c) =>
  //         c.type === "transfer" &&
  //         c.gameweek === newChange.gameweek &&
  //         newChange.targetPlayer.id === c.selectedPlayer.id
  //     );
  //   if (oppositeChange) {
  //     return [
  //       ...changes.filter((c) => c !== oppositeChange),
  //       {
  //         ...newChange,
  //         targetPlayer: oppositeChange.targetPlayer,
  //       },
  //     ];
  //   }
  // }
  const addedChanges = [
    ...changes,
    {
      ...newChange,
      id: Math.random(), // Set ID for easier management later
    },
  ];

  let cleanedChanges = [] as Change[];

  for (const change of addedChanges) {
    if (change.type === "swap" || change.type === "transfer") {
      const teamChange = change as TeamChange<FullChangePlayer>;
      const reducedTeamChange = {
        id: change.id,
        type: change.type,
        gameweek: change.gameweek,
        selectedPlayer: {
          id: teamChange.selectedPlayer.id,
          pick: teamChange.selectedPlayer.pick,
        },
        targetPlayer: {
          id: teamChange.targetPlayer.id,
          pick: teamChange.targetPlayer.pick,
        },
      } as TeamChange<ChangePlayer>;
      cleanedChanges.push(reducedTeamChange);
    } else if (change.type === "preseason") {
      // Always replace existing preseason changes
      cleanedChanges = cleanedChanges.filter((c) => c.type !== "preseason");
      const preseasonChange = change as PreseasonChange<FullChangePlayer>;
      const reducedPreseasonChange = {
        id: change.id,
        type: change.type,
        gameweek: change.gameweek,
        team: preseasonChange.team.map((player) => ({
          id: player.id,
          pick: player.pick,
        })),
      } as PreseasonChange<ChangePlayer>;
      cleanedChanges.push(reducedPreseasonChange);
    }
  }

  return cleanedChanges;
};

// NOTE: this might be buggy if it is done in the middle of a long chain
// (e.g. transfer in A and then transfer out A and then remove the first action)
// TODO: may need another function to "purify" the existing changes after the removal
export const removeChange = (
  changes: Change[],
  removingChange: Change
): Change[] => {
  return changes.filter((c) => c.id !== removingChange.id);
};

// Handle transfer with probable placeholder players
// To save storage space preseason change save a whole instead of transaction
export const processPreseasonTransfer = (
  team: FullChangePlayer[],
  selectedPlayer: FullChangePlayer,
  targetPlayer: Player
): ChangePlayer[] => {
  const pick = {
    element: targetPlayer.id,
    position: selectedPlayer.pick.position,
    now_cost: targetPlayer.now_cost,
    selling_price: targetPlayer.now_cost,
    purchase_price: targetPlayer.now_cost,
  };

  const updatedTeam: ChangePlayer[] = team.map((player) => ({
    id: player.id,
    pick: player.pick,
  }));

  if (selectedPlayer.isPlaceholder) {
    return [
      ...updatedTeam,
      {
        id: targetPlayer.id,
        pick,
      },
    ];
  } else {
    return updatedTeam.map((player) =>
      player.pick.position === selectedPlayer.pick.position
        ? {
            id: targetPlayer.id,
            pick,
          }
        : player
    );
  }
};

// Handle swap with probable placeholder players
// To save storage space preseason change save a whole instead of transaction
export const processPreseasonSwap = (
  team: FullChangePlayer[],
  selectedPlayer: FullChangePlayer,
  targetPlayer: FullChangePlayer
): ChangePlayer[] => {
  const updatedTeam: ChangePlayer[] = team.map((player) => ({
    id: player.id,
    pick: player.pick,
  }));

  const selectedPlayerObj = {
    id: targetPlayer.id,
    pick: {
      element: targetPlayer.id,
      position: selectedPlayer.pick.position,
      now_cost: targetPlayer.now_cost,
      selling_price: targetPlayer.now_cost,
      purchase_price: targetPlayer.now_cost,
    },
  };

  const targetPlayerObject = {
    id: selectedPlayer.id,
    pick: {
      element: selectedPlayer.id,
      position: targetPlayer.pick.position,
      now_cost: selectedPlayer.now_cost,
      selling_price: selectedPlayer.now_cost,
      purchase_price: selectedPlayer.now_cost,
    },
  };

  const sourceIndex = team.findIndex((p) => p.id === selectedPlayer.id);
  const targetIndex = team.findIndex((p) => p.id === targetPlayer.id);

  if (sourceIndex !== -1) {
    updatedTeam[sourceIndex] = selectedPlayerObj;
  } else {
    updatedTeam.push(selectedPlayerObj);
  }

  if (targetIndex !== -1) {
    updatedTeam[targetIndex] = targetPlayerObject;
  } else {
    updatedTeam.push(targetPlayerObject);
  }

  return updatedTeam;
};

// Dehydrate the reduced form transferPlan
export const dehydrateFromTransferPlan = (
  transferPlan: Change[],
  players: Player[]
): Change[] => {
  const changes = [] as Change[];

  for (const plan of transferPlan) {
    if (plan.type === "swap" || plan.type === "transfer") {
      const teamChange = plan as TeamChange<ChangePlayer>;
      const selectedPlayer = players.find(
        (p) => p.id === teamChange.selectedPlayer.id
      );
      const targetPlayer = players.find(
        (p) => p.id === teamChange.targetPlayer.id
      );
      // Leave out invalid change
      // TODO: return invalid change as well?
      if (selectedPlayer && targetPlayer) {
        const fullTeamChange = {
          ...plan,
          // Dehydrate player data
          selectedPlayer: {
            ...players.find((p) => p.id === teamChange.selectedPlayer.id)!,
            pick: teamChange.selectedPlayer.pick,
          },
          targetPlayer: {
            ...players.find((p) => p.id === teamChange.targetPlayer.id)!,
            pick: teamChange.targetPlayer.pick,
          },
        } as TeamChange<FullChangePlayer>;
        changes.push(fullTeamChange);
      }
    } else if (plan.type === "preseason") {
      const preseasonChange = plan as PreseasonChange<ChangePlayer>;
      const fullPreseasonChange = {
        ...preseasonChange,
        team: preseasonChange.team.reduce((team, player) => {
          const fullPlayer = players.find((p) => p.id === player.id);
          if (fullPlayer) {
            team.push({
              ...player,
              ...fullPlayer,
            });
          } else {
            team.push({
              ...player,
              ...makePlaceholderPlayerFromId(player.id),
            });
          }
          return team;
        }, [] as FullChangePlayer[]),
      } as PreseasonChange<FullChangePlayer>;
      changes.push(fullPreseasonChange);
    }
  }

  return changes;
};

// Check if the two players is eligible to be swapped
export const isSwapable = (
  selectedPlayer: FullChangePlayer,
  targetPlayer: FullChangePlayer,
  team: GroupedTeam
) => {
  const { GKP, DEF, MID, FWD, bench } = team;
  if (
    !selectedPlayer ||
    !targetPlayer ||
    targetPlayer.id === selectedPlayer.id
  ) {
    return false;
  }

  const minStartingPosition: Record<string, number> = {
    GKP: 1,
    DEF: 3,
    MID: 2,
    FWD: 1,
  };

  const maxStartingPosition: Record<string, number> = {
    GKP: 1,
    DEF: 5,
    MID: 5,
    FWD: 3,
  };

  const startingMap: Record<string, Player[]> = { GKP, DEF, MID, FWD };

  const isTargetPlayerSamePosition =
    targetPlayer.element_type.singular_name_short ===
    selectedPlayer.element_type.singular_name_short;

  const isTargetPlayerOnBench = bench.some((p) => p.id === targetPlayer.id);
  const isSelectedPlayerOnBench = bench.some((p) => p.id === selectedPlayer.id);

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

  if (isTargetPlayerSamePosition) {
    return true;
  }

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
