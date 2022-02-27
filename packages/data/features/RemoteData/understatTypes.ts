export type StatType =
  | "goals"
  | "xG"
  | "shots"
  | "assists"
  | "xA"
  | "key_passes"
  | "xGChain"
  | "xGBuildup";
export type Season = "2016" | "2017" | "2018" | "2019" | "2020" | "2021";
export type Position =
  | "GK"
  | "DR"
  | "DC"
  | "DL"
  | "DMR"
  | "DML"
  | "DMC"
  | "MR"
  | "MC"
  | "ML"
  | "AMR"
  | "AMC"
  | "AML"
  | "FWR"
  | "FW"
  | "FWL"
  | "Sub";
export type Situation =
  | "OpenPlay"
  | "SetPiece"
  | "FromCorner"
  | "DirectFreekick"
  | "Penalty";
export type ShotZone =
  | "ownGoals"
  | "shotOboxTotal"
  | "shotPenaltyArea"
  | "shotSixYardBox";
export type ShotTypes = "RightFoot" | "Head" | "LeftFoot";
export type MatchResult = "w" | "d" | "l";
export type MatchSide = "a" | "h";
export type Formation =
  | "4-2-3-1"
  | "3-4-3"
  | "4-3-3"
  | "3-4-2-1"
  | "4-4-2"
  | "4-4-1-1"
  | "4-1-2-1-2"
  | "5-4-1"; // TODO:
export type GameState =
  | "Goal diff 0"
  | "Goal diff -1"
  | "Goal diff +1"
  | "Goal diff > +1"
  | "Goal diff < -1";
export type Timing = "1-15" | "16-30" | "31-45" | "46-60" | "61-75" | "76+";
export type AttackSpeed = "Normal" | "Standard" | "Slow" | "Fast";
export type AttackResult =
  | "SavedShot"
  | "BlockedShot"
  | "MissedShots"
  | "ShotOnPost"
  | "Goal";

export interface BaseStat {
  season: string;
  goals: string;
  shots: string;
  xG: string;
  assists: string;
  key_passes: string;
  xA: string;
  npg: string;
  npxG: string;
}

export interface PositionStat extends BaseStat {
  position: Position;
  games: string;
  time: string;
  yellow: string;
  red: string;
  xGChain: string;
  xGBuildup: string;
}

export interface SeasonStat extends PositionStat {
  team: string;
}

export interface SituationStat extends BaseStat {
  situation: Situation;
}

export interface ShotZoneStat extends BaseStat {
  shotZones: string;
}

export interface ShotTypesStat extends BaseStat {
  shotTypes: string;
}

export interface MinMaxStat {
  min: number;
  max: number;
  avg: number;
}

export interface ShotData {
  id: string;
  minute: string;
  result: string;
  X: string;
  Y: string;
  xG: string;
  player: string;
  h_a: string;
  player_id: string;
  situation: Situation;
  season: Season;
  shotType: ShotTypes;
  match_id: string;
  h_team: string;
  a_team: string;
  h_goals: string;
  a_goals: string;
  date: string;
  player_assisted: string;
  lastAction: string;
}

export interface MatchData {
  goals: string;
  shots: string;
  xG: string;
  time: string;
  position: Position;
  h_team: string;
  a_team: string;
  h_goals: string;
  a_goals: string;
  date: string;
  id: string;
  season: Season;
  roster_id: string;
  xA: string;
  assists: string;
  key_passes: string;
  npg: string;
  npxG: string;
  xGChain: string;
  xGBuildup: string;
}

export interface PlayerStatSummary {
  assists: string;
  games: string;
  goals: string;
  id: string;
  key_passes: string;
  npg: string;
  npxG: string;
  player_name: string;
  position: Position;
  red_cards: string;
  shots: string;
  team_title: string;
  time: string;
  xA: string;
  xG: string;
  xGBuildup: string;
  xGChain: string;
  yellow_cards: string;
}

export interface GetUnderstatPlayersResponse {
  response: {
    success: boolean;
    players: PlayerStatSummary[];
  };
}

export interface PlayerStat {
  id: string;
  player_name: string;
  games: string;
  time: string;
  goals: string;
  xG: string;
  assists: string;
  xA: string;
  shots: string;
  key_passes: string;
  yellow_cards: string;
  red_cards: string;
  position: Position;
  team_title: string;
  npg: string;
  npxG: string;
  xGChain: string;
  xGBuildup: string;
  groupsData: {
    season: SeasonStat[];
    position: Record<Season, Record<Position, PositionStat>>;
    situation: Record<Season, Record<Situation, SituationStat>>;
    shotZones: Record<Season, Record<ShotZone, ShotZoneStat>>;
    shotTypes: Record<Season, Record<ShotTypes, ShotTypesStat>>;
  };
  minMaxPlayerStats: Record<Position, Record<StatType, MinMaxStat>>;
  shotsData: ShotData[];
  matchesData: MatchData[];
}

export interface PPDAStat {
  att: number;
  def: number;
}
export interface TeamHistoryStat {
  h_a: string;
  xG: number;
  xGA: number;
  npxG: number;
  npxGA: number;
  ppda: PPDAStat;
  ppda_allowed: PPDAStat;
  deep: number;
  deep_allowed: number;
  scored: number;
  missed: number;
  xpts: number;
  result: MatchResult;
  date: string;
  wins: number;
  draws: number;
  loses: number;
  pts: number;
  npxGD: number;
}

export interface TeamDatesData {
  id: string;
  title: string;
  short_title: string;
}
export interface HomeAwayDatesData {
  h: string;
  a: string;
}
export interface DatesData {
  id: string;
  isResult: true;
  side: MatchSide;
  h: TeamDatesData;
  a: TeamDatesData;
  goals: HomeAwayDatesData;
  xG: HomeAwayDatesData;
  datetime: string;
  forecast: {
    w: number;
    d: number;
    l: number;
  };
  result: MatchResult;
}

export interface BaseTeamStat {
  shots: number;
  goals: number;
  xG: number;
  against: {
    shots: number;
    goals: number;
    xG: number;
  };
}

export interface FormatationTeamStat extends BaseTeamStat {
  stat: Formation;
}
export interface GameStateTeamStat extends BaseTeamStat {
  stat: GameState;
}
export interface TimingTeamStat extends BaseTeamStat {
  stat: Timing;
}
export interface ShotZoneTeamStat extends BaseTeamStat {
  stat: ShotZone;
}
export interface AttackSpeedTeamStat extends BaseTeamStat {
  stat: AttackSpeed;
}

export interface TeamStat extends LeagueTeamStat, PageTeamStat {}

export interface PageTeamStat {
  datesData: DatesData[];
  statisticsData: {
    situation: Record<Situation, BaseTeamStat>;
    formation: Record<Formation, FormatationTeamStat>;
    gameState: Record<GameState, GameStateTeamStat>;
    timing: Record<Timing, TimingTeamStat>;
    shotZone: Record<ShotZone, ShotZoneTeamStat>;
    attackSpeed: Record<AttackSpeed, AttackSpeedTeamStat>;
    result: Record<AttackResult, BaseTeamStat>;
  }[];
  playersData: PlayerStatSummary[];
}

export interface LeagueTeamStat {
  id: string;
  title: string;
  history: TeamHistoryStat[];
}

export interface LeagueStat {
  datesData: DatesData[];
  playersData: PlayerStatSummary[];
  teamsData: Record<string, LeagueTeamStat>;
}
