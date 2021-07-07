import { Box } from "@chakra-ui/react";
import { CSSProperties, useMemo } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import { Gameweek, Player } from "~/features/AppData/appDataTypes";
import PlayerTable, {
  PlayerTableRow,
  rowHeight,
} from "~/features/PlayerData/PlayerTable";

const PlayersExplorerTable = ({
  displayedPlayers,
  display,
  gameweeks,
}: {
  displayedPlayers: Player[];
  display: string;
  gameweeks: Gameweek[];
}) => {
  const row = useMemo(
    () =>
      ({ index, style }: { index: number; style: CSSProperties }) => {
        return index === 0 ? null : (
          <PlayerTableRow
            key={displayedPlayers[index - 1].id}
            style={style}
            player={displayedPlayers[index - 1]}
            gameweeks={gameweeks}
          />
        );
      },
    [gameweeks, displayedPlayers, display]
  );

  return (
    <Box flexGrow={1}>
      <AutoSizer>
        {({ height, width }) => (
          <Box
            colorScheme="gray"
            display="block"
            overflow="auto"
            height={`${height}px`}
            width={`${width}px`}
            flexGrow={1}
          >
            <List
              height={height}
              width={width}
              itemSize={rowHeight + 1} // Pad one pixel for border
              itemCount={displayedPlayers.length + 1} // Pad one item to accomodate sticky header
              innerElementType={PlayerTable}
            >
              {row}
            </List>
          </Box>
        )}
      </AutoSizer>
    </Box>
  );
};

export default PlayersExplorerTable;
