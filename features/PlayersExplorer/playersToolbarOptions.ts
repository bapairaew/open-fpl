import { Player } from "~/features/AppData/appDataTypes";
import { isNullOrUndefined } from "~/features/Common/utils";

export interface FilterOptionsConfig {
  field: string;
  getFieldValue: (player: Player) => any;
}
export interface FilterOptions {
  keywords: FilterOptionsConfig[];
  ranges: FilterOptionsConfig[];
}

export interface SortOptionsConfig {
  label: string;
  value: string;
  sortFn: (a: Player, b: Player) => number;
}

export interface DisplayOptionsConfig {
  label: string;
  value: string;
}

export const filterOptions: FilterOptions = {
  keywords: [
    { field: "id", getFieldValue: (p) => `${p.id}` },
    { field: "name", getFieldValue: (p) => p.web_name },
    { field: "team", getFieldValue: (p) => p.team.short_name },
    {
      field: "position",
      getFieldValue: (p) => p.element_type.singular_name_short,
    },
  ],
  ranges: [{ field: "cost", getFieldValue: (p) => p.now_cost / 10 }],
};

export const sortOptions: SortOptionsConfig[] = [
  {
    label: "Best recent xGI",
    value: "best-xgi",
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
  {
    label: "Best recent xGA",
    value: "best-xga",
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
  {
    label: "Best fixtures",
    value: "best-fixtures",
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
  {
    label: "Price: low to high",
    value: "price-asc",
    sortFn: (a, b) => (a.now_cost < b.now_cost ? -1 : 1),
  },
  {
    label: "Price: high to low",
    value: "price-desc",
    sortFn: (a, b) => (a.now_cost > b.now_cost ? -1 : 1),
  },
  {
    label: "Ownership: low to high",
    value: "ownership-asc",
    sortFn: (a, b) =>
      +a.selected_by_percent > +b.selected_by_percent ? 1 : -1,
  },
  {
    label: "Ownership: high to low",
    value: "ownership-desc",
    sortFn: (a, b) =>
      +a.selected_by_percent < +b.selected_by_percent ? 1 : -1,
  },
];

export const displayOptions = [
  {
    label: "Grid",
    value: "grid",
  },
  {
    label: "Table",
    value: "table",
  },
  {
    label: "Chart",
    value: "chart",
  },
] as DisplayOptionsConfig[];
