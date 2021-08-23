export interface TeamMatchStat {
  id: string;
  opponent: number;
  g: number;
  xg: number;
  ga: number;
  xga: number;
  pts: number;
  xpts: number;
  result: "w" | "d" | "l";
}

export interface TeamStat {
  games: number;
  g: number;
  xg: number;
  ga: number;
  xga: number;
  pts: number;
  xpts: number;
  wins: number;
  draws: number;
  loses: number;
  position: number;
  xposition: number;
  matches: TeamMatchStat[];
}

export interface Team {
  id: number;
  name: string;
  short_name: string;
  strength_attack_home: number;
  strength_attack_away: number;
  strength_defence_home: number;
  strength_defence_away: number;
  form: string | null;
  stats: TeamStat | null;
}
