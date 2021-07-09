import { Player } from "~/features/AppData/appDataTypes";

export interface FilterOptionsConfig {
  field: string;
  getFieldValue: (player: Player) => any;
}

export interface FilterOptions {
  keywords: FilterOptionsConfig[];
  ranges: FilterOptionsConfig[];
}

export type SortOptions =
  | "best-xgi"
  | "best-xga"
  | "best-fixtures"
  | "price-asc"
  | "price-desc"
  | "ownership-asc"
  | "ownership-desc";

export interface SortOptionsConfig<T = SortOptions> {
  label: string;
  value: T;
  sortFn: (a: Player, b: Player) => number;
}

export type DisplayOptions = "grid" | "table" | "chart";

export interface DisplayOptionsConfig<T = DisplayOptions> {
  label: string;
  value: T;
}
