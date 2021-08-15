import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";

export interface FixturePlayerStat {
  player: Player;
  stats: {
    picked: boolean;
    bps: number;
    goals_scored: number;
    assists: number;
    yellow_cards: number;
    red_cards: number;
    bonus: number;
    // rank: number;
    total_points: number;
    minutes: number;
  };
}
