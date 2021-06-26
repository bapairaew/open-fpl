import {
  ElementSummaryFixture,
  ElementSummaryUpcomingFixture,
} from "~/features/AppData/fplTypes";

export interface TeamFixtures {
  id: number;
  history: ElementSummaryFixture[];
  fixtures: ElementSummaryUpcomingFixture[];
}

// For UI usage
export interface TeamFixture {
  is_finished: boolean;
  opponent_short_name: string;
  is_home: boolean;
  attack_difficulty: number | null;
  defence_difficulty: number | null;
}

export interface FullTeamFixtures {
  short_name: string;
  fixtures: TeamFixture[];
}
