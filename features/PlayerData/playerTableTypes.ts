import { ComponentType, MouseEvent } from "react";
import { ListChildComponentProps } from "react-window";
import { Player } from "~/features/AppData/appDataTypes";

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
  sticky?: boolean;
  sortFn?: (a: Player, b: Player) => number;
}

export type PlayerTableSortClickType = (
  e: MouseEvent<HTMLButtonElement>,
  columnName: PlayerTableColumn,
  direction: "asc" | "desc" | null
) => void;

export type PlayerTableSortColumnConfig = {
  columnName: PlayerTableColumn;
  direction: "asc" | "desc";
};

export type PlayerTableContextType = {
  sortColumns?: PlayerTableSortColumnConfig[];
  onSortClick?: PlayerTableSortClickType;
  ItemRenderer?: ComponentType<ListChildComponentProps<PlayerTableContextType>>;
};
