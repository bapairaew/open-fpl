import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import { TeamFixtures } from "@open-fpl/data/features/AppData/fixtureDataTypes";
import { Team } from "@open-fpl/data/features/AppData/teamDataTypes";

export interface AppData {
  players: Player[];
  fixtures: TeamFixtures[];
  teams: Team[];
}
