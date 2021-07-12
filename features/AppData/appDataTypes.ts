import { Player } from "~/features/PlayerData/playerDataTypes";

export interface Gameweek {
  id: number;
  deadline_time: string;
  is_previous: boolean;
  is_current: boolean;
  is_next: boolean;
}

export interface AppData {
  players: Player[];
  gameweeks: Gameweek[];
}
