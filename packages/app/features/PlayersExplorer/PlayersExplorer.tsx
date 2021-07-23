import { BoxProps, Flex, useDisclosure } from "@chakra-ui/react";
import {
  adjustTeamsStrength,
  makeFullFixtures,
} from "@open-fpl/app/features/Fixtures/fixturesData";
import { hydrateClientData } from "@open-fpl/app/features/PlayerData/playerData";
import { ClientPlayer } from "@open-fpl/app/features/PlayerData/playerDataTypes";
import ComparePlayersModal from "@open-fpl/app/features/PlayersExplorer/ComparePlayersModal";
import PlayersExplorerGridOrChart from "@open-fpl/app/features/PlayersExplorer/PlayersExplorerGridOrChart";
import PlayersExplorerTable from "@open-fpl/app/features/PlayersExplorer/PlayersExplorerTable";
import PlayersExplorerToolbar from "@open-fpl/app/features/PlayersExplorer/PlayersExplorerToolbar";
import { DisplayOptions } from "@open-fpl/app/features/PlayersExplorer/playersExplorerTypes";
import { displayOptions } from "@open-fpl/app/features/PlayersExplorer/playersToolbarOptions";
import { useSettings } from "@open-fpl/app/features/Settings/SettingsContext";
import {
  Gameweek,
  TeamFixtures,
} from "@open-fpl/data/features/AppData/appDataTypes";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import { Team } from "@open-fpl/data/features/RemoteData/fplTypes";
import { ChangeEvent, MouseEvent, useMemo, useState } from "react";

const PlayersExplorer = ({
  players: remotePlayers,
  fplTeams,
  teamFixtures,
  ...props
}: BoxProps & {
  players: Player[];
  fplTeams: Team[];
  teamFixtures: TeamFixtures[];
}) => {
  const {
    playersExplorerDisplayOption,
    setPlayersExplorerDisplayOption,
    preference,
    setPreference,
    teamsStrength,
  } = useSettings();

  const fullFixtures = useMemo(
    () =>
      makeFullFixtures({
        teamFixtures,
        fplTeams: adjustTeamsStrength(fplTeams, teamsStrength),
      }),
    [fplTeams, teamsStrength]
  );

  const players = useMemo(
    () =>
      hydrateClientData(
        remotePlayers,
        preference?.starredPlayers || ([] as number[]),
        [],
        fullFixtures
      ),
    [remotePlayers, preference?.starredPlayers, fullFixtures]
  );

  const [displayedPlayers, setDisplayedPlayers] = useState(players);
  const [selectedPlayers, setSelectedPlayers] = useState<ClientPlayer[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDisplayChange = (option: DisplayOptions) => {
    setPlayersExplorerDisplayOption(option);
  };

  const display = playersExplorerDisplayOption ?? displayOptions[0].value;

  const handleStarClick = (
    e: MouseEvent<HTMLButtonElement>,
    player: ClientPlayer
  ) => {
    if (preference) {
      if (preference?.starredPlayers?.some((p) => p === player.id)) {
        setPreference({
          ...preference,
          starredPlayers:
            preference.starredPlayers?.filter((p) => p !== player.id) ?? [],
        });
      } else {
        setPreference({
          ...preference,
          starredPlayers: [...(preference?.starredPlayers ?? []), player.id],
        });
      }
    }
  };

  const handleSelectChange = (
    e: ChangeEvent<HTMLInputElement>,
    player: ClientPlayer
  ) => {
    if (e.target.checked) {
      if (!selectedPlayers.some((p) => p.id === player.id)) {
        setSelectedPlayers([...selectedPlayers, player]);
      }
    } else {
      setSelectedPlayers(selectedPlayers.filter((p) => p.id !== player.id));
    }
  };

  const handleResetClick = () => setSelectedPlayers([]);

  return (
    <>
      <ComparePlayersModal
        isOpen={isOpen}
        onClose={onClose}
        players={selectedPlayers}
      />
      <Flex direction="column" overflow="hidden" height="100%" {...props}>
        <PlayersExplorerToolbar
          borderBottomWidth={1}
          players={players}
          onResults={setDisplayedPlayers}
          display={display}
          onDisplayChange={handleDisplayChange}
          showCompareButton={selectedPlayers.length > 0}
          onCompareClick={onOpen}
          onResetClick={handleResetClick}
          disabledSorting={display === "table"}
          sortingTooltipLabel={
            display === "table"
              ? "The data is sorted by the table's header row"
              : undefined
          }
        />
        {display === "table" ? (
          <PlayersExplorerTable
            displayedPlayers={displayedPlayers}
            selectedPlayers={selectedPlayers}
            onSelectChange={handleSelectChange}
            onStarClick={handleStarClick}
          />
        ) : (
          <PlayersExplorerGridOrChart
            displayedPlayers={displayedPlayers}
            display={display}
            selectedPlayers={selectedPlayers}
            onSelectChange={handleSelectChange}
            onStarClick={handleStarClick}
          />
        )}
      </Flex>
    </>
  );
};

export default PlayersExplorer;
