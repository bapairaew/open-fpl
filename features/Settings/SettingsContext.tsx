import { useDisclosure } from "@chakra-ui/hooks";
import dynamic from "next/dynamic";
import { createContext, ReactNode, useContext } from "react";
import useLocalStorage from "~/features/Common/useLocalStorage";
import { Preference, Settings } from "~/features/Settings/settingsTypes";
import {
  getActiveProfileKey,
  getFixturesTeamsOrderKey,
  getPreferenceKey,
  getProfilesKey,
  getTransferPlanKey,
} from "~/features/Settings/storageKeys";
import { Change } from "~/features/TransferPlanner/transferPlannerTypes";

const SettingsModal = dynamic(
  () => import("~/features/Settings/SettingsModal")
);

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
  fixturesTeamsOrder: [],
  setFixturesTeamsOrder: () => {},
  isSettingsModalOpen: false,
  onSettingsModalOpen: () => {},
  onSettingsModalClsoe: () => {},
});

export const SettingsContextProvider = ({
  children,
  ...props
}: {
  children: ReactNode;
}) => {
  const [profiles, setProfiles, isInitialised] = useLocalStorage<
    string[] | null | undefined
  >(getProfilesKey(), []);

  const [teamId, setTeamId] = useLocalStorage<string | null | undefined>(
    getActiveProfileKey(),
    null
  );

  const [preference, setPreference] = useLocalStorage<
    Preference | null | undefined
  >(getPreferenceKey(teamId), {});

  const [transferPlan, setTransferPlan] = useLocalStorage<
    Change[] | null | undefined
  >(getTransferPlanKey(teamId), []);

  const [fixturesTeamsOrder, setFixturesTeamsOrder] = useLocalStorage<
    string[] | null | undefined
  >(getFixturesTeamsOrderKey(), null);

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
        fixturesTeamsOrder,
        setFixturesTeamsOrder,
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
