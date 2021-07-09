import { useDisclosure } from "@chakra-ui/hooks";
import dynamic from "next/dynamic";
import { createContext, ReactNode, useContext } from "react";
import useLocalStorage from "~/features/Common/useLocalStorage";
import { Preference, Settings } from "~/features/Settings/settingsTypes";
import {
  getActiveProfileKey,
  getFixturesTeamsOrderKey,
  getStarredPlayersKey,
  getPreferenceKey,
  getProfilesKey,
  getTransferPlansKey,
} from "~/features/Settings/storageKeys";

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
  fixturesTeamsOrder: [],
  setFixturesTeamsOrder: () => {},
  transferPlans: ["Plan 1"],
  setTransferPlans: () => {},
  starredPlayers: [],
  setStarredPlayers: () => {},
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
    string[] | null
  >(getProfilesKey(), []);

  const [teamId, setTeamId] = useLocalStorage<string | null>(
    getActiveProfileKey(),
    null
  );

  const [preference, setPreference] = useLocalStorage<Preference | null>(
    getPreferenceKey(teamId),
    {}
  );

  const [transferPlans, setTransferPlans] = useLocalStorage<string[] | null>(
    getTransferPlansKey(teamId),
    ["Plan 1"]
  );

  const [fixturesTeamsOrder, setFixturesTeamsOrder] = useLocalStorage<
    string[] | null
  >(getFixturesTeamsOrderKey(), null);

  const [starredPlayers, setStarredPlayers] = useLocalStorage<number[] | null>(
    getStarredPlayersKey(teamId),
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
        transferPlans,
        setProfiles,
        setTeamId,
        setPreference,
        setTransferPlans,
        fixturesTeamsOrder,
        setFixturesTeamsOrder,
        starredPlayers,
        setStarredPlayers,
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
