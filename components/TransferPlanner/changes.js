// Apply the changes against the given team
export const processChanges = (team, changes) => {
  const updatedTeam = team ? [...team] : [];
  const invalidChanges = [];
  for (const change of changes) {
    const sourceIndex = updatedTeam.findIndex(
      (p) => p.element === change.selectedPlayer.id
    );
    const targetIndex = updatedTeam.findIndex(
      (p) => p.element === change.targetPlayer.id
    );

    if (change.type === "swap") {
      if (sourceIndex === -1 || targetIndex === -1) {
        const invalidPlayer =
          sourceIndex === -1
            ? change.selectedPlayer.web_name
            : change.targetPlayer.web_name;
        invalidChanges.push({
          type: "swap_non_existed_player",
          message: `${invalidPlayer} is not in the team.`,
          change,
        });
      } else {
        updatedTeam[sourceIndex] = {
          ...team[targetIndex],
          position: sourceIndex + 1,
        };
        updatedTeam[targetIndex] = {
          ...team[sourceIndex],
          position: targetIndex + 1,
        };
      }
    } else if (change.type === "transfer") {
      if (sourceIndex === -1) {
        const invalidPlayer = change.selectedPlayer.web_name;
        invalidChanges.push({
          type: "transfer_non_existed_player",
          message: `${invalidPlayer} is not in the team.`,
          change,
        });
      } else {
        updatedTeam[sourceIndex] = {
          ...updatedTeam[sourceIndex],
          element: change.targetPlayer.id,
          position: change.selectedPlayer.pick.position,
          now_cost: change.targetPlayer.now_cost,
          selling_price: change.targetPlayer.now_cost,
          purchase_price: change.targetPlayer.now_cost,
        };
      }
    }
  }
  return {
    updatedTeam,
    invalidChanges,
  };
};

// Merge the change by either add newChange to the list or remove prior opposite change
export const addChange = (changes, newChange) => {
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
  return [
    ...changes,
    {
      id: Math.random(), // Set ID for easier management later
      ...newChange,
    },
  ].map((change) => ({
    ...change,
    // Minimise the size saved in storage by saving only ID and non-static data
    selectedPlayer: {
      id: change.selectedPlayer.id,
      pick: change.selectedPlayer.pick,
    },
    targetPlayer: {
      id: change.targetPlayer.id,
      pick: change.targetPlayer.pick,
    },
  }));
};

// NOTE: this might be buggy if it is done in the middle of a long chain
// (e.g. transfer in A and then transfer out A and then remove the first action)
// TODO: may need another function to "purify" the existinging changes after the removal
export const removeChange = (changes, removingChange) => {
  return changes.filter((c) => c.id !== removingChange.id);
};

export const getChangesFromTransferPlan = (transferPlan, players) => {
  return players
    ? transferPlan?.map((plan) => ({
        ...plan,
        // Dehydrate player data
        selectedPlayer: {
          ...players.find((p) => p.id === plan.selectedPlayer.id),
          pick: plan.selectedPlayer.pick,
        },
        targetPlayer: {
          ...players.find((p) => p.id === plan.targetPlayer.id),
          pick: plan.targetPlayer.pick,
        },
      }))
    : [];
};

export const isSwapable = (
  selectedPlayer,
  targetPlayer,
  { GKP, DEF, MID, FWD, bench }
) => {
  if (
    !selectedPlayer ||
    !targetPlayer ||
    targetPlayer.id === selectedPlayer.id
  ) {
    return false;
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

  const isTargetPlayerSamePosition =
    targetPlayer.element_type.singular_name_short ===
    selectedPlayer.element_type.singular_name_short;

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

  if (isTargetPlayerSamePosition) {
    return isTargetPlayerOnBench;
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
