import { Invalid } from "@open-fpl/app/features/Common/errorTypes";
import { ClientPlayer } from "@open-fpl/app/features/PlayerData/playerDataTypes";
import { ChipName } from "@open-fpl/data/features/RemoteData/fplTypes";

export type ChangeType =
  | "swap"
  | "transfer"
  | "preseason"
  | "set-captain"
  | "set-vice-captain"
  | "use-chip";

export interface ChangePlayer {
  id: number;
  pick: Pick;
}

export interface FullChangePlayer extends ChangePlayer, ClientPlayer {
  isPlaceholder?: boolean;
}

export interface SinglePlayerChange<T extends ChangePlayer> extends Change {
  type: "set-captain" | "set-vice-captain";
  player: T;
}

export interface TwoPlayersChange<T extends ChangePlayer> extends Change {
  type: "swap" | "transfer";
  selectedPlayer: T;
  targetPlayer: T;
}

export interface TeamChange<T extends ChangePlayer> extends Change {
  type: "preseason";
  team: T[];
}

export interface ChipChange extends Change {
  type: "use-chip";
  chip: ChipName;
}

export interface Change {
  id?: number;
  type: ChangeType;
  gameweek: number;
}

export interface InvalidChange extends Invalid {
  change: Change;
}

export interface ChipUsage {
  name: ChipName;
  isActive: boolean;
  isUsed: boolean;
}

// Reduced set of @open-fpl/data/features/AppData/fplTypes > MyTeamPick
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

export interface GameweekData {
  team: FullChangePlayer[];
  chipUsages: ChipUsage[];
  bank: number;
  invalidChanges: InvalidChange[];
  teamInvalidities: Invalid[];
  gameweek: number;
  hits: number;
  freeTransfers: number;
}
