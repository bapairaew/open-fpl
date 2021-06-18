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
  profiles: string[] | null | undefined;
  setProfiles: (profiles: string[] | null | undefined) => void;
  teamId: string | null | undefined;
  setTeamId: (id: string | null | undefined) => void;
  preference: Preference | null | undefined;
  setPreference: (preference: Preference | null | undefined) => void;
  transferPlan: Change<ChangePlayer>[] | null | undefined;
  setTransferPlan: (changes: Change<ChangePlayer>[]) => void;
  isSettingsModalOpen: boolean;
  onSettingsModalOpen: () => void;
  onSettingsModalClsoe: () => void;
}
