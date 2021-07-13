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
  | "xgi"
  | "reversedStarred"
  | "reversedName"
  | "reversedTeam"
  | "reversedPosition"
  | "reversedCost"
  | "reversedOwnership"
  | "reversedFixtures"
  | "reversedPoints"
  | "reversedGoals"
  | "reversedAssists"
  | "reversedShots"
  | "reversedKeyPasses"
  | "reversedXG"
  | "reversedXA"
  | "reversedXGA"
  | "reversedXGI";

const makePastMatchesSortFn =
  (key: keyof MatchStat, direction: -1 | 1) => (a: Player, b: Player) => {
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
    if (sumA < sumB) return direction;
    if (sumA > sumB) return -1 * direction;
    return 0;
  };

const makeXGISortFn = (direction: -1 | 1) => (a: Player, b: Player) => {
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
  if (sumA < sumB) return direction;
  if (sumA > sumB) return -1 * direction;
  return 0;
};

const starred = (a: Player, b: Player) => {
  if (a.client_data.starred_index > b.client_data.starred_index) return -1;
  else if (a.client_data.starred_index < b.client_data.starred_index) return 1;
  return 0;
};
const name = (a: Player, b: Player) => a.web_name.localeCompare(b.web_name);
const team = (a: Player, b: Player) =>
  a.team.short_name.localeCompare(b.team.short_name);
const position = (a: Player, b: Player) =>
  a.element_type.singular_name_short.localeCompare(
    b.element_type.singular_name_short
  );
const cost = (a: Player, b: Player) =>
  a.now_cost === b.now_cost ? 0 : a.now_cost > b.now_cost ? 1 : -1;
const ownership = (a: Player, b: Player) =>
  +a.selected_by_percent > +b.selected_by_percent ? 1 : -1;
const fixtures = (a: Player, b: Player) => {
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
};
const points = (a: Player, b: Player) => {
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
};

const sortFns = {
  starred,
  name,
  team,
  position,
  cost,
  ownership,
  fixtures,
  points,
  reversedStarred: (a, b) => -1 * starred(a, b),
  reversedName: (a, b) => -1 * name(a, b),
  reversedTeam: (a, b) => -1 * team(a, b),
  reversedPosition: (a, b) => -1 * position(a, b),
  reversedCost: (a, b) => -1 * cost(a, b),
  reversedOwnership: (a, b) => -1 * ownership(a, b),
  reversedFixtures: (a, b) => -1 * fixtures(a, b),
  reversedPoints: (a, b) => -1 * points(a, b),
  goals: makePastMatchesSortFn("match_g", 1),
  assists: makePastMatchesSortFn("match_a", 1),
  shots: makePastMatchesSortFn("match_shots", 1),
  keyPasses: makePastMatchesSortFn("match_key_passes", 1),
  xg: makePastMatchesSortFn("match_xg", 1),
  xa: makePastMatchesSortFn("match_xa", 1),
  xga: makePastMatchesSortFn("match_xga", 1),
  reversedGoals: makePastMatchesSortFn("match_g", -1),
  reversedAssists: makePastMatchesSortFn("match_a", -1),
  reversedShots: makePastMatchesSortFn("match_shots", -1),
  reversedKeyPasses: makePastMatchesSortFn("match_key_passes", -1),
  reversedXG: makePastMatchesSortFn("match_xg", -1),
  reversedXA: makePastMatchesSortFn("match_xa", -1),
  reversedXGA: makePastMatchesSortFn("match_xga", -1),
  xgi: makeXGISortFn(1),
  reversedXGI: makeXGISortFn(-1),
} as Record<PlayersSortableKeys, PlayersSortFunction>;

export default sortFns;
