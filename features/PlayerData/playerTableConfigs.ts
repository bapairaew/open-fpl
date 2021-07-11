import { MatchStat, Player } from "~/features/AppData/appDataTypes";
import {
  PlayerTableColumn,
  PlayerTableConfig,
} from "~/features/PlayerData/playerTableTypes";

const makeSortFn = (key: keyof MatchStat) => (a: Player, b: Player) => {
  if (
    !a.linked_data.past_matches ||
    a.linked_data.past_matches.filter((m) => (m[key] as null | number) !== null)
      .length < 5
  )
    return 1;
  if (
    !b.linked_data.past_matches ||
    b.linked_data.past_matches.filter((m) => (m[key] as null | number) !== null)
      .length < 5
  )
    return -1;
  const sumA = a.linked_data.past_matches.reduce(
    (sum, m) => ((m[key] as null | number) ?? 0) + sum,
    0
  );
  const sumB = b.linked_data.past_matches.reduce(
    (sum, m) => ((m[key] as null | number) ?? 0) + sum,
    0
  );
  if (sumA < sumB) return 1;
  if (sumA > sumB) return -1;
  return 0;
};

const playerTableConfigs = {
  Tool: {
    columnWidth: 92,
    hideHeader: true,
    hideMenu: true,
  },
  Name: {
    columnWidth: 200,
    sticky: true,
    sortFn: (a, b) => a.web_name.localeCompare(b.web_name),
  },
  Team: {
    columnWidth: 120,
    sortFn: (a, b) => a.team.short_name.localeCompare(b.team.short_name),
  },
  Position: {
    columnWidth: 120,
    sortFn: (a, b) =>
      a.element_type.singular_name_short.localeCompare(
        b.element_type.singular_name_short
      ),
  },
  Cost: {
    columnWidth: 120,
    sortFn: (a, b) =>
      a.now_cost === b.now_cost ? 0 : a.now_cost > b.now_cost ? 1 : -1,
  },
  Ownership: {
    columnWidth: 140,
    sortFn: (a, b) =>
      a.selected_by_percent.localeCompare(b.selected_by_percent),
  },
  Fixtures: {
    columnWidth: 350,
    sortFn: (a, b) => {
      // Sort reversed difficulty value (5 is better than 1), and sum them all which makes the value the more the better (more matches and easier)
      const sumA =
        a.linked_data.next_gameweeks
          ?.slice(0, 5)
          .reduce((s, g) => s + (5 - g.difficulty), 0) || 0;
      const sumB =
        b.linked_data.next_gameweeks
          ?.slice(0, 5)
          .reduce((s, g) => s + (5 - g.difficulty), 0) || 0;
      return sumA === sumB
        ? a.team.short_name.localeCompare(b.team.short_name) // Make sure same team is group together in the result
        : sumA > sumB
        ? -1
        : 1;
    },
  },
  Points: {
    columnWidth: 350,
    sortFn: (a, b) => {
      // Sort reversed difficulty value (5 is better than 1), and sum them all which makes the value the more the better (more matches and easier)
      const sumA =
        a.linked_data.previous_gameweeks
          ?.slice(0, 5)
          .reduce((s, g) => s + g.total_points, 0) || 0;
      const sumB =
        b.linked_data.previous_gameweeks
          ?.slice(0, 5)
          .reduce((s, g) => s + g.total_points, 0) || 0;
      if (sumA < sumB) return -1;
      if (sumA > sumB) return 1;
      const sortResult =
        a.total_points === b.total_points
          ? 0
          : a.total_points > b.total_points
          ? -1
          : 1;
      return sortResult;
    },
  },
  Goals: {
    columnWidth: 350,
    sortFn: makeSortFn("match_g"),
  },
  Assists: {
    columnWidth: 350,
    sortFn: makeSortFn("match_a"),
  },
  Shots: {
    columnWidth: 350,
    sortFn: makeSortFn("match_shots"),
  },
  "Key passes": {
    columnWidth: 350,
    sortFn: makeSortFn("match_key_passes"),
  },
  xG: {
    columnWidth: 350,
    sortFn: makeSortFn("match_xg"),
  },
  xA: {
    columnWidth: 350,
    sortFn: makeSortFn("match_xa"),
  },
  xGA: {
    columnWidth: 350,
    sortFn: makeSortFn("match_xga"),
  },
} as Record<PlayerTableColumn, PlayerTableConfig>;

export default playerTableConfigs;
