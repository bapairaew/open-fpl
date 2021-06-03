import { useDisclosure } from "@chakra-ui/hooks";
import { createContext, useContext } from "react";
import SettingsModal from "~/components/Settings/SettingsModal";
import {
  getActiveProfileKey,
  getProfilesKey,
  getSettingsKey,
  getTransferPlanKey,
} from "~/components/Settings/storage";
import useLocalStorage from "~/libs/useLocalStorage";

const SettingsContext = createContext({
  isInitialised: false,
  profiles: [],
  setProfiles: () => {},
  teamId: null,
  setTeamId: () => {},
  settings: { transferPlannerPinnedBench: false },
  setSettings: () => {},
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
  const [settings, setSettings] = useLocalStorage(getSettingsKey(teamId), {
    transferPlannerPinnedBench: false,
  });
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
        settings,
        transferPlan,
        setProfiles,
        setTeamId,
        setSettings,
        setTransferPlan,
        isSettingsModelOpen: isOpen,
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
