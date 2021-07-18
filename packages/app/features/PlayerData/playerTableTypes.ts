import { ComponentType } from "react";
import { ListChildComponentProps } from "react-window";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";

export type PlayerTableColumn =
  | "Tool"
  | "Name"
  | "Team"
  | "Position"
  | "Cost"
  | "Ownership"
  | "Fixtures"
  | "Points"
  | "Goals"
  | "Assists"
  | "Shots"
  | "Key passes"
  | "xG"
  | "xA"
  | "xGA";

export interface PlayerTableConfig {
  columnWidth: number;
  hideHeader?: boolean;
  hideMenu?: boolean;
  sticky?: number;
  sortFn?: (a: Player, b: Player) => number;
  reversedSortFn?: (a: Player, b: Player) => number;
}

export type PlayerTableSortChangeHandler = (
  columnName: PlayerTableColumn,
  direction: "asc" | "desc" | null
) => void;

export type PlayerTableSortColumnConfig = {
  columnName: PlayerTableColumn;
  direction: "asc" | "desc";
};

export type PlayerTableContextType = {
  sortColumns?: PlayerTableSortColumnConfig[];
  onSortChange?: PlayerTableSortChangeHandler;
  ItemRenderer?: ComponentType<ListChildComponentProps<PlayerTableContextType>>;
};
