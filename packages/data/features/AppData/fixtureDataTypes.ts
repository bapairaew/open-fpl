export interface TeamFixture {
  opponent_team: number;
  event: number;
  is_home: boolean;
  finished: boolean;
  team_h_score: number | null;
  team_a_score: number | null;
}

export interface TeamFixtures {
  id: number;
  fixtures: TeamFixture[];
}
