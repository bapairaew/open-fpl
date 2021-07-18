import { useDisclosure } from "@chakra-ui/hooks";
import dynamic from "next/dynamic";
import { createContext, ReactNode, useContext } from "react";
import useLocalStorage from "@open-fpl/app/features/Common/useLocalStorage";
import { CustomPlayer } from "@open-fpl/app/features/CustomPlayer/customPlayerTypes";
import {
  Preference,
  Settings,
} from "@open-fpl/app/features/Settings/settingsTypes";
import {
  getActiveProfileKey,
  getCustomPlayersKey,
  getFixturesTeamsOrderKey,
  getPreferenceKey,
  getProfilesKey,
  getStarredPlayersKey,
  getTeamPlansKey,
  getTeamsStrengthKey,
} from "@open-fpl/app/features/Settings/storageKeys";
import { TeamStrength } from "@open-fpl/app/features/TeamData/teamDataTypes";

const SettingsModal = dynamic(
  () => import("@open-fpl/app/features/Settings/SettingsModal")
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
  customPlayers: [],
  setCustomPlayers: () => {},
  teamsStrength: [],
  setTeamsStrength: () => {},
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
    getTeamPlansKey(teamId),
    ["Plan 1"]
  );

  const [fixturesTeamsOrder, setFixturesTeamsOrder] = useLocalStorage<
    string[] | null
  >(getFixturesTeamsOrderKey(), null);

  const [starredPlayers, setStarredPlayers] = useLocalStorage<number[] | null>(
    getStarredPlayersKey(teamId),
    []
  );

  const [customPlayers, setCustomPlayers] = useLocalStorage<
    CustomPlayer[] | null
  >(getCustomPlayersKey(), []);

  const [teamsStrength, setTeamsStrength] = useLocalStorage<
    TeamStrength[] | null
  >(getTeamsStrengthKey(), []);

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
        customPlayers,
        setCustomPlayers,
        teamsStrength,
        setTeamsStrength,
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
