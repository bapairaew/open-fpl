import { CustomPlayer } from "@open-fpl/app/features/CustomPlayer/customPlayerTypes";
import { PlayerTableSortColumnConfig } from "@open-fpl/app/features/PlayerData/playerTableTypes";
import {
  DisplayOptions,
  SortOptions,
} from "@open-fpl/app/features/PlayersExplorer/playersExplorerTypes";
import { TeamStrength } from "@open-fpl/app/features/TeamData/teamDataTypes";

export interface Preference {
  name?: string; // Profile name
  teamPlans?: string[]; // List of profile's team plans
  starredPlayers?: number[]; // List of starred players
  selectedPlan?: number; // Selected team plan
  selectedDashboardTab?: number; // Selected dashboard tab
}

export interface Settings {
  isInitialised: boolean; // If settings have been initialised from local storage
  profiles: string[] | null; // List of saved profiles team ID
  profile: string | null; // Active profile
  isSettingsModalOpen: boolean;
  onSettingsModalOpen: () => void;
  onSettingsModalClose: () => void;
  preference: Preference | null; // Profile preference
  fixturesTeamsOrder: string[] | null; // Fixtures page row order
  customPlayers: CustomPlayer[] | null; // List of custom players
  teamsStrength: TeamStrength[] | null; // Overridden teams strenth adjustment
  teamPlannerPinnedBench: boolean | null; // If team planner's bench section always visible
  playersExplorerDisplayOption: DisplayOptions | null; // Display options for players explorer
  playersExplorerSortOption: SortOptions | null; // Sort options for players explorer
  playersExplorerTableSortColumns: PlayerTableSortColumnConfig[] | null; // Sort columns for table view players explorer
  setProfile: (id: string | null) => void;
  setProfiles: (profiles: string[] | null) => void;
  setPreference: (preference: Preference | null) => void;
  setFixturesTeamsOrder: (order: string[] | null) => void;
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
