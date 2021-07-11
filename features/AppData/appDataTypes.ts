import {
  Element,
  ElementStatus,
  ElementSummary,
} from "~/features/AppData/fplTypes";
import { TeamColorCodes } from "~/features/AppData/teamcolorcodesTypes";

// Reduced set and remapped data from different sources used in the app

export interface FPLElement extends Element, ElementSummary {}

export interface MatchStat {
  opponent_short_title: string | null;
  is_home: boolean;
  match_time: number | null;
  match_g: number | null;
  match_a: number | null;
  match_shots: number | null;
  match_key_passes: number | null;
  match_xg: number | null;
  match_xa: number | null;
  match_xgi: number | null;
  match_xga: number | null;
}

export interface PastGameweek {
  opponent_team_short_name: string;
  was_home: boolean;
  kickoff_time: string;
  total_points: number;
  bps: number;
  minutes: number;
}

export interface UpcomingGameweek {
  opponent_team_short_name: string;
  is_home: boolean;
  event: number;
  finished: boolean;
  difficulty: number;
}

export interface LinkedData {
  transfers_delta_event: number;
  understat_id: string | null;
  season_time: number | null;
  season_game: number | null;
  season_g: number | null;
  season_a: number | null;
  season_shots: number | null;
  season_key_passes: number | null;
  season_xg: number | null;
  season_xa: number | null;
  season_xgi: number | null;
  season_xga: number | null;
  teamcolorcodes: TeamColorCodes | null;
  past_matches: MatchStat[] | null;
  previous_gameweeks: PastGameweek[] | null;
  next_gameweeks: UpcomingGameweek[] | null;
}

// To be filled out at client level
export interface ClientData {
  starred_index: number;
}

export interface Player {
  id: number;
  first_name: string;
  second_name: string;
  web_name: string;
  news: string;
  status: ElementStatus;
  now_cost: number;
  cost_change_start: number;
  photo: string;
  chance_of_playing_next_round: number | null;
  chance_of_playing_this_round: number | null;
  total_points: number;
  transfers_in_event: number;
  transfers_out_event: number;
  selected_by_percent: string;
  element_type: {
    singular_name_short: string;
  };
  team: {
    id: number;
    short_name: string;
  };
  linked_data: LinkedData;
  client_data: ClientData;
}

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
