import { Change } from "~/features/TransferPlanner/transferPlannerTypes";

export interface Preference {
  name?: string;
  transferPlannerPinnedBench?: boolean;
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
  onSettingsModalOpen: () => void;
  onSettingsModalClsoe: () => void;
}
