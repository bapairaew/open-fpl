import { ClientPlayer } from "@open-fpl/app/features/PlayerData/playerDataTypes";
import {
  MatchStat,
  Player,
} from "@open-fpl/data/features/AppData/playerDataTypes";
import { ReactNode } from "react";

export interface PlayerTableConfig {
  header: string;
  columnWidth: number;
  hideHeader?: boolean;
  hideMenu?: boolean;
  sticky?: number;
  sortFn?: (a: Player, b: Player) => number;
  reversedSortFn?: (a: Player, b: Player) => number;
  render: ({
    player,
    pastMatches,
    config,
  }: {
    player: ClientPlayer;
    pastMatches: MatchStat[];
    config: PlayerTableConfig;
  }) => ReactNode;
}

export type PlayerTableSortChangeHandler = (
  columnName: string,
  direction: "asc" | "desc" | null
) => void;

export type PlayerTableSortColumnConfig = {
  columnName: string;
  direction: "asc" | "desc";
};
