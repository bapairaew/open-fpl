import { MatchStat, Player } from "~/features/AppData/appDataTypes";
import {
  PlayerTableColumn,
  PlayerTableConfig,
} from "~/features/PlayerData/playerTableTypes";
import playersSortFunctions from "~/features/PlayerData/playersSortFunctions";

const playerTableConfigs = {
  Tool: {
    columnWidth: 92,
    hideHeader: true,
    hideMenu: true,
    sticky: 0,
  },
  Name: {
    columnWidth: 200,
    sticky: 92,
    sortFn: playersSortFunctions.name,
  },
  Team: {
    columnWidth: 120,
    sortFn: playersSortFunctions.team,
  },
  Position: {
    columnWidth: 120,
    sortFn: playersSortFunctions.position,
  },
  Cost: {
    columnWidth: 120,
    sortFn: playersSortFunctions.cost,
  },
  Ownership: {
    columnWidth: 140,
    sortFn: playersSortFunctions.ownership,
  },
  Fixtures: {
    columnWidth: 350,
    sortFn: playersSortFunctions.fixtures,
  },
  Points: {
    columnWidth: 350,
    sortFn: playersSortFunctions.points,
  },
  Goals: {
    columnWidth: 350,
    sortFn: playersSortFunctions.goals,
  },
  Assists: {
    columnWidth: 350,
    sortFn: playersSortFunctions.assists,
  },
  Shots: {
    columnWidth: 350,
    sortFn: playersSortFunctions.shots,
  },
  "Key passes": {
    columnWidth: 350,
    sortFn: playersSortFunctions.keyPasses,
  },
  xG: {
    columnWidth: 350,
    sortFn: playersSortFunctions.xg,
  },
  xA: {
    columnWidth: 350,
    sortFn: playersSortFunctions.xa,
  },
  xGA: {
    columnWidth: 350,
    sortFn: playersSortFunctions.xga,
  },
} as Record<PlayerTableColumn, PlayerTableConfig>;

export default playerTableConfigs;
