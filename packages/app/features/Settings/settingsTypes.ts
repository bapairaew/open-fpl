import { CustomPlayer } from "@open-fpl/app/features/CustomPlayer/customPlayerTypes";
import { PlayerTableSortColumnConfig } from "@open-fpl/app/features/PlayerData/playerTableTypes";
import {
  DisplayOptions,
  SortOptions,
} from "@open-fpl/app/features/PlayersExplorer/playersExplorerTypes";
import { TeamStrength } from "@open-fpl/app/features/TeamData/teamDataTypes";

export interface Preference {
  name?: string;
  transferPlannerPinnedBench?: boolean;
  playersExplorerDisplayOption?: DisplayOptions;
  playersExplorerSortOption?: SortOptions;
  playersExplorerTableSortColumns?: PlayerTableSortColumnConfig[];
}

export interface Settings {
  isInitialised: boolean;
  profiles: string[] | null;
  setProfiles: (profiles: string[] | null) => void;
  teamId: string | null;
  setTeamId: (id: string | null) => void;
  preference: Preference | null;
  setPreference: (preference: Preference | null) => void;
  fixturesTeamsOrder: string[] | null;
  setFixturesTeamsOrder: (order: string[] | null) => void;
  isSettingsModalOpen: boolean;
  transferPlans: string[] | null;
  setTransferPlans: (plans: string[] | null) => void;
  starredPlayers: number[] | null;
  setStarredPlayers: (ids: number[] | null) => void;
  customPlayers: CustomPlayer[] | null;
  setCustomPlayers: (ids: CustomPlayer[] | null) => void;
  teamsStrength: TeamStrength[] | null;
  setTeamsStrength: (teamsStrength: TeamStrength[] | null) => void;
  onSettingsModalOpen: () => void;
  onSettingsModalClsoe: () => void;
}
