import { Invalid } from "~/features/Common/errorTypes";
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "~/features/Common/useLocalStorage";
import { Player } from "~/features/PlayerData/playerDataTypes";
import {
  ChipName,
  EntryChipPlay,
  EntryEventHistory,
  EntryEventPick,
  Transfer,
} from "~/features/RemoteData/fplTypes";
import {
  getProfilesKey,
  getTransferPlanKey,
  getTransferPlansKey,
} from "~/features/Settings/storageKeys";
import { makePlaceholderPlayerFromId } from "~/features/TransferPlanner/placeholderPlayer";
import {
  Change,
  ChangePlayer,
  ChipChange,
  ChipUsage,
  FullChangePlayer,
  GameweekData,
  GroupedTeam,
  InvalidChange,
  Pick,
  SinglePlayerChange,
  TeamChange,
  TwoPlayersChange,
} from "~/features/TransferPlanner/transferPlannerTypes";

// Apply the changes against the given team
const getGameweekPicks = (
  initialPicks: EntryEventPick[] | null,
  transfers: Transfer[],
  chips: EntryChipPlay[],
  players: Player[],
  allChanges: Change[],
  planningGameweek: number
): {
  picks: Pick[];
  chipUsages: ChipUsage[];
  invalidChanges: InvalidChange[];
} => {
  const freeHitUsage = allChanges.find(
    (c) => c.type === "use-chip" && (c as ChipChange).chip === "freehit"
  );

  const changes = [...allChanges]
    .sort((a, b) =>
      a.gameweek > b.gameweek ? 1 : a.gameweek < b.gameweek ? -1 : 0
    )
    .filter(
      (c) =>
        c.gameweek <= planningGameweek &&
        // Ignore transfer/swap/set-captain/set-vice-captain changes in the freehitted gameweek in the following gameweeks
        (!freeHitUsage ||
          !["transfer", "swap", "set-captain", "set-vice-catpain"].includes(
            c.type
          ) ||
          planningGameweek === freeHitUsage.gameweek ||
          c.gameweek !== freeHitUsage.gameweek)
    );

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

  const chipUsages = ["bboost", "3xc", "freehit", "wildcard"].map<ChipUsage>(
    (name) => ({
      name: name as ChipName,
      isActive: false,
      isUsed: chips.some((c) => c.name === name),
    })
  );

  const invalidChanges = [] as InvalidChange[];

  for (const change of changes) {
    if (change.type === "swap" || change.type === "transfer") {
      const twoPlayersChange = change as TwoPlayersChange<FullChangePlayer>;
      const sourceIndex = picks.findIndex(
        (p) => p.element === twoPlayersChange.selectedPlayer.id
      );
      const targetIndex = picks.findIndex(
        (p) => p.element === twoPlayersChange.targetPlayer.id
      );

      if (change.type === "swap") {
        if (sourceIndex === -1 || targetIndex === -1) {
          const invalidPlayer =
            sourceIndex === -1
              ? twoPlayersChange.selectedPlayer.web_name
              : twoPlayersChange.targetPlayer.web_name;
          invalidChanges.push({
            type: "swap_non_existed_player",
            message: `${invalidPlayer} is not in the team.`,
            change,
          });
        } else {
          const newSourcePick = {
            ...picks[targetIndex],
            position: picks[sourceIndex].position,
          };
          const newTargetPick = {
            ...picks[sourceIndex],
            position: picks[targetIndex].position,
          };
          picks[sourceIndex] = newSourcePick;
          picks[targetIndex] = newTargetPick;
        }
      } else if (change.type === "transfer") {
        if (sourceIndex === -1) {
          const invalidPlayer = twoPlayersChange.selectedPlayer.web_name;
          invalidChanges.push({
            type: "transfer_non_existed_player",
            message: `${invalidPlayer} is not in the team.`,
            change,
          });
        } else {
          picks[sourceIndex] = {
            ...picks[sourceIndex],
            element: twoPlayersChange.targetPlayer.id,
            position: twoPlayersChange.selectedPlayer.pick.position,
            now_cost: twoPlayersChange.targetPlayer.now_cost,
            selling_price: twoPlayersChange.targetPlayer.now_cost,
            purchase_price: twoPlayersChange.targetPlayer.now_cost,
          };
        }
      }
    } else if (
      change.type === "set-captain" ||
      change.type === "set-vice-captain"
    ) {
      const singlePlayerChange = change as SinglePlayerChange<FullChangePlayer>;
      const fieldName =
        change.type === "set-captain" ? "is_captain" : "is_vice_captain";

      const currentCaptainIndex = picks.findIndex((p) => p[fieldName] === true);
      if (currentCaptainIndex !== -1)
        picks[currentCaptainIndex] = {
          ...picks[currentCaptainIndex],
          [fieldName]: false,
        };
      const newCaptainIndex = picks.findIndex(
        (p) => p.element === singlePlayerChange.player.id
      );
      if (newCaptainIndex !== -1) {
        picks[newCaptainIndex] = {
          ...picks[newCaptainIndex],
          [fieldName]: true,
        };
      } else {
        invalidChanges.push({
          type: "captain_non_existed_player",
          message: `${singlePlayerChange.player.web_name} is not in the team.`,
          change,
        });
      }
    } else if (change.type === "preseason") {
      const teamChange = change as TeamChange<FullChangePlayer>;
      for (const player of teamChange.team) {
        picks.push(player.pick);
      }
    } else if (change.type === "use-chip") {
      const chipChange = change as ChipChange;
      const matched = chipUsages.find((c) => c.name === chipChange.chip);
      if (matched) {
        if (matched.isUsed) {
          invalidChanges.push({
            type: "chip_already_used",
            message: `${matched.name} is already used.`,
            change,
          });
        } else {
          matched.isUsed = true;
          matched.isActive = planningGameweek === change.gameweek;
        }
      }
    }
  }

  return {
    picks,
    chipUsages,
    invalidChanges,
  };
};

// Get remaining bank balance from changes
const getRemainingBank = (
  entryHistory: EntryEventHistory | null,
  changes: Change[],
  planningGameweek: number
) => {
  const currentBank = entryHistory?.bank ?? 1000; // entryHistory is null before the first gameweek
  const transfers = changes.filter(
    (c) =>
      (c.type === "transfer" || c.type === "preseason") &&
      c.gameweek <= planningGameweek
  );
  const diff = transfers?.reduce((sum, change) => {
    if (change.type === "transfer") {
      const sellingPrice = (change as TwoPlayersChange<FullChangePlayer>)
        .selectedPlayer.pick.selling_price;
      const nowCost = (change as TwoPlayersChange<FullChangePlayer>)
        .targetPlayer.now_cost;
      return sum + (sellingPrice - nowCost);
    } else if (change.type === "preseason") {
      const total = (change as TeamChange<FullChangePlayer>).team.reduce(
        (sum, player) => sum + player.now_cost,
        0
      );
      return sum - total;
    }
    return sum;
  }, 0);

  return (currentBank + diff) / 10;
};

// Combine initialPicks, transfers from API and changes from localStorage to make team and detect invalidities
export const getGameweekData = (
  initialPicks: EntryEventPick[] | null,
  transfers: Transfer[],
  chips: EntryChipPlay[],
  players: Player[],
  entryHistory: EntryEventHistory | null,
  currentGameweek: number,
  changes: Change[],
  planningGameweek: number
): GameweekData => {
  const { picks, chipUsages, invalidChanges } = getGameweekPicks(
    initialPicks,
    transfers,
    chips,
    players,
    changes,
    planningGameweek
  );

  const bank = getRemainingBank(entryHistory, changes, planningGameweek);

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

  let freeTransfersCount = 0;

  if (planningGameweek !== 1) {
    const gameweekDelta = planningGameweek - currentGameweek;
    if (gameweekDelta === 0) {
      const lastGameweekTransfersCount = transfers?.filter(
        (t) => t.event === currentGameweek - 1
      ).length;
      const currentGameweekFreeTransfers =
        lastGameweekTransfersCount >= 1 ? 1 : 2;
      freeTransfersCount = currentGameweekFreeTransfers;
    } else {
      const lastGameweekTransfersCount = changes.filter(
        (c) =>
          (c.type === "transfer" || c.type === "preseason") &&
          c.gameweek === planningGameweek - 1
      ).length;
      const currentGameweekFreeTransfers =
        lastGameweekTransfersCount >= 1 ? 1 : 2;
      freeTransfersCount = currentGameweekFreeTransfers;
    }
  }

  const planningGameweekTransferCount = changes.filter(
    (c) => c.type === "transfer" && c.gameweek === planningGameweek
  ).length;

  const hits = chipUsages.some(
    (c) => (c.name === "wildcard" || c.name === "freehit") && c.isActive
  )
    ? 0
    : Math.min(0, -4 * (planningGameweekTransferCount - freeTransfersCount));

  const freeTransfers = Math.max(
    0,
    freeTransfersCount - planningGameweekTransferCount
  );

  return {
    team,
    chipUsages,
    bank,
    hits,
    freeTransfers,
    invalidChanges,
    teamInvalidities,
    gameweek: planningGameweek,
  };
};

// Combine initialPicks, transfers from API and changes from localStorage to make team and detect invalidities for all gameweeks in changes
export const getAllGameweekDataList = (
  initialPicks: EntryEventPick[] | null,
  transfers: Transfer[],
  chips: EntryChipPlay[],
  players: Player[],
  entryHistory: EntryEventHistory | null,
  currentGameweek: number,
  changes: Change[]
): GameweekData[] => {
  const data = [] as GameweekData[];
  for (let i = 1; i <= 38; i++) {
    data.push(
      getGameweekData(
        initialPicks,
        transfers,
        chips,
        players,
        entryHistory,
        currentGameweek,
        changes,
        i
      )
    );
  }
  return data;
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
      const twoPlayersChange = change as TwoPlayersChange<FullChangePlayer>;
      const reducedTeamChange = {
        id: change.id,
        type: change.type,
        gameweek: change.gameweek,
        selectedPlayer: {
          id: twoPlayersChange.selectedPlayer.id,
          pick: twoPlayersChange.selectedPlayer.pick,
        },
        targetPlayer: {
          id: twoPlayersChange.targetPlayer.id,
          pick: twoPlayersChange.targetPlayer.pick,
        },
      } as TwoPlayersChange<ChangePlayer>;
      cleanedChanges.push(reducedTeamChange);
    } else if (
      change.type === "set-captain" ||
      change.type === "set-vice-captain"
    ) {
      // Always replace existing set-captain / set-vice-captain changes within the same gameweek
      cleanedChanges = cleanedChanges.filter(
        (c) => c.gameweek !== change.gameweek || c.type !== change.type
      );
      const singlePlayerChange = change as SinglePlayerChange<FullChangePlayer>;
      const reduceSinglePlayerChange = {
        id: singlePlayerChange.id,
        type: singlePlayerChange.type,
        gameweek: singlePlayerChange.gameweek,
        player: {
          id: singlePlayerChange.player.id,
        },
      } as SinglePlayerChange<ChangePlayer>;
      cleanedChanges.push(reduceSinglePlayerChange);
    } else if (change.type === "use-chip") {
      // Always replace existing set-captain / set-vice-captain changes within the same gameweek
      cleanedChanges = cleanedChanges.filter(
        (c) => c.gameweek !== change.gameweek || c.type !== change.type
      );
      const chipChange = change as ChipChange;
      cleanedChanges.push(chipChange);
    } else if (change.type === "preseason") {
      // Always replace existing preseason changes
      cleanedChanges = cleanedChanges.filter((c) => c.type !== change.type);
      const teamChange = change as TeamChange<FullChangePlayer>;
      const reducedTeamChange = {
        id: change.id,
        type: change.type,
        gameweek: change.gameweek,
        team: teamChange.team.map((player) => ({
          id: player.id,
          pick: player.pick,
        })),
      } as TeamChange<ChangePlayer>;
      cleanedChanges.push(reducedTeamChange);
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
    multiplier: 1,
    is_captain: false,
    is_vice_captain: false,
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
      multiplier: targetPlayer.pick.multiplier,
      is_captain: targetPlayer.pick.is_captain,
      is_vice_captain: targetPlayer.pick.is_vice_captain,
    } as Pick,
  };

  const targetPlayerObject = {
    id: selectedPlayer.id,
    pick: {
      element: selectedPlayer.id,
      position: targetPlayer.pick.position,
      now_cost: selectedPlayer.now_cost,
      selling_price: selectedPlayer.now_cost,
      purchase_price: selectedPlayer.now_cost,
      multiplier: selectedPlayer.pick.multiplier,
      is_captain: selectedPlayer.pick.is_captain,
      is_vice_captain: selectedPlayer.pick.is_vice_captain,
    } as Pick,
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

// Handle set captain with probable placeholder players
// To save storage space preseason change save a whole instead of transaction
export const processPreseasonSetCaptain = (
  team: FullChangePlayer[],
  player: FullChangePlayer,
  type: "set-captain" | "set-vice-captain"
): ChangePlayer[] => {
  return team.map((p) => {
    if (type === "set-captain") {
      return {
        ...p,
        pick: {
          ...p.pick,
          is_captain: player.id === p.id,
        },
      };
    } else if (type === "set-vice-captain") {
      return {
        ...p,
        pick: {
          ...p.pick,
          is_vice_captain: player.id === p.id,
        },
      };
    }

    return player;
  });
};

// Dehydrate the reduced form transferPlan
export const dehydrateFromTransferPlan = (
  transferPlan: Change[],
  players: Player[]
): Change[] => {
  const changes = [] as Change[];

  for (const plan of transferPlan) {
    if (plan.type === "swap" || plan.type === "transfer") {
      const twoPlayersChange = plan as TwoPlayersChange<ChangePlayer>;
      const selectedPlayer = players.find(
        (p) => p.id === twoPlayersChange.selectedPlayer.id
      );
      const targetPlayer = players.find(
        (p) => p.id === twoPlayersChange.targetPlayer.id
      );
      // Leave out invalid change
      // TODO: return invalid change as well?
      if (selectedPlayer && targetPlayer) {
        const fullTeamChange = {
          ...plan,
          // Dehydrate player data
          selectedPlayer: {
            ...players.find(
              (p) => p.id === twoPlayersChange.selectedPlayer.id
            )!,
            pick: twoPlayersChange.selectedPlayer.pick,
          },
          targetPlayer: {
            ...players.find((p) => p.id === twoPlayersChange.targetPlayer.id)!,
            pick: twoPlayersChange.targetPlayer.pick,
          },
        } as TwoPlayersChange<FullChangePlayer>;
        changes.push(fullTeamChange);
      }
    } else if (
      plan.type === "set-captain" ||
      plan.type === "set-vice-captain"
    ) {
      const singlePlayerChange = plan as SinglePlayerChange<ChangePlayer>;
      const player = players.find((p) => p.id === singlePlayerChange.player.id);
      if (player) {
        const fullSinglePlayerChange = {
          ...plan,
          player,
        } as SinglePlayerChange<FullChangePlayer>;
        changes.push(fullSinglePlayerChange);
      }
    } else if (plan.type === "preseason") {
      const teamChange = plan as TeamChange<ChangePlayer>;
      const fullTeamChange = {
        ...teamChange,
        team: teamChange.team.reduce((team, player) => {
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
      } as TeamChange<FullChangePlayer>;
      changes.push(fullTeamChange);
    } else {
      // For use-chip and unexpected changes
      changes.push(plan);
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

export const removePlayerFromPlans = (player: Player) => {
  const profiles = getLocalStorageItem<string[]>(getProfilesKey(), []) || [];
  for (const profile of profiles) {
    const transferPlans =
      getLocalStorageItem<string[]>(getTransferPlansKey(profile), []) || [];
    for (const plan of transferPlans) {
      const transferPlan =
        getLocalStorageItem<Change[]>(getTransferPlanKey(profile, plan), []) ||
        [];

      const updatedTransferPlan = transferPlan
        .filter((change) => {
          if (change.type === "swap" || change.type === "transfer") {
            const twoPlayersChange = change as TwoPlayersChange<ChangePlayer>;
            return (
              twoPlayersChange.selectedPlayer.id !== player.id &&
              twoPlayersChange.targetPlayer.id !== player.id
            );
          } else if (
            change.type === "set-captain" ||
            change.type === "set-vice-captain"
          ) {
            const singlePlayerChange =
              change as SinglePlayerChange<ChangePlayer>;
            return singlePlayerChange.player.id !== player.id;
          }

          return true;
        })
        .map((change) => {
          if (change.type === "preseason") {
            const teamChange = change as TeamChange<ChangePlayer>;
            teamChange.team = teamChange.team.filter((p) => {
              return p.id !== player.id;
            });
            return teamChange;
          }

          return change;
        });

      setLocalStorageItem(
        getTransferPlanKey(profile, plan),
        updatedTransferPlan
      );
    }
  }
};
