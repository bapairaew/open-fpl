import { BoxProps, Flex, useDisclosure } from "@chakra-ui/react";
import {
  adjustTeamsStrength,
  makeFullFixtures,
} from "@open-fpl/app/features/Fixtures/fixturesData";
import { hydrateClientData } from "@open-fpl/app/features/PlayerData/playerData";
import { ClientPlayer } from "@open-fpl/app/features/PlayerData/playerDataTypes";
import PlayersExplorerToolbar from "@open-fpl/app/features/PlayersExplorer/PlayersExplorerToolbar";
import { DisplayOptions } from "@open-fpl/app/features/PlayersExplorer/playersExplorerTypes";
import { displayOptions } from "@open-fpl/app/features/PlayersExplorer/playersToolbarOptions";
import { useSettings } from "@open-fpl/app/features/Settings/Settings";
import { TeamFixtures } from "@open-fpl/data/features/AppData/fixtureDataTypes";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import { Team } from "@open-fpl/data/features/AppData/teamDataTypes";
import { usePlausible } from "next-plausible";
import dynamic from "next/dynamic";
import { ChangeEvent, MouseEvent, useMemo, useState } from "react";
import { AnalyticsPlayerStatisticsExplorer } from "@open-fpl/app/features/Analytics/analyticsTypes";

const ComparePlayersModal = dynamic(
  () => import("@open-fpl/app/features/PlayersExplorer/ComparePlayersModal")
);
const PlayersExplorerGridOrChart = dynamic(
  () =>
    import("@open-fpl/app/features/PlayersExplorer/PlayersExplorerGridOrChart")
);
const PlayersExplorerTable = dynamic(
  () => import("@open-fpl/app/features/PlayersExplorer/PlayersExplorerTable")
);

const PlayersExplorer = ({
  players: remotePlayers,
  teams,
  teamFixtures,
  nextGameweekId,
  ...props
}: BoxProps & {
  players: Player[];
  teams: Team[];
  teamFixtures: TeamFixtures[];
  nextGameweekId: number;
}) => {
  const plausible = usePlausible<AnalyticsPlayerStatisticsExplorer>();
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
        teams: adjustTeamsStrength(teams, teamsStrength),
      }),
    [teams, teamsStrength]
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

  const adjustedGameweekPlayers = useMemo(
    () =>
      displayedPlayers.map((player) => ({
        ...player,
        client_data: {
          ...player.client_data,
          gameweeks:
            player.client_data.gameweeks?.slice(
              nextGameweekId,
              nextGameweekId + 5
            ) ?? [],
        },
      })),
    [displayedPlayers, nextGameweekId]
  );

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
        plausible("players-starred-players-remove");
      } else {
        setPreference({
          ...preference,
          starredPlayers: [...(preference?.starredPlayers ?? []), player.id],
        });
        plausible("players-starred-players-add");
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

  const handleCompareClick = () => {
    onOpen();
    plausible("players-compare-players", {
      props: { count: selectedPlayers.length },
    });
  };

  return (
    <>
      {isOpen && (
        <ComparePlayersModal
          isOpen={isOpen}
          onClose={onClose}
          players={selectedPlayers}
        />
      )}
      <Flex direction="column" overflow="hidden" height="100%" {...props}>
        <PlayersExplorerToolbar
          borderBottomWidth={1}
          players={players}
          onResults={setDisplayedPlayers}
          display={display}
          onDisplayChange={handleDisplayChange}
          showCompareButton={selectedPlayers.length > 0}
          onCompareClick={handleCompareClick}
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
            displayedPlayers={adjustedGameweekPlayers}
            selectedPlayers={selectedPlayers}
            onSelectChange={handleSelectChange}
            onStarClick={handleStarClick}
          />
        ) : (
          <PlayersExplorerGridOrChart
            displayedPlayers={adjustedGameweekPlayers}
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
