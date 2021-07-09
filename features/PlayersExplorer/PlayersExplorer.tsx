import { BoxProps, Flex } from "@chakra-ui/react";
import { MouseEvent, useState } from "react";
import { Gameweek, Player } from "~/features/AppData/appDataTypes";
import PlayersExplorerGridOrChart from "~/features/PlayersExplorer/PlayersExplorerGridOrChart";
import PlayersExplorerTable from "~/features/PlayersExplorer/PlayersExplorerTable";
import PlayersExplorerToolbar from "~/features/PlayersExplorer/PlayersExplorerToolbar";
import { displayOptions } from "~/features/PlayersExplorer/playersToolbarOptions";
import { useSettings } from "~/features/Settings/SettingsContext";
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

  return (
    <Flex direction="column" overflow="hidden" height="100%" {...props}>
      <PlayersExplorerToolbar
        players={players}
        starredPlayers={starredPlayers}
        onResults={setDisplayedPlayers}
        display={display}
        onDisplayChange={handleDisplayChange}
        disabledSorting={display === "table"}
        sortingTooltipLabel={
          display === "table"
            ? "The data is sorted by the table's header row"
            : undefined
        }
      />
      {display === "table" ? (
        <PlayersExplorerTable
          players={players} // PlayersExplorerTable has its own internal sorting logic
          gameweeks={gameweeks}
          starredPlayers={starredPlayers}
          onStarClick={handleStarClick}
        />
      ) : (
        <PlayersExplorerGridOrChart
          displayedPlayers={displayedPlayers}
          display={display}
          gameweeks={gameweeks}
          starredPlayers={starredPlayers}
          onStarClick={handleStarClick}
        />
      )}
    </Flex>
  );
};

export default PlayersExplorer;
