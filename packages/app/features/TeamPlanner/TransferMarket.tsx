import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  VStack,
} from "@chakra-ui/react";
import { ClientPlayer } from "@open-fpl/app/features/PlayerData/playerDataTypes";
import PlayerGridCard from "@open-fpl/app/features/PlayerData/PlayerGridCard";
import { SortOptions } from "@open-fpl/app/features/PlayersExplorer/playersExplorerTypes";
import { sortOptions } from "@open-fpl/app/features/PlayersExplorer/playersToolbarOptions";
import usePlayersFilterAndSort from "@open-fpl/app/features/PlayersExplorer/usePlayersFilterAndSort";
import { FullChangePlayer } from "@open-fpl/app/features/TeamPlanner/teamPlannerTypes";
import {
  CSSProperties,
  KeyboardEvent,
  MouseEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { IoSearchOutline } from "react-icons/io5";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";

const TransferMarket = ({
  team,
  players,
  gameweekDelta,
  onPlayerSelect,
}: {
  team: FullChangePlayer[];
  players: ClientPlayer[];
  gameweekDelta: number;
  onPlayerSelect?: (player: ClientPlayer | null) => void;
}) => {
  const [displayedPlayers, setDisplayedPlayers] = useState(players);

  const { filterQuery, setFilterQuery, sort, setSort, fiterThenSortFn } =
    usePlayersFilterAndSort({
      players,
    });

  useEffect(() => {
    setDisplayedPlayers(fiterThenSortFn(players));
  }, [fiterThenSortFn]);

  const row = useMemo(
    () =>
      ({ index, style }: { index: number; style: CSSProperties }) => {
        const player = displayedPlayers[index];
        const isInTeam = team.some((p) => p.id === player.id);
        const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          onPlayerSelect?.(player);
        };

        const handleKeyUp = (e: KeyboardEvent) => {
          if (e.key === "Escape") {
            onPlayerSelect?.(null);
          }
        };

        return (
          <div
            key={`${index}`}
            style={{
              ...style,
              padding: 1,
            }}
          >
            <Button
              variant="unstyled"
              disabled={isInTeam}
              tabIndex={1}
              width="100%"
              height="auto"
              fontWeight="inherit"
              textAlign="inherit"
              opacity={isInTeam ? 0.2 : 1}
              cursor={isInTeam ? "default" : "pointer"}
              onKeyUp={handleKeyUp}
              onClick={handleClick}
            >
              <PlayerGridCard
                variant="mini"
                player={player}
                gameweekDelta={gameweekDelta}
              />
            </Button>
          </div>
        );
      },
    [displayedPlayers, gameweekDelta]
  );

  return (
    <Flex flexDirection="column" height="100%">
      <Box p={2}>
        <VStack spacing={2}>
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
          <Box width="100%">
            <Select
              variant="filled"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOptions)}
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Box>
        </VStack>
      </Box>
      {displayedPlayers.length === 0 ? (
        <Box py={10} textAlign="center" color="gray.600">
          No players found
        </Box>
      ) : (
        <Box flexGrow={1} px={2} height="100%">
          <AutoSizer>
            {({ height, width }) => (
              <List
                height={height}
                width={width - 2}
                itemCount={Math.ceil(displayedPlayers.length)}
                itemSize={175}
              >
                {row}
              </List>
            )}
          </AutoSizer>
        </Box>
      )}
    </Flex>
  );
};

export default TransferMarket;
