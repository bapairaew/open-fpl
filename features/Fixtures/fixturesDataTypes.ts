import {
  ElementSummaryFixture,
  ElementSummaryUpcomingFixture,
} from "~/features/AppData/fplTypes";

export interface TeamFixtures {
  id: number;
  history: ElementSummaryFixture[];
  fixtures: ElementSummaryUpcomingFixture[];
}

export interface TeamInfo {
  name: string;
  short_name: string;
  strength_attack_home: number;
  strength_attack_away: number;
  strength_defence_home: number;
  strength_defence_away: number;
}

// For UI usage
export interface TeamFixture {
  is_finished: boolean;
  is_home: boolean;
  attack_difficulty: number;
  defence_difficulty: number;
  opponent: TeamInfo;
}

// For UI usage
export interface FullTeamFixtures extends TeamInfo {
  fixtures: TeamFixture[];
}
