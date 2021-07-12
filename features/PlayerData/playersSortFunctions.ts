import { MatchStat, Player } from "~/features/PlayerData/playerDataTypes";

export type PlayersSortFunction = (a: Player, b: Player) => number;

export type PlayersSortableKeys =
  | "starred"
  | "name"
  | "team"
  | "position"
  | "cost"
  | "ownership"
  | "fixtures"
  | "points"
  | "goals"
  | "assists"
  | "shots"
  | "keyPasses"
  | "xg"
  | "xa"
  | "xga"
  | "xgi";

const makePastMatchesSortFn =
  (key: keyof MatchStat) => (a: Player, b: Player) => {
    if (
      !a.linked_data.past_matches ||
      a.linked_data.past_matches.filter(
        (m) => (m[key] as null | number) !== null
      ).length < 5
    )
      return 1;
    if (
      !b.linked_data.past_matches ||
      b.linked_data.past_matches.filter(
        (m) => (m[key] as null | number) !== null
      ).length < 5
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

const sortFns = {
  starred: (a, b) => {
    if (a.client_data.starred_index > b.client_data.starred_index) return -1;
    else if (a.client_data.starred_index < b.client_data.starred_index)
      return 1;
    return a.now_cost > b.now_cost ? -1 : a.now_cost < b.now_cost ? 1 : 0;
  },
  name: (a, b) => a.web_name.localeCompare(b.web_name),
  team: (a, b) => a.team.short_name.localeCompare(b.team.short_name),
  position: (a, b) =>
    a.element_type.singular_name_short.localeCompare(
      b.element_type.singular_name_short
    ),
  cost: (a, b) =>
    a.now_cost === b.now_cost ? 0 : a.now_cost > b.now_cost ? 1 : -1,
  ownership: (a, b) =>
    +a.selected_by_percent > +b.selected_by_percent ? 1 : -1,
  fixtures: (a, b) => {
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
  points: (a, b) => {
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
  goals: makePastMatchesSortFn("match_g"),
  assists: makePastMatchesSortFn("match_a"),
  shots: makePastMatchesSortFn("match_shots"),
  keyPasses: makePastMatchesSortFn("match_key_passes"),
  xg: makePastMatchesSortFn("match_xg"),
  xa: makePastMatchesSortFn("match_xa"),
  xga: makePastMatchesSortFn("match_xga"),
  xgi: (a, b) => {
    if (
      !a.linked_data.past_matches ||
      a.linked_data.past_matches.filter(
        (m) => m.match_xg !== null && m.match_xa !== null
      ).length < 5
    )
      return 1;
    if (
      !b.linked_data.past_matches ||
      b.linked_data.past_matches.filter(
        (m) => m.match_xg !== null && m.match_xa !== null
      ).length < 5
    )
      return -1;
    const sumA = a.linked_data.past_matches.reduce(
      (sum, m) => (m.match_xg ?? 0) + (m.match_xa ?? 0) + sum,
      0
    );
    const sumB = b.linked_data.past_matches.reduce(
      (sum, m) => (m.match_xg ?? 0) + (m.match_xa ?? 0) + sum,
      0
    );
    if (sumA < sumB) return 1;
    if (sumA > sumB) return -1;
    return 0;
  },
} as Record<PlayersSortableKeys, PlayersSortFunction>;

export default sortFns;
