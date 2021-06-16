import { useDisclosure } from "@chakra-ui/hooks";
import { createContext, useContext } from "react";
import SettingsModal from "~/features/Settings/SettingsModal";
import {
  getActiveProfileKey,
  getProfilesKey,
  getPreferenceKey,
  getTransferPlanKey,
} from "~/features/Settings/storageKeys";
import useLocalStorage from "~/features/Common/useLocalStorage";
import { Settings } from "~/features/Settings/settingsTypes";

const SettingsContext = createContext<Settings>({
  isInitialised: false,
  profiles: [],
  setProfiles: () => {},
  teamId: null,
  setTeamId: () => {},
  preference: { transferPlannerPinnedBench: false },
  setPreference: () => {},
  transferPlan: [],
  setTransferPlan: () => {},
  isSettingsModalOpen: false,
  onSettingsModalOpen: () => {},
  onSettingsModalClsoe: () => {},
});

export const SettingsContextProvider = ({ children, ...props }) => {
  const [profiles, setProfiles, isInitialised] = useLocalStorage(
    getProfilesKey(),
    []
  );
  const [teamId, setTeamId] = useLocalStorage(getActiveProfileKey(), null);
  const [preference, setPreference] = useLocalStorage(
    getPreferenceKey(teamId),
    {}
  );
  const [transferPlan, setTransferPlan] = useLocalStorage(
    getTransferPlanKey(teamId),
    []
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <SettingsContext.Provider
      value={{
        isInitialised,
        profiles,
        teamId,
        preference,
        transferPlan,
        setProfiles,
        setTeamId,
        setPreference,
        setTransferPlan,
        isSettingsModalOpen: isOpen,
        onSettingsModalOpen: onOpen,
        onSettingsModalClsoe: onClose,
      }}
      {...props}
    >
      <SettingsModal isOpen={isOpen} onClose={onClose} />
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
