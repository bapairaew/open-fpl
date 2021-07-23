export interface TeamStrength {
  id: number;
  strength_attack_home?: number;
  strength_defence_home?: number;
  strength_attack_away?: number;
  strength_defence_away?: number;
}

export interface TeamInfo {
  name: string;
  short_name: string;
  strength_attack_home: number;
  strength_attack_away: number;
  strength_defence_home: number;
  strength_defence_away: number;
}
