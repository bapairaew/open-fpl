import { TeamInfo } from "@open-fpl/app/features/TeamData/teamDataTypes";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";

export interface ClientPlayerTeamFixture {
  event: number;
  is_finished: boolean;
  is_home: boolean;
  difficulty: number;
  opponent: TeamInfo;
}

// To be filled out at client level
export interface ClientData {
  starred_index: number;
  is_custom_player: boolean;
  gameweeks: ClientPlayerTeamFixture[][] | null;
}

export interface ClientPlayer extends Player {
  client_data: ClientData;
}
