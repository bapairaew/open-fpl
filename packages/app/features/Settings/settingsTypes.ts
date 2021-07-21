import { CustomPlayer } from "@open-fpl/app/features/CustomPlayer/customPlayerTypes";
import { PlayerTableSortColumnConfig } from "@open-fpl/app/features/PlayerData/playerTableTypes";
import {
  DisplayOptions,
  SortOptions,
} from "@open-fpl/app/features/PlayersExplorer/playersExplorerTypes";
import { TeamStrength } from "@open-fpl/app/features/TeamData/teamDataTypes";

export interface Preference {
  name?: string; // Profile name
}

export interface Settings {
  isInitialised: boolean; // If settings have been initialised from local storage
  profiles: string[] | null; // List of saved profiles team ID
  teamId: string | null; // Active profile
  isSettingsModalOpen: boolean;
  onSettingsModalOpen: () => void;
  onSettingsModalClsoe: () => void;
  preference: Preference | null; // Profile preference
  teamPlans: string[] | null; // List of active profile's team plans
  fixturesTeamsOrder: string[] | null; // Fixtures page row order
  starredPlayers: number[] | null; // List of starred players
  customPlayers: CustomPlayer[] | null; // List of custom players
  teamsStrength: TeamStrength[] | null; // Overridden teams strenth adjustment
  teamPlannerPinnedBench: boolean | null; // If team planner's bench section always visible
  playersExplorerDisplayOption: DisplayOptions | null; // Display options for players explorer
  playersExplorerSortOption: SortOptions | null; // Sort options for players explorer
  playersExplorerTableSortColumns: PlayerTableSortColumnConfig[] | null; // Sort columns for table view players explorer
  setTeamId: (id: string | null) => void;
  setProfiles: (profiles: string[] | null) => void;
  setPreference: (preference: Preference | null) => void;
  setTeamPlans: (plans: string[] | null) => void;
  setFixturesTeamsOrder: (order: string[] | null) => void;
  setStarredPlayers: (ids: number[] | null) => void;
  setCustomPlayers: (ids: CustomPlayer[] | null) => void;
  setTeamsStrength: (teamsStrength: TeamStrength[] | null) => void;
  setTeamPlannerPinnedBench: (pinned: boolean | null) => void;
  setPlayersExplorerDisplayOption: (
    displayOption: DisplayOptions | null
  ) => void;
  setPlayersExplorerSortOption: (sortOption: SortOptions | null) => void;
  setPlayersExplorerTableSortColumns: (
    sortColumns: PlayerTableSortColumnConfig[] | null
  ) => void;
}
