import { Box } from "@chakra-ui/react";
import {
  ChangeEvent,
  CSSProperties,
  MouseEvent,
  useMemo,
  useState,
} from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { Gameweek } from "~/features/AppData/appDataTypes";
import { Player } from "~/features/PlayerData/playerDataTypes";
import playersSortFunctions from "~/features/PlayerData/playersSortFunctions";
import PlayerTable, {
  PlayerTableElementType,
  rowHeight,
} from "~/features/PlayerData/PlayerTable";
import playerTableConfigs from "~/features/PlayerData/playerTableConfigs";
import PlayerTableRow from "~/features/PlayerData/PlayerTableRow";
import {
  PlayerTableSortChangeHandler,
  PlayerTableSortColumnConfig,
} from "~/features/PlayerData/playerTableTypes";

const sortPlayers = (
  players: Player[],
  sortColumns: PlayerTableSortColumnConfig[]
): Player[] => {
  return [...players].sort((a, b) => {
    let sortResult = playersSortFunctions.starred(a, b); // always show starred players first
    if (sortResult === 0) {
      for (const column of sortColumns) {
        sortResult = playerTableConfigs[column.columnName]?.sortFn?.(a, b) ?? 0;
        if (sortResult !== 0) {
          const directionFactor =
            column.direction === "desc"
              ? -1
              : column.direction === "asc"
              ? 1
              : 0;
          sortResult *= directionFactor;
          break;
        }
      }

      if (sortResult === 0)
        sortResult =
          a.now_cost > b.now_cost ? -1 : a.now_cost < b.now_cost ? 1 : 0;
    }
    return sortResult;
  });
};

const PlayersExplorerTable = ({
  displayedPlayers,
  gameweeks,
  selectedPlayers,
  onSelectChange,
  onStarClick,
}: {
  displayedPlayers: Player[];
  gameweeks: Gameweek[];
  selectedPlayers: Player[];
  onSelectChange: (e: ChangeEvent<HTMLInputElement>, player: Player) => void;
  onStarClick: (e: MouseEvent<HTMLButtonElement>, player: Player) => void;
}) => {
  const [sortColumns, setSortColums] = useState<PlayerTableSortColumnConfig[]>(
    []
  );

  const sortedDisplayedPlayers = useMemo(
    () => sortPlayers(displayedPlayers, sortColumns),
    [displayedPlayers, sortColumns]
  );

  const row = useMemo(
    () =>
      ({ index, style }: { index: number; style: CSSProperties }) => {
        const player = sortedDisplayedPlayers[index - 1];
        const { width, ...restStyle } = style; // provided width: 100%; broke horizontal scroll with sticky items
        return (
          <PlayerTableRow
            key={player.id}
            style={restStyle}
            isSelected={selectedPlayers.some((p) => p.id === player.id)}
            onSelectChange={(e) => onSelectChange(e, player)}
            isStarred={player.client_data.starred_index > -1}
            onStarClick={(e) => onStarClick(e, player)}
            player={player}
            gameweeks={gameweeks}
          />
        );
      },
    [gameweeks, selectedPlayers, sortedDisplayedPlayers]
  );

  const handleSort: PlayerTableSortChangeHandler = (columnName, direction) => {
    const newSortedColumns = sortColumns.filter(
      (c) => c.columnName !== columnName
    );
    if (direction) {
      newSortedColumns.push({ columnName, direction });
    }
    setSortColums(newSortedColumns);
  };

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
            <PlayerTable
              height={height}
              width={width}
              itemSize={rowHeight + 1} // Pad one pixel for border
              itemCount={sortedDisplayedPlayers.length + 1} // Pad one player for sticky header
              innerElementType={PlayerTableElementType}
              onSortChange={handleSort}
              sortColumns={sortColumns}
            >
              {row}
            </PlayerTable>
          </Box>
        )}
      </AutoSizer>
    </Box>
  );
};

export default PlayersExplorerTable;
