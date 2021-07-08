import { BoxProps, Flex } from "@chakra-ui/react";
import { useState } from "react";
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
  const { preference, setPreference } = useSettings();
  const [displayedPlayers, setDisplayedPlayers] = useState(players);

  const handleDisplayChange = (
    playersExplorerDisplayOption: DisplayOptions
  ) => {
    setPreference({ ...preference, playersExplorerDisplayOption });
  };

  const display =
    preference?.playersExplorerDisplayOption ?? displayOptions[0].value;

  return (
    <Flex direction="column" overflow="hidden" height="100%" {...props}>
      <PlayersExplorerToolbar
        players={players}
        onSearchResults={setDisplayedPlayers}
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
          displayedPlayers={displayedPlayers}
          display={display}
          gameweeks={gameweeks}
        />
      ) : (
        <PlayersExplorerGridOrChart
          displayedPlayers={displayedPlayers}
          display={display}
          gameweeks={gameweeks}
        />
      )}
    </Flex>
  );
};

export default PlayersExplorer;
