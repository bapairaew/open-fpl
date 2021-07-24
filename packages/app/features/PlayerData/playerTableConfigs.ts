import playersSortFunctions from "@open-fpl/app/features/PlayerData/playersSortFunctions";
import {
  PlayerTableColumn,
  PlayerTableConfig,
} from "@open-fpl/app/features/PlayerData/playerTableTypes";

const playerTableConfigs = {
  Tool: {
    columnWidth: 92,
    hideHeader: true,
    hideMenu: true,
  },
  Name: {
    columnWidth: 150,
    sticky: 0,
    sortFn: playersSortFunctions.name,
    reversedSortFn: playersSortFunctions.reversedName,
  },
  Team: {
    columnWidth: 100,
    sortFn: playersSortFunctions.team,
    reversedSortFn: playersSortFunctions.reversedTeam,
  },
  Position: {
    columnWidth: 100,
    sortFn: playersSortFunctions.position,
    reversedSortFn: playersSortFunctions.reversedPosition,
  },
  Cost: {
    columnWidth: 120,
    sortFn: playersSortFunctions.cost,
    reversedSortFn: playersSortFunctions.reversedCost,
  },
  Ownership: {
    columnWidth: 140,
    sortFn: playersSortFunctions.ownership,
    reversedSortFn: playersSortFunctions.reversedOwnership,
  },
  Fixtures: {
    columnWidth: 350,
    sortFn: playersSortFunctions.fixtures,
    reversedSortFn: playersSortFunctions.reversedFixtures,
  },
  Points: {
    columnWidth: 350,
    sortFn: playersSortFunctions.points,
    reversedSortFn: playersSortFunctions.reversedPoints,
  },
  Goals: {
    columnWidth: 350,
    sortFn: playersSortFunctions.goals,
    reversedSortFn: playersSortFunctions.reversedGoals,
  },
  Assists: {
    columnWidth: 350,
    sortFn: playersSortFunctions.assists,
    reversedSortFn: playersSortFunctions.reversedAssists,
  },
  Shots: {
    columnWidth: 350,
    sortFn: playersSortFunctions.shots,
    reversedSortFn: playersSortFunctions.reversedShots,
  },
  "Key passes": {
    columnWidth: 350,
    sortFn: playersSortFunctions.keyPasses,
    reversedSortFn: playersSortFunctions.reversedKeyPasses,
  },
  xG: {
    columnWidth: 350,
    sortFn: playersSortFunctions.xg,
    reversedSortFn: playersSortFunctions.reversedXG,
  },
  xA: {
    columnWidth: 350,
    sortFn: playersSortFunctions.xa,
    reversedSortFn: playersSortFunctions.reversedXA,
  },
  xGA: {
    columnWidth: 350,
    sortFn: playersSortFunctions.xga,
    reversedSortFn: playersSortFunctions.reversedXGA,
  },
} as Record<PlayerTableColumn, PlayerTableConfig>;

export default playerTableConfigs;
