import { TeamInfo } from "@open-fpl/app/features/TeamData/teamDataTypes";

export interface TeamFixture {
  id: number;
  event: number;
  is_finished: boolean;
  is_home: boolean;
  attack_difficulty: number;
  defence_difficulty: number;
  opponent: TeamInfo;
}

export interface FullTeamFixtures extends TeamInfo {
  gameweeks: TeamFixture[][];
}

export interface SortableFullTeamFixtures extends FullTeamFixtures {
  id: string;
}
