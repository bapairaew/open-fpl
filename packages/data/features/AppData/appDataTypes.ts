import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";

export interface Gameweek {
  id: number;
  deadline_time: string;
  is_previous: boolean;
  is_current: boolean;
  is_next: boolean;
}

export interface TeamFixture {
  opponent_team: number;
  event: number;
  is_home: boolean;
}

export interface TeamFixtures {
  id: number;
  fixtures: TeamFixture[];
}

export interface AppData {
  players: Player[];
  fixtures: TeamFixtures[];
}
