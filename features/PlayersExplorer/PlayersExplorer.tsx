import { BoxProps, Flex, useDisclosure } from "@chakra-ui/react";
import { ChangeEvent, MouseEvent, useState } from "react";
import { Gameweek, Player } from "~/features/AppData/appDataTypes";
import PlayersExplorerGridOrChart from "~/features/PlayersExplorer/PlayersExplorerGridOrChart";
import PlayersExplorerTable from "~/features/PlayersExplorer/PlayersExplorerTable";
import PlayersExplorerToolbar from "~/features/PlayersExplorer/PlayersExplorerToolbar";
import { displayOptions } from "~/features/PlayersExplorer/playersToolbarOptions";
import { useSettings } from "~/features/Settings/SettingsContext";
import ComparePlayersModal from "./ComparePlayersModal";
import { DisplayOptions } from "./playersExplorerTypes";

const PlayersExplorer = ({
  players,
  gameweeks,
  ...props
}: BoxProps & {
  players: Player[];
  gameweeks: Gameweek[];
}) => {
  const { preference, setPreference, starredPlayers, setStarredPlayers } =
    useSettings();
  const [displayedPlayers, setDisplayedPlayers] = useState(players);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDisplayChange = (
    playersExplorerDisplayOption: DisplayOptions
  ) => {
    setPreference({ ...preference, playersExplorerDisplayOption });
  };

  const display =
    preference?.playersExplorerDisplayOption ?? displayOptions[0].value;

  const handleStarClick = (
    e: MouseEvent<HTMLButtonElement>,
    player: Player
  ) => {
    if (starredPlayers) {
      if (starredPlayers.some((p) => p === player.id)) {
        setStarredPlayers(starredPlayers.filter((p) => p !== player.id));
      } else {
        setStarredPlayers([...starredPlayers, player.id]);
      }
    }
  };

  const handleSelectChange = (
    e: ChangeEvent<HTMLInputElement>,
    player: Player
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
          players={players}
          starredPlayers={starredPlayers}
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
            gameweeks={gameweeks}
            selectedPlayers={selectedPlayers}
            onSelectChange={handleSelectChange}
            starredPlayers={starredPlayers}
            onStarClick={handleStarClick}
          />
        ) : (
          <PlayersExplorerGridOrChart
            displayedPlayers={displayedPlayers}
            display={display}
            gameweeks={gameweeks}
            selectedPlayers={selectedPlayers}
            onSelectChange={handleSelectChange}
            starredPlayers={starredPlayers}
            onStarClick={handleStarClick}
          />
        )}
      </Flex>
    </>
  );
};

export default PlayersExplorer;
