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
import { createContext, ReactNode, useContext } from "react";

const SettingsModal = dynamic(
  () => import("@open-fpl/app/features/Settings/SettingsModal")
);

const SettingsContext = createContext<Settings>({
  isInitialised: false,
  profiles: [],
  setProfiles: () => {},
  teamId: null,
  setTeamId: () => {},
  preference: {},
  setPreference: () => {},
  fixturesTeamsOrder: [],
  setFixturesTeamsOrder: () => {},
  customPlayers: [],
  setCustomPlayers: () => {},
  teamsStrength: [],
  setTeamsStrength: () => {},
  teamPlannerPinnedBench: false,
  setTeamPlannerPinnedBench: () => {},
  playersExplorerDisplayOption: "table",
  setPlayersExplorerDisplayOption: () => {},
  playersExplorerSortOption: "starred",
  setPlayersExplorerSortOption: () => {},
  playersExplorerTableSortColumns: [],
  setPlayersExplorerTableSortColumns: () => {},
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

  const [_preference, setPreference] = useLocalStorage<Preference | null>(
    getPreferenceKey(teamId),
    {}
  );

  // NOTE: Team plans was saved outside of perference before 1.1.0-pre.1
  // This code is for migrating old data to perference storage
  // Consider removing this after some time
  const patchedData = {} as { teamPlans: string[]; starredPlayers: number[] };

  if (_preference && !_preference.teamPlans) {
    patchedData.teamPlans = getLocalStorageItem<string[]>(
      getTeamPlansKey(teamId),
      ["Plan 1"]
    ) ?? ["Plan 1"];
  }

  if (_preference && !_preference.starredPlayers) {
    patchedData.starredPlayers =
      getLocalStorageItem<number[]>(getStarredPlayersKey(teamId), []) ?? [];
  }

  const preference =
    _preference && !_preference.teamPlans
      ? {
          ..._preference,
          ...patchedData,
        }
      : _preference;

  const [fixturesTeamsOrder, setFixturesTeamsOrder] = useLocalStorage<
    string[] | null
  >(getFixturesTeamsOrderKey(), null);

  const [customPlayers, setCustomPlayers] = useLocalStorage<
    CustomPlayer[] | null
  >(getCustomPlayersKey(), []);

  const [teamsStrength, setTeamsStrength] = useLocalStorage<
    TeamStrength[] | null
  >(getTeamsStrengthKey(), []);

  const [teamPlannerPinnedBench, setTeamPlannerPinnedBench] = useLocalStorage<
    boolean | null
  >(getTeamPlannerPinnedBenchKey(), false);

  const [playersExplorerDisplayOption, setPlayersExplorerDisplayOption] =
    useLocalStorage<DisplayOptions | null>(
      getPlayersExplorerDisplayOptionKey(),
      "table"
    );
  const [playersExplorerSortOption, setPlayersExplorerSortOption] =
    useLocalStorage<SortOptions | null>(
      getPlayersExplorerSortOptionKey(),
      "starred"
    );
  const [playersExplorerTableSortColumns, setPlayersExplorerTableSortColumns] =
    useLocalStorage<PlayerTableSortColumnConfig[] | null>(
      getPlayersExplorerTableSortColumnsKey(),
      []
    );

  const { isOpen, onOpen, onClose } = useDisclosure();

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
