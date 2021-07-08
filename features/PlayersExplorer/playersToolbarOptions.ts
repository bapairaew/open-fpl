import playerTableConfigs from "~/features/PlayerData/playerTableConfigs";
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
    label: "Best recent xGI",
    value: "best-xgi",
    sortFn: playerTableConfigs.xGI.sortFn!,
  },
  {
    label: "Best recent xGA",
    value: "best-xga",
    sortFn: playerTableConfigs.xGA.sortFn!,
  },
  {
    label: "Best fixtures",
    value: "best-fixtures",
    sortFn: playerTableConfigs.Fixtures.sortFn!,
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
