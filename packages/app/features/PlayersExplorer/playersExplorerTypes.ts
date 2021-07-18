import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";

export interface FilterOptionsConfig {
  field: string;
  getFieldValue: (player: Player) => any;
}

export interface FilterOptions {
  keywords: FilterOptionsConfig[];
  ranges: FilterOptionsConfig[];
}

export type SortOptions =
  | "starred"
  | "best-xgi"
  | "best-xga"
  | "best-fixtures"
  | "cost-asc"
  | "cost-desc"
  | "ownership-asc"
  | "ownership-desc";

export interface SortOptionsConfig {
  label: string;
  value: SortOptions;
  sortFn: (a: Player, b: Player) => number;
}

export type DisplayOptions = "grid" | "table" | "chart";

export interface DisplayOptionsConfig<T = DisplayOptions> {
  label: string;
  value: T;
}
