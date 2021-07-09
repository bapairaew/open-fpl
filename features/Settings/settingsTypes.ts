import { DisplayOptions } from "~/features/PlayersExplorer/playersExplorerTypes";

export interface Preference {
  name?: string;
  transferPlannerPinnedBench?: boolean;
  playersExplorerDisplayOption?: DisplayOptions;
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
  onSettingsModalOpen: () => void;
  onSettingsModalClsoe: () => void;
}
