import { Box } from "@chakra-ui/react";
import {
  ChangeEvent,
  CSSProperties,
  MouseEvent,
  useMemo,
  useState,
} from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { Gameweek } from "@open-fpl/data/features/AppData/appDataTypes";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import playersSortFunctions from "@open-fpl/app/features/PlayerData/playersSortFunctions";
import PlayerTable, {
  PlayerTableElementType,
  rowHeight,
} from "@open-fpl/app/features/PlayerData/PlayerTable";
import playerTableConfigs from "@open-fpl/app/features/PlayerData/playerTableConfigs";
import PlayerTableRow from "@open-fpl/app/features/PlayerData/PlayerTableRow";
import {
  PlayerTableSortChangeHandler,
  PlayerTableSortColumnConfig,
} from "@open-fpl/app/features/PlayerData/playerTableTypes";
import { useSettings } from "@open-fpl/app/features/Settings/SettingsContext";

const sortPlayers = (
  players: Player[],
  sortColumns: PlayerTableSortColumnConfig[]
): Player[] => {
  return [...players].sort((a, b) => {
    // always show starred players first
    let sortResult = playersSortFunctions.starred(a, b);

    if (sortResult === 0) {
      for (const column of sortColumns) {
        sortResult =
          column.direction === "desc"
            ? playerTableConfigs[column.columnName]?.sortFn?.(a, b) ?? 0
            : playerTableConfigs[column.columnName]?.reversedSortFn?.(a, b) ??
              0;
        if (sortResult !== 0) {
          // break early if we have a non-zero sort result
          break;
        }
      }
    }

    if (sortResult === 0)
      // if we didn't find a sort result, use the default sort order
      sortResult = playerTableConfigs.Cost.reversedSortFn?.(a, b) ?? 0;
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
  const {
    playersExplorerTableSortColumns,
    setPlayersExplorerTableSortColumns,
  } = useSettings();

  const sortColumns =
    playersExplorerTableSortColumns ?? ([] as PlayerTableSortColumnConfig[]);
  const setSortColums = (sortColumns: PlayerTableSortColumnConfig[]) => {
    if (playersExplorerTableSortColumns) {
      setPlayersExplorerTableSortColumns(sortColumns);
    }
  };

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
