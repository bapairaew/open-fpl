import { Box, Checkbox, Flex, IconButton, Link as A } from "@chakra-ui/react";
import { ClientPlayer } from "@open-fpl/app/features/PlayerData/playerDataTypes";
import playerTableConfigs from "@open-fpl/app/features/PlayerData/playerTableConfigs";
import {
  PlayerTableConfig,
  PlayerTableSortChangeHandler,
  PlayerTableSortColumnConfig,
} from "@open-fpl/app/features/PlayerData/playerTableTypes";
import sortPlayerTable from "@open-fpl/app/features/PlayerData/sortPlayerTable";
import { useSettings } from "@open-fpl/app/features/Settings/Settings";
// import { usePlausible } from "next-plausible";
import { ChangeEvent, CSSProperties, MouseEvent, useMemo } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeGrid as Grid } from "react-window";
import { getPaddedPastMatches } from "../PlayerData/PreviousStatsSection";

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
  // const plausible = usePlausible<AnalyticsPlayerStatisticsExplorer>();
  const {
    playersExplorerTableSortColumns,
    setPlayersExplorerTableSortColumns,
  } = useSettings();

  const configs = useMemo(
    () =>
      [
        {
          header: "Tool",
          columnWidth: 92,
          hideHeader: true,
          hideMenu: true,
          render: ({ player }) => {
            const isSelected = selectedPlayers.some((p) => p.id === player.id);
            const isStarred = player.client_data.starred_index > -1;
            return (
              <Box p={0} fontWeight="bold">
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
                    aria-label={
                      isStarred ? "remove star player" : "add star player"
                    }
                    icon={isStarred ? <>★</> : <>☆</>}
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
                      icon={<>⤴</>}
                    />
                  </A>
                </Flex>
              </Box>
            );
          },
        },
        ...playerTableConfigs,
      ] as PlayerTableConfig[],
    [selectedPlayers, playerTableConfigs, onSelectChange, onStarClick]
  );

  const sortColumns =
    playersExplorerTableSortColumns ?? ([] as PlayerTableSortColumnConfig[]);

  const setSortColums = (sortColumns: PlayerTableSortColumnConfig[]) => {
    if (sortColumns) {
      setPlayersExplorerTableSortColumns(sortColumns);
      // plausible("players-columns-sort", {
      //   props: { columns: sortColumns.map((s) => s.columnName) },
      // });
    }
  };

  const sortedDisplayedPlayers = useMemo(
    () => sortPlayerTable(displayedPlayers, sortColumns, configs),
    [displayedPlayers, sortColumns, configs]
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

  const cell = useMemo(
    () =>
      ({
        columnIndex,
        rowIndex,
        style,
      }: {
        columnIndex: number;
        rowIndex: number;
        style: CSSProperties;
      }) => {
        const config = configs[columnIndex];
        const player = sortedDisplayedPlayers[rowIndex];
        const pastMatches = getPaddedPastMatches(player);
        const { width, ...restStyle } = style; // provided width: 100%; broke horizontal scroll with sticky items
        return (
          <div style={restStyle}>
            {config?.render({
              player,
              config,
              pastMatches,
            })}
          </div>
        );
      },
    [sortedDisplayedPlayers, configs]
  );

  return (
    <Box as="section" aria-label="players statistics" flexGrow={1}>
      <AutoSizer>
        {({ height, width }) => (
          <Box
            display="block"
            overflow="auto"
            height={`${height}px`}
            width={`${width}px`}
            flexGrow={1}
          >
            <Grid
              columnCount={configs.length}
              columnWidth={(index: number) => configs[index]?.columnWidth}
              rowCount={sortedDisplayedPlayers.length}
              rowHeight={() => 33}
              height={height}
              width={width}
            >
              {cell}
            </Grid>
          </Box>
        )}
      </AutoSizer>
    </Box>
  );
};

export default PlayersExplorerTable;
