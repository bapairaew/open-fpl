import { useDisclosure } from "@chakra-ui/hooks";
import useLocalStorage, {
  getLocalStorageItem,
} from "@open-fpl/app/features/Common/useLocalStorage";
import { CustomPlayer } from "@open-fpl/app/features/CustomPlayer/customPlayerTypes";
import { PlayerTableSortColumnConfig } from "@open-fpl/app/features/PlayerData/playerTableTypes";
import {
  DisplayOptions,
  SortOptions,
} from "@open-fpl/app/features/PlayersExplorer/playersExplorerTypes";
import { migrateFromWWWDomain } from "@open-fpl/app/features/Settings/migration";
import {
  Preference,
  Settings,
} from "@open-fpl/app/features/Settings/settingsTypes";
import {
  getActiveProfileKey,
  getCustomPlayersKey,
  getFixturesTeamsOrderKey,
  getPlayersExplorerDisplayOptionKey,
  getPlayersExplorerSortOptionKey,
  getPlayersExplorerTableSortColumnsKey,
  getPreferenceKey,
  getProfilesKey,
  getStarredPlayersKey,
  getTeamPlannerPinnedBenchKey,
  getTeamPlansKey,
  getTeamsStrengthKey,
} from "@open-fpl/app/features/Settings/storageKeys";
import { TeamStrength } from "@open-fpl/app/features/TeamData/teamDataTypes";
import dynamic from "next/dynamic";
import { createContext, ReactNode, useContext, useEffect } from "react";

const SettingsModal = dynamic(
  () => import("@open-fpl/app/features/Settings/SettingsModal")
);

const SettingsContext = createContext<Settings>({
  isInitialised: false,
  profiles: null,
  setProfiles: () => {},
  teamId: null,
  setTeamId: () => {},
  preference: null,
  setPreference: () => {},
  fixturesTeamsOrder: null,
  setFixturesTeamsOrder: () => {},
  customPlayers: null,
  setCustomPlayers: () => {},
  teamsStrength: null,
  setTeamsStrength: () => {},
  teamPlannerPinnedBench: null,
  setTeamPlannerPinnedBench: () => {},
  playersExplorerDisplayOption: null,
  setPlayersExplorerDisplayOption: () => {},
  playersExplorerSortOption: null,
  setPlayersExplorerSortOption: () => {},
  playersExplorerTableSortColumns: null,
  setPlayersExplorerTableSortColumns: () => {},
  isSettingsModalOpen: false,
  onSettingsModalOpen: () => {},
  onSettingsModalClose: () => {},
});

export const SettingsContextProvider = ({
  children,
  ...props
}: {
  children: ReactNode;
}) => {
  const [profiles, setProfiles, isInitialised] = useLocalStorage<string[]>(
    getProfilesKey()
  );
  const [teamId, setTeamId] = useLocalStorage<string>(getActiveProfileKey());
  const [_preference, setPreference] = useLocalStorage<Preference>(
    teamId && getPreferenceKey(teamId)
  );

  // NOTE: Team plans was saved outside of perference before 1.1.0-pre.1
  // This code is for migrating old data to perference storage
  // Consider removing this after some time
  const patchedData = {} as { teamPlans: string[]; starredPlayers: number[] };

  if (_preference && !_preference.teamPlans) {
    const teamPlans = teamId
      ? getLocalStorageItem<string[]>(getTeamPlansKey(teamId), null)
      : null;
    if (teamPlans) patchedData.teamPlans = teamPlans;
  }

  if (_preference && !_preference.starredPlayers) {
    const starredPlayers = teamId
      ? getLocalStorageItem<number[]>(
          teamId && getStarredPlayersKey(teamId),
          null
        )
      : null;
    if (starredPlayers) patchedData.starredPlayers = starredPlayers;
  }

  const preference = _preference
    ? {
        ..._preference,
        ...patchedData,
      }
    : null;

  const [fixturesTeamsOrder, setFixturesTeamsOrder] = useLocalStorage<string[]>(
    getFixturesTeamsOrderKey()
  );

  const [customPlayers, setCustomPlayers] = useLocalStorage<CustomPlayer[]>(
    getCustomPlayersKey()
  );

  const [teamsStrength, setTeamsStrength] = useLocalStorage<TeamStrength[]>(
    getTeamsStrengthKey()
  );

  const [teamPlannerPinnedBench, setTeamPlannerPinnedBench] =
    useLocalStorage<boolean>(getTeamPlannerPinnedBenchKey());

  const [playersExplorerDisplayOption, setPlayersExplorerDisplayOption] =
    useLocalStorage<DisplayOptions>(getPlayersExplorerDisplayOptionKey());
  const [playersExplorerSortOption, setPlayersExplorerSortOption] =
    useLocalStorage<SortOptions>(getPlayersExplorerSortOptionKey());
  const [playersExplorerTableSortColumns, setPlayersExplorerTableSortColumns] =
    useLocalStorage<PlayerTableSortColumnConfig[]>(
      getPlayersExplorerTableSortColumnsKey()
    );

  const {
    isOpen: isSettingsModalOpen,
    onOpen: onSettingsModalOpen,
    onClose: onSettingsModalClose,
  } = useDisclosure();

  useEffect(() => {
    if (!profiles) {
      migrateFromWWWDomain();
    }
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        isInitialised,
        profiles,
        setProfiles,
        teamId,
        setTeamId,
        preference,
        setPreference,
        fixturesTeamsOrder,
        setFixturesTeamsOrder,
        customPlayers,
        setCustomPlayers,
        teamsStrength,
        setTeamsStrength,
        teamPlannerPinnedBench,
        setTeamPlannerPinnedBench,
        playersExplorerDisplayOption,
        setPlayersExplorerDisplayOption,
        playersExplorerSortOption,
        setPlayersExplorerSortOption,
        playersExplorerTableSortColumns,
        setPlayersExplorerTableSortColumns,
        isSettingsModalOpen,
        onSettingsModalOpen,
        onSettingsModalClose,
      }}
      {...props}
    >
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={onSettingsModalClose}
      />
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
