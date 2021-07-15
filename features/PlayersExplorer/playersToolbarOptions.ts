import playersSortFunctions from "~/features/PlayerData/playersSortFunctions";
import {
  DisplayOptionsConfig,
  FilterOptions,
  SortOptionsConfig,
} from "~/features/PlayersExplorer/playersExplorerTypes";

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
    label: "Starred players first",
    value: "starred",
    sortFn: (a, b) => {
      const result = playersSortFunctions.starred(a, b);
      return result === 0 ? playersSortFunctions.reversedCost(a, b) : result;
    },
  },
  {
    label: "Best recent xGI",
    value: "best-xgi",
    sortFn: playersSortFunctions.xgi,
  },
  {
    label: "Best recent xGA",
    value: "best-xga",
    sortFn: playersSortFunctions.reversedXGA,
  },
  {
    label: "Best fixtures",
    value: "best-fixtures",
    sortFn: playersSortFunctions.fixtures,
  },
  {
    label: "Cost: high to low",
    value: "cost-desc",
    sortFn: playersSortFunctions.reversedCost,
  },
  {
    label: "Cost: low to high",
    value: "cost-asc",
    sortFn: playersSortFunctions.cost,
  },
  {
    label: "Ownership: high to low",
    value: "ownership-desc",
    sortFn: playersSortFunctions.reversedOwnership,
  },
  {
    label: "Ownership: low to high",
    value: "ownership-asc",
    sortFn: playersSortFunctions.ownership,
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
