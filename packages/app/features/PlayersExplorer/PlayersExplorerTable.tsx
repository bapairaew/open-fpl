import {
  Box,
  Checkbox,
  Flex,
  Icon,
  IconButton,
  Link as A,
  Td,
  useColorMode,
} from "@chakra-ui/react";
import { AnalyticsPlayerStatisticsExplorer } from "@open-fpl/app/features/Analytics/analyticsTypes";
import StickyHeaderTable from "@open-fpl/app/features/Common/StickyHeaderTable";
import { ClientPlayer } from "@open-fpl/app/features/PlayerData/playerDataTypes";
import playerTableConfigs from "@open-fpl/app/features/PlayerData/playerTableConfigs";
import PlayerTableHeaderRow from "@open-fpl/app/features/PlayerData/PlayerTableHeaderRow";
import PlayerTableRow from "@open-fpl/app/features/PlayerData/PlayerTableRow";
import {
  PlayerTableConfig,
  PlayerTableSortChangeHandler,
  PlayerTableSortColumnConfig,
} from "@open-fpl/app/features/PlayerData/playerTableTypes";
import sortPlayerTable from "@open-fpl/app/features/PlayerData/sortPlayerTable";
import { useSettings } from "@open-fpl/app/features/Settings/Settings";
import { usePlausible } from "next-plausible";
import { ChangeEvent, CSSProperties, MouseEvent, useMemo } from "react";
import { IoOpenOutline, IoStar, IoStarOutline } from "react-icons/io5";
import AutoSizer from "react-virtualized-auto-sizer";

const PlayersExplorerTable = ({
  displayedPlayers,
  selectedPlayers,
  onSelectChange,
  onStarClick,
}: {
  displayedPlayers: ClientPlayer[];
  selectedPlayers: ClientPlayer[];
  onSelectChange: (
    e: ChangeEvent<HTMLInputElement>,
    player: ClientPlayer
  ) => void;
  onStarClick: (e: MouseEvent<HTMLButtonElement>, player: ClientPlayer) => void;
}) => {
  const plausible = usePlausible<AnalyticsPlayerStatisticsExplorer>();
  const {
    playersExplorerTableSortColumns,
    setPlayersExplorerTableSortColumns,
  } = useSettings();

  const configs = [
    {
      header: "Tool",
      columnWidth: 92,
      hideHeader: true,
      hideMenu: true,
      render: ({ player }) => {
        const { colorMode } = useColorMode();
        const isSelected = selectedPlayers.some((p) => p.id === player.id);
        const isStarred = player.client_data.starred_index > -1;
        return (
          <Td
            p={0}
            bgColor={colorMode === "dark" ? "gray.800" : "white"}
            fontWeight="bold"
          >
            <Flex alignItems="center" px={2}>
              <Checkbox
                mr={1}
                size="lg"
                aria-label="select player"
                borderWidth={0}
                isChecked={isSelected}
                onChange={(e) => onSelectChange(e, player)}
                borderRadius="none"
              />
              <IconButton
                mr={1}
                size="xs"
                aria-label="star player"
                icon={<Icon as={isStarred ? IoStar : IoStarOutline} />}
                variant={isStarred ? "solid" : "ghost"}
                onClick={(e) => onStarClick(e, player)}
              />
              <A
                isExternal
                href={
                  player.linked_data?.understat_id
                    ? `https://understat.com/player/${player.linked_data.understat_id}`
                    : `https://understat.com/league/EPL`
                }
              >
                <IconButton
                  as="span"
                  size="xs"
                  variant="ghost"
                  aria-label="open in Understat"
                  icon={<Icon as={IoOpenOutline} />}
                />
              </A>
            </Flex>
          </Td>
        );
      },
    },
    ...playerTableConfigs,
  ] as PlayerTableConfig[];

  const sortColumns =
    playersExplorerTableSortColumns ?? ([] as PlayerTableSortColumnConfig[]);

  const setSortColums = (sortColumns: PlayerTableSortColumnConfig[]) => {
    if (sortColumns) {
      setPlayersExplorerTableSortColumns(sortColumns);
      plausible("players-columns-sort", {
        props: { columns: sortColumns.map((s) => s.columnName) },
      });
    }
  };

  const sortedDisplayedPlayers = useMemo(
    () => sortPlayerTable(displayedPlayers, sortColumns, configs),
    [displayedPlayers, sortColumns]
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

  const row = useMemo(
    () =>
      ({ index, style }: { index: number; style: CSSProperties }) => {
        const player = sortedDisplayedPlayers[index - 1];
        const { width, ...restStyle } = style; // provided width: 100%; broke horizontal scroll with sticky items
        return (
          <PlayerTableRow
            key={player.id}
            style={restStyle}
            player={player}
            configs={configs}
          />
        );
      },
    [selectedPlayers, sortedDisplayedPlayers]
  );

  return (
    <Box flexGrow={1}>
      <AutoSizer>
        {({ height, width }) => (
          <Box
            display="block"
            overflow="auto"
            height={`${height}px`}
            width={`${width}px`}
            flexGrow={1}
          >
            <StickyHeaderTable
              height={height}
              width={width}
              itemSize={33}
              itemCount={sortedDisplayedPlayers.length + 1} // Pad one player for sticky header
              headerRow={
                <PlayerTableHeaderRow
                  configs={configs}
                  onSortChange={handleSort}
                  sortColumns={sortColumns}
                  height="30px"
                />
              }
            >
              {row}
            </StickyHeaderTable>
          </Box>
        )}
      </AutoSizer>
    </Box>
  );
};

export default PlayersExplorerTable;
