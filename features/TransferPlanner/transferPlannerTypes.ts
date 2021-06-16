import { Player } from "~/features/AppData/appDataTypes";
import { Invalid } from "~/features/Common/errorTypes";

export type ChangeType = "swap" | "transfer";

export interface ChangePlayer {
  id: number;
  pick: Pick;
}

export interface FullChangePlayer extends ChangePlayer, Player {}

export interface Change<T extends ChangePlayer> {
  id?: number;
  type: ChangeType;
  selectedPlayer: T;
  targetPlayer: T;
  gameweek: number;
}

export interface InvalidChange<T extends ChangePlayer> extends Invalid {
  change: Change<T>;
}

// Recuded set of ~/features/AppData/fplTypes > MyTeamPick
export interface Pick {
  element: number;
  position: number;
  now_cost: number;
  selling_price: number;
  purchase_price: number;
}

export interface GroupedTeam {
  GKP: FullChangePlayer[];
  DEF: FullChangePlayer[];
  MID: FullChangePlayer[];
  FWD: FullChangePlayer[];
  bench: FullChangePlayer[];
}
