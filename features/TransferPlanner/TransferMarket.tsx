import { Box, Button } from "@chakra-ui/react";
import {
  CSSProperties,
  KeyboardEvent,
  MouseEvent,
  useMemo,
  useState,
} from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import { Gameweek, Player } from "~/features/AppData/appDataTypes";
import PlayerCard from "~/features/PlayerCard/PlayerCard";
import PlayerSearchBar from "~/features/PlayersExplorer/PlayerSearchBar";
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

  const Row = useMemo(
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
              <PlayerCard player={player} gameweeks={gameweeks} />
            </Button>
          </div>
        );
      },
    [displayedPlayers, gameweeks]
  );

  return (
    <>
      <Box p={2}>
        <PlayerSearchBar
          onResults={setDisplayedPlayers}
          players={players}
          direction="column"
        />
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
                {Row}
              </List>
            )}
          </AutoSizer>
        </Box>
      )}
    </>
  );
};

export default TransferMarket;
