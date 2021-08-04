import {
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Th,
} from "@chakra-ui/react";
import StickyHeaderTable from "@open-fpl/app/features/Common/Table/StickyHeaderTable";
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
import usePlayersFilterAndSort from "@open-fpl/app/features/PlayersExplorer/usePlayersFilterAndSort";
import { FullChangePlayer } from "@open-fpl/app/features/TeamPlanner/teamPlannerTypes";
import { CSSProperties, useEffect, useMemo, useState } from "react";
import {
  IoCheckmark,
  IoSearchOutline,
  IoSwapHorizontal,
} from "react-icons/io5";
import AutoSizer from "react-virtualized-auto-sizer";

const TransferMarket = ({
  team,
  selectedPlayer,
  players,
  onPlayerSelect,
}: {
  team: FullChangePlayer[];
  selectedPlayer: ClientPlayer | null;
  players: ClientPlayer[];
  onPlayerSelect?: (player: ClientPlayer | null) => void;
}) => {
  const [displayedPlayers, setDisplayedPlayers] = useState(players);
  const [sortColumns, setSortColumns] = useState(
    [] as PlayerTableSortColumnConfig[]
  );

  const { filterQuery, setFilterQuery, fiterThenSortFn } =
    usePlayersFilterAndSort({
      players,
    });

  useEffect(() => {
    setDisplayedPlayers(fiterThenSortFn(players));
  }, [fiterThenSortFn]);

  const configs = useMemo(
    () =>
      [
        {
          header: "Tool",
          columnWidth: "40px",
          hideHeader: true,
          hideMenu: true,
          sticky: "0px",
          render: ({ player, config }) => {
            return (
              <Th p={0} position="sticky" left={config.sticky}>
                <Flex
                  alignItems="center"
                  px={2}
                  width={`${config.columnWidth}px`}
                >
                  {player.id === selectedPlayer?.id ||
                  team.some((p) => p.id === player.id) ? (
                    <IconButton
                      size="xs"
                      variant="outline"
                      aria-label="in team"
                      borderRadius="none"
                      disabled
                      icon={<Icon as={IoCheckmark} />}
                      onClick={() => onPlayerSelect?.(player)}
                    />
                  ) : (
                    <IconButton
                      size="xs"
                      variant="outline"
                      aria-label="transfer"
                      borderRadius="none"
                      icon={<Icon as={IoSwapHorizontal} />}
                      onClick={() => onPlayerSelect?.(player)}
                    />
                  )}
                </Flex>
              </Th>
            );
          },
        },
        {
          ...playerTableConfigs[0],
          sticky: "40px",
        },
        ...playerTableConfigs.slice(1),
      ] as PlayerTableConfig[],
    [playerTableConfigs]
  );

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
    setSortColumns(newSortedColumns);
  };

  const row = useMemo(
    () =>
      ({ index, style }: { index: number; style: CSSProperties }) => {
        const player = sortedDisplayedPlayers[index - 2];
        const { width, ...restStyle } = style; // provided width: 100%; broke horizontal scroll with sticky items
        return player ? (
          <PlayerTableRow
            key={player.id}
            style={restStyle}
            player={player}
            configs={configs}
          />
        ) : null;
      },
    [sortedDisplayedPlayers]
  );

  return (
    <Flex flexDirection="column" height="100%">
      <Box p={2}>
        <HStack spacing={2}>
          <InputGroup variant="filled">
            <InputLeftElement
              pointerEvents="none"
              children={<IoSearchOutline />}
            />
            <Input
              placeholder="Search"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
            />
          </InputGroup>
        </HStack>
      </Box>
      {displayedPlayers.length === 0 ? (
        <Box py={10} textAlign="center" color="gray.600">
          No players found
        </Box>
      ) : (
        <Box flexGrow={1} px={2} height="100%">
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
                <StickyHeaderTable
                  height={height}
                  width={width}
                  itemSize={33}
                  itemCount={sortedDisplayedPlayers.length + 2} // Pad two players for sticky header
                  stickyCount={1}
                  headerRow={
                    <>
                      <PlayerTableHeaderRow
                        configs={configs}
                        onSortChange={handleSort}
                        sortColumns={sortColumns}
                        height="30px"
                      />
                      {selectedPlayer && (
                        <PlayerTableRow
                          player={selectedPlayer}
                          configs={configs}
                          height="30px"
                        />
                      )}
                    </>
                  }
                >
                  {row}
                </StickyHeaderTable>
              </Box>
            )}
          </AutoSizer>
        </Box>
      )}
    </Flex>
  );
};

export default TransferMarket;
