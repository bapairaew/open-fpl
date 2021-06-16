import {
  Change,
  ChangePlayer,
} from "~/features/TransferPlanner/transferPlannerTypes";

export interface Preference {
  name?: string;
  transferPlannerPinnedBench?: boolean;
}

export interface Settings {
  isInitialised: boolean;
  profiles: string[];
  setProfiles: (profiles: string[]) => void;
  teamId: string | null;
  setTeamId: (id: string) => void;
  preference: Preference;
  setPreference: (preference: Preference) => void;
  transferPlan: Change<ChangePlayer>[];
  setTransferPlan: (changes: Change<ChangePlayer>[]) => void;
  isSettingsModalOpen: boolean;
  onSettingsModalOpen: () => void;
  onSettingsModalClsoe: () => void;
}
