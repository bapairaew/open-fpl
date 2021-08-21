import { ClientPlayer } from "@open-fpl/app/features/PlayerData/playerDataTypes";
import { Team } from "@open-fpl/data/features/AppData/teamDataTypes";

export interface GameweekPlayerStat {
  player: ClientPlayer;
  picked: boolean;
  multiplier: number;
  live: boolean;
  stats: {
    bps: number;
    goals_scored: number;
    assists: number;
    yellow_cards: number;
    red_cards: number;
    bonus: number;
    total_points: number;
    minutes: number;
  } | null;
  fixtures: FixturePlayerStat[];
}

export interface FixturePlayerStat {
  player: ClientPlayer;
  picked: boolean;
  multiplier: number;
  live: boolean;
  opponent: Team;
  fixture: DashboardFixture;
  stats: {
    bps: number;
    goals_scored: number;
    assists: number;
    yellow_cards: number;
    red_cards: number;
    bonus: number;
    total_points: number;
    minutes: number;
  } | null;
}

export interface DashboardFixture {
  event: number;
  finished: boolean;
  finished_provisional: boolean;
  id: number;
  kickoff_time: string;
  minutes: number;
  started: boolean;
  team_a: Team | null;
  team_a_score: number | null;
  team_h: Team | null;
  team_h_score: number | null;
  team_a_players: FixturePlayerStat[];
  team_h_players: FixturePlayerStat[];
  live: boolean;
  // calculated: boolean;
}

export interface RemoteDashboardFixture {
  event: number;
  finished: boolean;
  finished_provisional: boolean;
  id: number;
  kickoff_time: string;
  minutes: number;
  started: boolean;
  team_a: number;
  team_a_score: number | null;
  team_h: number;
  team_h_score: number | null;
  stats: RemoteFixturePlayerStats[] | null;
  // calculated: boolean;
}

export interface RemoteFixturePlayerStats {
  id: number;
  stats: {
    bps: number;
    goals_scored: number;
    assists: number;
    yellow_cards: number;
    red_cards: number;
    bonus: number;
    total_points: number;
    minutes: number;
  } | null;
}
