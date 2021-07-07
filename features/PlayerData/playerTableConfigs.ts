import { isNullOrUndefined } from "~/features/Common/utils";
import {
  PlayerTableColumn,
  PlayerTableConfig,
} from "~/features/PlayerData/playerTableTypes";

const playerTableConfigs = {
  Tool: {
    columnWidth: 40,
    hideHeader: true,
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
    sortFn: (a, b) => `${a.now_cost}`.localeCompare(`${b.now_cost}`), // Should do normal number compare?
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
  xGI: {
    columnWidth: 350,
    sortFn: (a, b) => {
      if (
        !a.linked_data.past_matches ||
        a.linked_data.past_matches.filter(
          (m) => !isNullOrUndefined(m.match_xgi)
        ).length < 5
      )
        return 1;
      if (
        !b.linked_data.past_matches ||
        b.linked_data.past_matches.filter(
          (m) => !isNullOrUndefined(m.match_xgi)
        ).length < 5
      )
        return -1;
      const sumA = a.linked_data.past_matches.reduce(
        (sum, m) => (m.match_xgi || 0) + sum,
        0
      );
      const sumB = b.linked_data.past_matches.reduce(
        (sum, m) => (m.match_xgi || 0) + sum,
        0
      );
      if (sumA < sumB) return 1;
      if (sumA > sumB) return -1;
      return 0;
    },
  },
  xGA: {
    columnWidth: 350,
    sortFn: (a, b) => {
      if (
        !a.linked_data.past_matches ||
        a.linked_data.past_matches.filter(
          (m) => !isNullOrUndefined(m.match_xga)
        ).length < 5
      )
        return 1;
      if (
        !b.linked_data.past_matches ||
        b.linked_data.past_matches.filter(
          (m) => !isNullOrUndefined(m.match_xga)
        ).length < 5
      )
        return -1;
      const sumA = a.linked_data.past_matches.reduce(
        (sum, m) => (m.match_xga || 0) + sum,
        0
      );
      const sumB = b.linked_data.past_matches.reduce(
        (sum, m) => (m.match_xga || 0) + sum,
        0
      );
      if (sumA < sumB) return -1;
      if (sumA > sumB) return 1;
      return 0;
    },
  },
} as Record<PlayerTableColumn, PlayerTableConfig>;

export default playerTableConfigs;
