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
  finished: boolean;
  team_h_score?: number;
  team_a_score?: number;
}

export interface TeamFixtures {
  id: number;
  fixtures: TeamFixture[];
}

export interface AppData {
  players: Player[];
  fixtures: TeamFixtures[];
}
