import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  VStack,
} from "@chakra-ui/react";
import {
  CSSProperties,
  KeyboardEvent,
  MouseEvent,
  useMemo,
  useState,
} from "react";
import { IoSearchOutline } from "react-icons/io5";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import { Gameweek, Player } from "~/features/AppData/appDataTypes";
import PlayerGridCard from "~/features/PlayerData/PlayerGridCard";
import { sortOptions } from "~/features/PlayersExplorer/playersToolbarOptions";
import usePlayersToolbar from "~/features/PlayersExplorer/usePlayersToolbar";
import { FullChangePlayer } from "~/features/TransferPlanner/transferPlannerTypes";

const TransferMarket = ({
  team,
  players,
  gameweeks,
  onPlayerSelect,
}: {
  team: FullChangePlayer[];
  players: Player[];
  gameweeks: Gameweek[];
  onPlayerSelect?: (player: Player | null) => void;
}) => {
  const [displayedPlayers, setDisplayedPlayers] = useState(players);

  const { filterQuery, setFilterQuery, sort, setSort } = usePlayersToolbar({
    players,
    onResults: setDisplayedPlayers,
  });

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
              <PlayerGridCard player={player} gameweeks={gameweeks} />
            </Button>
          </div>
        );
      },
    [displayedPlayers, gameweeks]
  );

  return (
    <>
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
              onChange={(e) => setSort(e.target.value)}
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
        <Box px={2} height="100%">
          <AutoSizer>
            {({ height, width }) => (
              <List
                height={height - 100}
                width={width - 2}
                itemCount={Math.ceil(displayedPlayers.length)}
                itemSize={260}
              >
                {row}
              </List>
            )}
          </AutoSizer>
        </Box>
      )}
    </>
  );
};

export default TransferMarket;
