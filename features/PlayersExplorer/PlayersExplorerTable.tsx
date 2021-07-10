import { Box } from "@chakra-ui/react";
import {
  ChangeEvent,
  CSSProperties,
  MouseEvent,
  useMemo,
  useState,
} from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { Gameweek, Player } from "~/features/AppData/appDataTypes";
import PlayerTable, {
  PlayerTableElementType,
  rowHeight,
} from "~/features/PlayerData/PlayerTable";
import playerTableConfigs from "~/features/PlayerData/playerTableConfigs";
import PlayerTableRow from "~/features/PlayerData/PlayerTableRow";
import {
  PlayerTableSortClickType,
  PlayerTableSortColumnConfig,
} from "~/features/PlayerData/playerTableTypes";

const sortPlayers = (
  players: Player[],
  starredPlayers: number[] | null,
  sortColumns: PlayerTableSortColumnConfig[]
): Player[] => {
  return [...players].sort((a, b) => {
    let sortResult = 0;
    const aIndex = starredPlayers?.findIndex((id) => id === a.id) ?? -1;
    const bIndex = starredPlayers?.findIndex((id) => id === b.id) ?? -1;
    if (aIndex > bIndex) sortResult = -1;
    else if (aIndex < bIndex) sortResult = 1;
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
    }
    return sortResult;
  });
};

const PlayersExplorerTable = ({
  displayedPlayers,
  gameweeks,
  selectedPlayers,
  onSelectChange,
  starredPlayers,
  onStarClick,
}: {
  displayedPlayers: Player[];
  gameweeks: Gameweek[];
  selectedPlayers: Player[];
  onSelectChange: (e: ChangeEvent<HTMLInputElement>, player: Player) => void;
  starredPlayers: number[] | null;
  onStarClick: (e: MouseEvent<HTMLButtonElement>, player: Player) => void;
}) => {
  const [sortColumns, setSortColums] = useState<PlayerTableSortColumnConfig[]>(
    []
  );

  const sortedDisplayedPlayers = useMemo(
    () => sortPlayers(displayedPlayers, starredPlayers, sortColumns),
    [displayedPlayers, sortColumns, starredPlayers]
  );

  const row = useMemo(
    () =>
      ({ index, style }: { index: number; style: CSSProperties }) => {
        const player = sortedDisplayedPlayers[index - 1];
        return (
          <PlayerTableRow
            key={player.id}
            style={style}
            isSelected={selectedPlayers.some((p) => p.id === player.id)}
            onSelectChange={(e) => onSelectChange(e, player)}
            isStarred={starredPlayers?.some((p) => p === player.id) ?? false}
            onStarClick={(e) => onStarClick(e, player)}
            player={player}
            gameweeks={gameweeks}
          />
        );
      },
    [gameweeks, selectedPlayers, sortedDisplayedPlayers]
  );

  const handleSort: PlayerTableSortClickType = (e, columnName, direction) => {
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
              onSortClick={handleSort}
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
