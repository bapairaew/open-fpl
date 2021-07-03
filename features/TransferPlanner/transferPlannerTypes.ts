import { Player } from "~/features/AppData/appDataTypes";
import { Invalid } from "~/features/Common/errorTypes";

export type ChangeType =
  | "swap"
  | "transfer"
  | "preseason"
  | "set-captain"
  | "set-vice-captain";

export interface ChangePlayer {
  id: number;
  pick: Pick;
}

export interface FullChangePlayer extends ChangePlayer, Player {
  isPlaceholder?: boolean;
}

export interface TeamChange<T extends ChangePlayer> extends Change {
  type: "swap" | "transfer";
  selectedPlayer: T;
  targetPlayer: T;
}

export interface CaptainChange<T extends ChangePlayer> extends Change {
  type: "set-captain" | "set-vice-captain";
  player: T;
}

export interface PreseasonChange<T extends ChangePlayer> extends Change {
  type: "preseason";
  team: T[];
}

export interface Change {
  id?: number;
  type: ChangeType;
  gameweek: number;
}

export interface InvalidChange extends Invalid {
  change: Change;
}

// Reduced set of ~/features/AppData/fplTypes > MyTeamPick
export interface Pick {
  element: number;
  position: number;
  now_cost: number;
  selling_price: number;
  purchase_price: number;
  multiplier: number;
  is_captain: boolean;
  is_vice_captain: boolean;
}

export interface GroupedTeam {
  GKP: FullChangePlayer[];
  DEF: FullChangePlayer[];
  MID: FullChangePlayer[];
  FWD: FullChangePlayer[];
  bench: FullChangePlayer[];
}
